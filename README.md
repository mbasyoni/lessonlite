# LessonLite 0.1.0

A small, independent, browser-local tool for turning your own lesson notes into source-linked study cards and an offline study pack. Created as an independent AccessED Hacks project.

## Run without an account

Unzip the folder and open `index.html` in a modern browser. No installation, server, account, API key, build step or internet connection is needed by the application. If a managed device blocks local scripts, use an institution-approved static host; hosting is not included in this package. The bounded browser checks and untested environments are recorded in `QA.md`; portability is not assumed to be tested.

1. Try the synthetic water-cycle lesson, or enter notes and choose **Use these notes**.
2. Choose a source paragraph. Write a question and your own answer; add optional section and key terms.
3. Add a card. Reveal answers and source paragraphs with a pointer or keyboard.
4. Set text size and contrast to suit your reading preferences.
5. Download the standalone HTML study pack for offline reading/printing.
6. Save the editable JSON project to keep editing later. Add unfinished cards and apply changed source notes first: drafts are not part of the saved project. Open it with **Open saved project**.

There is no automatic persistence. Closing the page can lose unsaved work. Download initiation is not proof the browser saved a file; check Downloads. Replacing source notes clears the existing cards after confirmation so answers cannot silently point at changed source paragraphs. Titles can be edited directly. The notes editor is a draft until **Use these notes** is selected.

## Purpose and boundaries

LessonLite addresses a narrow access problem: organizing personally selected lesson material into a readable pack that can be reused offline and printed. It does not generate answers, grade learners, diagnose learning disabilities, translate, or verify factual correctness. The author chooses the source and writes the cards. Source coverage is a planning count, not a learning score.

The source is linked by paragraph; each exported card can reveal the source. HTML includes the complete answer key and loaded notes. All exports contain the author's content, so review them before sharing. Loaded source is trimmed at its outer edges; internal paragraph content stays intact. No source ownership claim is made.

## Privacy and safety

No network calls, telemetry, cookies or persistent browser storage. Use synthetic or permission-cleared notes; do not put private learner records in shared packs. Inputs render as text, not HTML. Exported HTML has no scripts and a restrictive CSP; project imports validate types, limits, source indices and supported schema. A project can contain up to 40,000 source characters, 150 paragraphs and 100 cards; JSON import and export share a 3,000,000 UTF-8 byte cap. No authentication or encryption is provided.

## Code and tests

`core.js`: validation, paragraph parsing and script-free HTML export.
`app.js`: browser interface, manual cards, preferences and downloads.
`style.css`: responsive semantic interface.
`tests/core.test.cjs`: Node built-in unit tests. Run `node --test tests/core.test.cjs`.

For static hosting, serve the four runtime files (`index.html`, `style.css`, `core.js`, `app.js`) together. No build command is required.

## Credits and origin

All application code and the synthetic water-cycle example were created for this candidate on 30 October 2026, within the stated AccessED Hacks event window. See [AI credits](PROJECT_STORY.md#built-during-the-event). No commercial ImpedanceIQ source, research datasets, trained model weights or third-party application code was reused. Runtime has no third-party dependencies. System fonts only. New code is offered under MIT; this license does not grant rights to notes users import.
