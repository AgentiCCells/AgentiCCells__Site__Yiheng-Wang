# Yiheng Wang

Yiheng Wang, Project Manager and PMO Coordinator: she ran one of the largest AI agent teams at Web Summit 2026 and co-edited PrompTugal.news.

This site is her personal website, written to get her hired. The home page comes in five designs with the same facts (The Brief at `src/index.html`, the default, and `src/d/profile/`, `src/d/control/`, `src/d/pass/`, `src/d/journey/`), with a design picker on every page. `src/index.md` is the master copy of the facts, as Markdown for AI agents; `src/data/` holds her agent team and the photo list; `src/llms.txt` and `src/agents/` hold instructions for AI agents acting for a hiring manager, for Yiheng or for a site editor, and the questions her own AI should ask her (`src/agents/questions.md`). Photos go in with `scripts/add-photo.py`, which strips their metadata. Nothing is loaded from other hosts. Every figure names its source and the date it was read. Yiheng approves every change about her before it goes live.

- Live at https://yiheng-wang.agenticcells.site (version at /version.json).
- Made by the AgentiCCells site factory from request `requests/2026-11-16__yiheng-wang/` in AgentiCCells__Site__Factory, seeded from AgentiCCells__Site__Template.
- Release: `scripts/release.sh` (build, validate, leak scan, then push to dev; CI deploys and tags v0.1.N).

Licences: code Apache-2.0; text CC BY 4.0.
