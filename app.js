'use strict';
const $=id=>document.getElementById(id), L=LessonLite;
let project=null, dirty=false, importToken=0;
const sample={title:'Water moving through our world',source:'Evaporation changes liquid water into water vapour. Energy from the Sun helps water evaporate from oceans, lakes and other surfaces.\n\nCondensation happens when water vapour cools and becomes tiny liquid droplets. Clouds contain droplets or ice crystals.\n\nPrecipitation returns water from clouds to the ground as rain, snow or other forms. Water can collect in rivers, seep into the ground, or return to the ocean.'};
function status(message,error=false){$('status').textContent=message;$('status').classList.toggle('error',error);}
function node(tag,text,cls){const el=document.createElement(tag);if(text!==undefined)el.textContent=text;if(cls)el.className=cls;return el;}
function prefs(){return {size:$('size').value,contrast:$('contrast').checked};}
function render(){
 $('builder').disabled=!project;$('save').disabled=!project;$('html').disabled=!project?.cards.length;
 $('packTitle').textContent=project?.title||'Your study pack';$('count').textContent=(project?.cards.length||0)+' cards';
 const parts=project?L.paragraphs(project.source):[];const selected=$('paragraph').value;
 $('paragraph').replaceChildren(...parts.map((p,i)=>{const o=node('option','Paragraph '+(i+1)+' · '+p.slice(0,65));o.value=i;return o;}));
 if(selected!=='' && parts[Number(selected)])$('paragraph').value=selected;
 $('quote').textContent=parts[Number($('paragraph').value)]||'';
 const used=new Set(project?.cards.map(c=>c.sourceIndex));$('coverage').textContent=project?used.size+' of '+parts.length+' source paragraphs linked. Coverage is a planning aid, not a measure of understanding.':'No lesson loaded.';
 $('cards').replaceChildren();
 if(!project?.cards.length)$('cards').append(node('p','Your cards will appear here. Reveal each answer when you are ready.','empty'));
 project?.cards.forEach((c,i)=>{const a=node('article',undefined,'card');a.append(node('small',(c.heading||'Study card')+' · Source paragraph '+(c.sourceIndex+1)),node('h3',c.question));if(c.terms)a.append(node('p','Key terms: '+c.terms));const d=node('details');d.append(node('summary','Reveal answer'),node('p',c.answer));const source=node('details');source.append(node('summary','Read source paragraph'),node('blockquote',parts[c.sourceIndex],'source'));const remove=node('button','Remove card '+(i+1));remove.type='button';remove.onclick=()=>{project.cards.splice(i,1);dirty=true;render();status('Card removed.');$('html').disabled?$('question').focus():$('html').focus();};a.append(d,source,remove);$('cards').append(a);});
}
function clearDraft(){for(const id of ['heading','terms','question','answer'])$(id).value='';$('paragraph').value='0';}
function safe(action){try{action();}catch(e){status(e.message,true);}}
function drafts(){return L.draftState(project,Object.fromEntries(['title','notes','heading','terms','question','answer'].map(id=>[id,$(id).value])),dirty);}
function replaceAllowed(adoptingNotes=false){return (!project && (!drafts().unsaved || adoptingNotes && !drafts().card))||confirm('Replace the current lesson and discard any unapplied notes or unfinished card? Downloaded projects include only loaded notes and added cards. Cancel to keep working.');}
$('load').onclick=()=>safe(()=>{const candidate=L.validate({version:1,title:$('title').value,source:$('notes').value,cards:[]});if(!replaceAllowed(true))return;importToken++;project=candidate;$('title').value=project.title;$('notes').value=project.source;dirty=true;clearDraft();render();status('Lesson loaded. Choose a paragraph and write your first card.');$('question').focus();});
$('example').onclick=()=>safe(()=>{if(!replaceAllowed())return;importToken++;project=L.validate({version:1,...sample,cards:[{sourceIndex:0,heading:'Changes of state',terms:'evaporation, water vapour',question:'What happens to water during evaporation?',answer:'Liquid water changes into water vapour.'}]});$('title').value=project.title;$('notes').value=project.source;dirty=true;clearDraft();render();status('Synthetic sample loaded. Try revealing the answer, then add your own card.');});
$('paragraph').onchange=()=>{$('quote').textContent=L.paragraphs(project.source)[Number($('paragraph').value)];};
$('cardForm').onsubmit=e=>{e.preventDefault();safe(()=>{const card={sourceIndex:Number($('paragraph').value),heading:$('heading').value,terms:$('terms').value,question:$('question').value,answer:$('answer').value};project=L.validate({...project,cards:[...project.cards,card]});dirty=true;clearDraft();render();status('Card added. '+project.cards.length+' cards in your pack.');$('question').focus();});};
function download(name,content,type){const url=URL.createObjectURL(new Blob([content],{type}));const a=node('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),15000);}
$('html').onclick=()=>safe(()=>{download('lessonlite-study-pack.html',L.exportHTML(project,prefs()),'text/html');status('Study pack download requested. Save the editable project too if you want to keep editing later.');});
$('save').onclick=()=>safe(()=>{download('lessonlite-project.json',L.serializeProject(project),'application/json');dirty=false;status(drafts().unsaved?'Loaded project downloaded. Unapplied notes or an unfinished card are NOT saved; apply/add them before closing.':'Project download requested. Check your downloads before closing this page.');});
$('import').onchange=async()=>{const file=$('import').files[0];if(!file)return;const token=++importToken;try{if(file.size>L.limits.projectBytes)throw Error('Project file is too large ('+L.limits.projectBytes.toLocaleString('en-US')+' bytes maximum).');const raw=await file.text();if(token!==importToken)return;const candidate=L.parseProject(raw);if(!replaceAllowed())return;project=candidate;dirty=false;$('title').value=project.title;$('notes').value=project.source;clearDraft();render();status('Saved project opened.');}catch(e){status('Could not open project: '+e.message,true);}finally{$('import').value='';}};
function applyPrefs(){document.body.classList.remove('large','largest','contrast');if($('size').value!=='standard')document.body.classList.add($('size').value);if($('contrast').checked)document.body.classList.add('contrast');}
$('size').onchange=applyPrefs;$('contrast').onchange=applyPrefs;
$('title').oninput=()=>{dirty=true;if(project){project.title=$('title').value;$('packTitle').textContent=project.title;}};
$('notes').oninput=()=>{dirty=true;status('Notes edited. Click Use these notes to replace the loaded lesson; existing cards will need to be rebuilt.');};
window.addEventListener('beforeunload',e=>{if(drafts().unsaved){e.preventDefault();e.returnValue='';}});
render();
