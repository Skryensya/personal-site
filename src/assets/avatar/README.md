# Avatar asset layout

Runtime assets now keep only the stable, used avatar tiles in `src/assets/avatar/tiles/`:

- `base/`
- `eyes/`
- `mouth/`
- `mouth/expressions/`

The avatar is currently simplified to:

- base body/clothes baked into the subject tiles
- animated eyes
- animated mouth expressions
- no hats
- no alternate hair overlays
- no alternate outfits

## Sprite model

The runtime sprite still exports each 25×25 tile as **4 sub-tiles** (`q0`–`q3`) for consistency with the existing avatar renderer.

## Color model

Generated SVGs use the avatar palette states consumed by the sprite builder:

- `white`
- `gray`
- `black`

At runtime, eye whites and smile whites are preserved; other white fills are treated as transparent by the sprite build pipeline.
