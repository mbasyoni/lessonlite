# LessonLite 0.1.0 verification

Recorded 30 October 2026 UTC.

## Independent unit and source review

49 Node tests passed, with zero failures. Run `node --test tests/core.test.cjs`. Coverage includes schema/type/bounds checks, source paragraph indices, Unicode and JSON escaping, import/export byte limits, source retention, restrictive export CSP, script-free HTML and combined pending-draft state. Independent source review verified the corrections described below.

## Bounded browser checks

An operator tested the application in a managed desktop Chrome preview. This is an operator record, not an independent repeat of browser testing or a full automated execution trace.

Observed checks included initial disabled controls; synthetic example loading; paragraph selection; manual card creation; source links and coverage; keyboard answer disclosure; text size and contrast; actual JSON and HTML downloads; saved-project reimport; malformed JSON rejection preserving prior state; injection payloads displayed as text; card removal; source replacement confirmation and cancellation; and a desktop visual check. The included screenshot and synthetic example exports illustrate these checks.

The final regression imported a 100-card Unicode project and downloaded a byte-identical 1,158,226-byte saved copy. Independent comparison verified the retained input/output bytes. Regression also observed protection for notes-only drafts and a warning after saving when changed notes or an unfinished card remained outside the saved project.

## Corrected defects

Import and export now share a 3,000,000-byte UTF-8 ceiling; tests include maximum Unicode and escaped strings. Earlier smaller import limits could reject an application-generated project.

Pending notes and card fields now participate in combined draft-state checks. Replacement protects existing lessons, including zero-card lessons. Saving does not clear protection for unapplied notes or unfinished cards. Added cards clear their draft after successful validation and insertion. Drafts are not persisted automatically.

## Not established

The native leave/reload warning dialog was not accepted in the browser automation environment. The handler and combined-state logic are tested, but a native prompt is not guaranteed. Save and verify downloaded files before closing.

Direct file-mode acceptance, disconnected-browser operation, print/PDF pagination, physical phones, macOS/Windows-specific acceptance, Safari, Firefox, screen readers, accessibility conformance and learner outcome studies have not been completed. Browser-local/offline support describes the design, not a tested claim across every device. No native installer is supplied.

Source links do not validate the lesson's facts, the author's answers, or learning effectiveness. No contest eligibility or acceptance is asserted.
