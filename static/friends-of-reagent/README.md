# Friends of reagent — logo assets

Logos served on the home page carousel. Paths and links are configured in `src/lib/home-friends.ts`.

## Current files

| File | Friend |
| --- | --- |
| `nvidia.svg` | NVIDIA |
| `florida-poly.png` | Florida Polytechnic University |
| `fca.webp` | Florida College of the Arts |
| `github.png` | GitHub |
| `nsf.svg` | National Science Foundation |

Replace a file in place or add a new asset and update `homeFriends` in `src/lib/home-friends.ts`.

## Recommended specs

- **Format:** SVG, PNG, or WebP with transparency when possible
- **Layout:** wide wordmarks (~320×96px or similar); display height is capped in CSS
- **Metadata:** set `logoAlt`, `name`, and optional `href` per entry in `home-friends.ts`
