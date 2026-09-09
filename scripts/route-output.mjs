import { mkdir, readFile, writeFile } from 'node:fs/promises';
// GitHub Pages does not provide SPA rewrites. Give the lab a real directory
// entrypoint, preserving the repository-relative homepage base.
const html = await readFile('dist/index.html', 'utf8');
await mkdir('dist/assets-lab', { recursive: true });
await writeFile('dist/assets-lab/index.html', html.replace('<head>', '<head>\n    <base href="../" />').replace('<title>NewStarrTree</title>','<title>StarrTree / Interactive Asset Lab</title>'));
