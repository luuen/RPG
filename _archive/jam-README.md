# R.P.G.

Vibe Coding Game Jam entry by CITIZEN. Hack through goblins, find the portal.

## Play

Deploy URL: `https://freak.github.io/rune-dungeon/`

Static site — drop `index.html` on GitHub Pages, Netlify, or itch.io HTML5. No build step.

## Controls

| Key | Action |
|-----|--------|
| WASD / Arrow keys | Move |
| Space or click | Swing sword |

Kill all 5 goblins → exit portal opens at center. Walk into it to travel to another jam game.

## Portal Protocol

Reads on load:

```
?portal=true&username=NAME&color=RRGGBB&speed=N&ref=URL
```

- `portal=true` → skips title, spawns near return portal
- `username` → shown as name tag above player
- `color` → player fill color
- `ref` → spawns a return portal at top-left of dungeon

Outgoing redirect preserves all params + sets `ref` to this game's URL.

Registry fetched from `https://callumhyoung.github.io/gamejam/games.json`. Falls back to hardcoded list if fetch fails.

## Submit to jam

Copy `jam1.json` content into `games.json` in the jam repo and open a PR. Commit a 256×256 thumbnail to `thumbnails/rpg.png`.
