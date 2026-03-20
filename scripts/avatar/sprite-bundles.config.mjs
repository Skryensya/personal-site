import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

export const spriteBundles = [
  {
    name: 'avatar',
    symbolPrefix: 'avatar-sprite',
    sourceDir: path.join(projectRoot, 'src/assets/avatar/tiles'),
    outputDir: path.join(projectRoot, 'src/assets/avatar'),
    tileSize: 25,
    columns: 6,
    padding: 0,
    background: '#f6f6f6',
  },
];

export { projectRoot };
