/* LessonLite 0.1.0. New event-built code. MIT. */
(function (root) {
'use strict';
const limits = Object.freeze({source:40000, paragraphs:150, cards:100, title:120, question:600, answer:2400, terms:300, projectBytes:3000000});
function text(value, max, name, required=true) {
 if (typeof value !== 'string') throw Error(name+' must be text.');
 if (value.length > max) throw Error(name+' exceeds '+max+' characters.');
 if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(value)) throw Error(name+' contains unsupported control characters.');
 if (required && !value.trim()) throw Error(name+' is required.');
 return value.trim();
}
function paragraphs(source) {
 const value=text(source,limits.source,'Lesson notes');
 const parts=value.split(/\n\s*\n/).map(x=>x.trim()).filter(Boolean);
 if (parts.length>limits.paragraphs) throw Error('Use no more than '+limits.paragraphs+' paragraphs.');
 return parts;
}
function validate(input) {
 if (!input || typeof input!=='object' || Array.isArray(input) || input.version!==1) throw Error('Unsupported LessonLite project.');
 const title=text(input.title,limits.title,'Title');
 const source=text(input.source,limits.source,'Lesson notes'); const parts=paragraphs(source);
 if(!Array.isArray(input.cards)||input.cards.length>limits.cards)throw Error('Invalid card list (maximum 100).');
 const cards=input.cards.map((c,i)=>{
  if(!c||typeof c!=='object'||!Number.isInteger(c.sourceIndex)||c.sourceIndex<0||c.sourceIndex>=parts.length)throw Error('Card '+(i+1)+' needs a valid source paragraph.');
  return {sourceIndex:c.sourceIndex,heading:text(c.heading,limits.title,'Section',false),terms:text(c.terms,limits.terms,'Key terms',false),question:text(c.question,limits.question,'Question'),answer:text(c.answer,limits.answer,'Answer')};
 });
 return {version:1,title,source,cards};
}
function serializeProject(input) {
 const raw=JSON.stringify(validate(input),null,2);
 if(new TextEncoder().encode(raw).byteLength>limits.projectBytes)throw Error('Project exceeds the supported byte limit.');
 return raw;
}
function parseProject(raw) {
 if(typeof raw!=='string'||new TextEncoder().encode(raw).byteLength>limits.projectBytes)throw Error('Project file is too large (3,000,000 bytes maximum).');
 return validate(JSON.parse(raw));
}
function draftState(project, fields, projectDirty=false) {
 const notes=fields.notes !== (project?.source||'');
 const card=['heading','terms','question','answer'].some(k=>Boolean(fields[k]));
 const title=!project&&fields.title!=='My study pack';
 return {notes,card,title,unsaved:Boolean(projectDirty||notes||card||title)};
}
function escape(value) {return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
const exportStyle='body{font:1.15rem/1.7 system-ui,sans-serif;max-width:56rem;margin:2rem auto;padding:0 1rem;color:#182638;background:#fff}h1,h2{line-height:1.2}article{border:1px solid #8a98a8;border-radius:12px;padding:1.3rem;margin:1.2rem 0}summary{cursor:pointer;font-weight:700;padding:.4rem}summary:focus-visible,a:focus-visible{outline:3px solid #006b65;outline-offset:4px}.text{white-space:pre-wrap;overflow-wrap:anywhere}blockquote{border-left:4px solid #006b65;padding-left:1rem;margin-left:0}.meta{font-size:.95rem}a{color:#005c58}@media print{body{max-width:none}article{break-inside:avoid}details>*{display:block!important}summary{list-style:none}}';
function exportHTML(input, prefs={}) {
 const p=validate(input), parts=paragraphs(p.source); if(!p.cards.length)throw Error('Add at least one card before exporting.');
 const size=['standard','large','largest'].includes(prefs.size)?prefs.size:'standard';
 const extra=(size==='large'?'body{font-size:1.35rem}':size==='largest'?'body{font-size:1.6rem}':'')+(prefs.contrast?'body{color:#000}article{border:2px solid #000}':'');
 return '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src \'none\'; style-src \'unsafe-inline\'; base-uri \'none\'; form-action \'none\'"><title>'+escape(p.title)+' | LessonLite</title><style>'+exportStyle+extra+'</style><body><header><p>LESSONLITE · OFFLINE STUDY PACK</p><h1>'+escape(p.title)+'</h1><p>'+p.cards.length+' source-linked study cards. Answers are written by the pack author, not generated or fact-checked by LessonLite.</p><p>Use Tab and Enter/Space to reveal answers. For printing, open the answers you want included, or use the complete answer key below.</p></header><main>'+p.cards.map((c,i)=>'<article aria-labelledby="card'+i+'"><p class="meta">'+escape(c.heading||'Study card')+' · Paragraph '+(c.sourceIndex+1)+'</p><h2 id="card'+i+'">'+escape(c.question)+'</h2>'+(c.terms?'<p class="text"><strong>Key terms:</strong> '+escape(c.terms)+'</p>':'')+'<details><summary>Reveal answer</summary><p class="text">'+escape(c.answer)+'</p></details><details><summary>Read source paragraph</summary><blockquote class="text">'+escape(parts[c.sourceIndex])+'</blockquote></details></article>').join('')+'<section><h2>Complete answer key</h2>'+p.cards.map((c,i)=>'<h3>'+(i+1)+'. '+escape(c.question)+'</h3><p class="text">'+escape(c.answer)+'</p>').join('')+'</section><section><h2>Original lesson notes</h2><div class="text">'+escape(p.source)+'</div></section></main><footer><p>Created with LessonLite 0.1.0. No account or network connection is required to read this pack.</p></footer></body></html>';
}
const api={limits,paragraphs,validate,serializeProject,parseProject,draftState,escape,exportHTML}; if(typeof module!=='undefined')module.exports=api; else root.LessonLite=api;
})(typeof globalThis!=='undefined'?globalThis:this);
