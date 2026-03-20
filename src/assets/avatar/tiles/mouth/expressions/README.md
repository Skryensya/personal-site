# Avatar mouth expression tiles

Source mouth images live in:
- `src/assets/avatar/mouth/*.png`

Generate the runtime mouth tiles with:
- `npm run avatar:mouths`

What the generator does:
- resizes each source image to `128x128` using nearest-neighbor scaling
- reduces every image to the avatar 3-color palette: white, gray, black
- places the result on the avatar canvas at the current art offsets (`x: 11`, `y: 10`)
- crops the two mouth tiles from the same 6x6 grid positions used by the avatar
- exports one SVG per side plus `manifest.json` into `src/assets/avatar/tiles/mouth/expressions/`

These generated files are the runtime viseme assets used by `src/components/Avatar.astro`.
