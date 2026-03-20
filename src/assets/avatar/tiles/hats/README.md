# LA cap hat tiles

These tiles are extracted from:

- `src/assets/avatar/outfits/LA-cap.png`

They are intentionally limited to the hat overlay only, by diffing the cap image against the current base avatar tiles for the top 4 rows.

Included slots:

- `02`, `03`
- `07`, `08`, `09`, `10`
- `13`, `14`, `15`, `16`
- `19`, `22`

Excluded on purpose:

- slots `20` and `21`, because the detected differences were only 3–4 pixels of noise and not meaningful hat geometry.
