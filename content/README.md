# NERO content repository ("the Brain")

Research memory for NERO, clustered into the ten Action Fields. Everything here is written in **English**, always.

```
content/
  <NN>-<field-slug>/
    _field.md    field_id, slug, title, tagline, site_article_group, guiding_question
    brief.md     continuously updated synthesis of the field — the memory layer
    actors.md    people/orgs/initiatives doing notable work in this field
    sources/     YYYY-MM-DD-<slug>.md, one file per researched or submitted find
  _templates/    source-entry.md, roundup-entry.md, article-entry.md
  perspectives/  the LIVE magazine — see perspectives/README.md
```

## The ten Action Fields

| # | Folder | `group` (live site) |
|---|--------|---------------------|
| 01 | `01-new-european-narrative` | `narrative` |
| 02 | `02-new-technology-leadership` | `tech` |
| 03 | `03-new-state-and-governance` | `state-governance` |
| 04 | `04-new-private-capital-market-union` | `capital-market` |
| 05 | `05-new-role-of-citizenship` | `citizenship` |
| 06 | `06-new-local-ecosystems` | `local-ecosystems` |
| 07 | `07-new-infrastructure` | `infrastructure` |
| 08 | `08-new-defense-and-resilience` | `defense` |
| 09 | `09-new-education` | `education` |
| 10 | `10-new-energy` | `energy` |

## How it works

1. A find is filed as one file in its **primary** field's `sources/`, per `_templates/source-entry.md`. Finds touching several fields are cross-referenced from the others via `secondary_fields`.
2. After filing, that field's `brief.md` and `actors.md` are updated with whatever the source adds or changes.
3. Drafts (roundups, essays, newsletters, LinkedIn ideas) are written from `brief.md` / `actors.md` — not by re-reading all of `sources/` — into `outputs/`.
4. Publishing to `content/perspectives/` is a separate, explicit decision.

`content/perspectives/` is the live magazine and follows its own schema — see `perspectives/README.md`. Its `group` field takes a **single** value, so a roundup spanning several fields needs one dominant field picked, a split into per-field files, or a non-field category, decided case by case.
