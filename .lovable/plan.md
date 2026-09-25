# Infinity branding and interaction update

## What will change
- Replace every visible Orbis brand reference with Infinity across all pages, labels, placeholders, tooltips, metadata, and AI-facing text.
- Rename internal Orbis identifiers to Infinity while preserving existing browser data through legacy-key migration where needed.
- Add a plus-button attachment menu with Camera, File, Image, and Video choices, filtered file pickers, click-again closing, and click-outside closing.
- Make orbit nodes, quick actions, module items, recent sessions, sidebar controls, the model selector, and the profile control visibly interactive.
- Clicking an orbit node or module adds a `[Module Name]` tag to the main question field without navigating away.
- Keep General AI and Academic Research as working selectable modes managed with React state.

## Technical details
- Extend `src/routes/index.tsx` with React state, refs, hidden upload inputs, outside-click handling, selected-state styling, and tag insertion.
- Update route metadata and visible copy across `src/routes`, API prompts, shared libraries, and generated editor markup.
- Preserve old local data by reading legacy Orbis storage keys and writing Infinity keys.
- Verify zero remaining case-insensitive `Orbis` references, then check build diagnostics and desktop/mobile interactions in the running preview.
