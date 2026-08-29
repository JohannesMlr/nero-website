# Perspectives author profiles

Each author is one Markdown file in this folder, named `<slug>.md`. Use `_TEMPLATE.md` as the starting point.

## Frontmatter fields (all required except `photo`)

| Field   | Format                          | Notes |
|---------|----------------------------------|-------|
| `slug`  | kebab-case, unique               | Must match the filename (without `.md`) and the entry in `manifest.json`, and is what articles reference via their `author` field. |
| `name`  | plain text                       | Full name, shown as the page heading and article byline. |
| `role`  | short label                      | e.g. `Founder & Chairman`, `Policy Lead — New Energy`. Shown under the name. |
| `photo` | path to an image (optional)      | e.g. `/assets/images/authors/<slug>.jpg`. If omitted, a placeholder initial is shown instead. |

Body content goes after the closing `---` as plain Markdown — the author's bio, shown on their profile page above the list of their published pieces.

## Adding a new author

1. Add `content/perspectives/authors/<slug>.md` following the schema above.
2. Add `"<slug>"` to `content/perspectives/authors/manifest.json`.
3. Reference `author: <slug>` in any article's frontmatter.
4. Commit and push.

The author's profile page (`/perspectives/author/<slug>`) is generated automatically — their article list is derived from which articles reference their slug, not maintained by hand.
