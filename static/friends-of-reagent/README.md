# Friends of reagent — logo assets

Replace the placeholder files in this folder with real friend logos. The home page carousel reads paths from `src/lib/home-friends.ts`.

## File naming

| Slot file | Config id |
| --- | --- |
| `friend-01.svg` | `friend-01` |
| `friend-02.svg` | `friend-02` |
| … | … |
| `friend-08.svg` | `friend-08` |

You can swap in `.png` or `.webp` instead of `.svg` — update the matching `logoSrc` in `home-friends.ts`.

## Recommended specs

- **Format:** SVG (preferred) or PNG with transparency
- **Canvas:** about 320×96px (or similar wide aspect)
- **Color:** full-color logos display on the site; placeholders are neutral gray
- **Alt text:** set `logoAlt` and `name` in `home-friends.ts` for each friend
- **Link:** optional `href` per entry when you want the logo to open a site

## Adding or removing friends

1. Add or remove logo files here.
2. Edit the `homeFriends` array in `src/lib/home-friends.ts` (keep `id`, `logoSrc`, and metadata in sync).
