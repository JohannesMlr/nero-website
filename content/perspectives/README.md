# Perspectives content format

Each article is one Markdown file in this folder, named `<slug>.md`. Use `_TEMPLATE.md` as the starting point.

## Frontmatter fields (all required except `groups` and `pull`)

| Field    | Format                              | Notes |
|----------|--------------------------------------|-------|
| `slug`   | kebab-case, unique                  | Must match the filename (without `.md`) and the entry in `manifest.json`. |
| `groups` | comma-separated list, or empty      | See below — controls color, tag pill and filtering. |
| `type`   | short label                         | e.g. `Essay`, `Report`, `Commentary`, `Interview`, `Commonplace` — any label works, shown as "TYPE · DATE" on cards. |
| `date`   | `YYYY-MM-DD`                        | Controls sort order (newest first) and the "3 latest" homepage preview. |
| `title`  | plain text                          | Full headline. |
| `teaser` | 1 sentence, ~20–25 words            | Shown on article cards. |
| `lede`   | 1–2 sentences                       | Shown larger at the top of the article page. |
| `pull`   | 1 sentence (optional)               | Pull-quote shown inside the body — often the group's "How can we...?" question. |

Body content goes after the closing `---` as plain Markdown (paragraphs, **bold**, _italic_, links, lists).

## The `groups` field — zero, one, or many

`groups` takes any combination of the ten action-field slugs below, comma-separated:

- **Exactly one** group (e.g. `groups: tech`) — the article gets that group's color, tag pill, hero image, and shows up when filtering by that group.
- **Zero groups** (`groups:` left empty, or the line omitted) — an unaffiliated piece not tied to any action field (e.g. a `Commonplace` piece). Shown neutrally: no tag pill, no group color, doesn't appear under any specific group filter — only under "All" and in the homepage/latest listings.
- **More than one** group (e.g. `groups: tech, energy`) — also shown neutrally, same as zero groups. The site intentionally does not display which fields a multi-tagged piece belongs to, so it renders exactly like an unaffiliated article and won't appear under any single group's filter.

Only the single-group case gets the colored tag/filter treatment — this is deliberate, not a bug.

### Valid group slugs

`narrative`, `tech`, `state-governance`, `capital-market`, `citizenship`, `local-ecosystems`, `infrastructure`, `defense`, `education`, `energy`

(These correspond to NERO's ten action fields; the color, name, and hero image per group are defined in `index.html`, not per-article.)

## Publishing a new article

1. Add `content/perspectives/<slug>.md` following the schema above.
2. Add `"<slug>"` to `content/perspectives/manifest.json` (order doesn't matter — articles are sorted by `date`).
3. Commit and push. The site fetches and renders these files client-side at page load — no build step required.
