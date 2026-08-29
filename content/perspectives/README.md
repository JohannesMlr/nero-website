# Perspectives content format

Each article is one Markdown file in this folder, named `<slug>.md`. Use `_TEMPLATE.md` as the starting point.

## Frontmatter fields (all required except `pull`)

| Field    | Format                    | Notes |
|----------|---------------------------|-------|
| `slug`   | kebab-case, unique        | Must match the filename (without `.md`) and the entry in `manifest.json`. |
| `group`  | one of the slugs below    | Determines the article's color, tag pill, and which group filter it appears under. |
| `type`   | short label               | e.g. `Essay`, `Report`, `Commentary`, `Interview` — shown as "TYPE · DATE" on cards. |
| `date`   | `YYYY-MM-DD`              | Controls sort order (newest first) and the "3 latest" homepage preview. |
| `title`  | plain text                | Full headline. |
| `teaser` | 1 sentence, ~20–25 words  | Shown on article cards. |
| `lede`   | 1–2 sentences             | Shown larger at the top of the article page. |
| `pull`   | 1 sentence (optional)     | Pull-quote shown inside the body — often the group's "How can we...?" question. |

Body content goes after the closing `---` as plain Markdown (paragraphs, **bold**, _italic_, links, lists).

## Valid `group` values

`narrative`, `tech`, `state-governance`, `capital-market`, `citizenship`, `local-ecosystems`, `infrastructure`, `defense`, `education`, `energy`

(These correspond to NERO's ten action fields; the color, name, and hero image per group are defined in `index.html`, not per-article.)

## Publishing a new article

1. Add `content/perspectives/<slug>.md` following the schema above.
2. Add `"<slug>"` to `content/perspectives/manifest.json` (order doesn't matter — articles are sorted by `date`).
3. Commit and push. The site fetches and renders these files client-side at page load — no build step required.
