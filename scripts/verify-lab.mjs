import { build } from 'esbuild';
import { spawnSync } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
await mkdir('.tmp',{recursive:true});
await build({entryPoints:['scripts/lab-checks.jsx'],outfile:'.tmp/lab-checks.mjs',bundle:true,packages:'external',platform:'node',format:'esm',jsx:'automatic'});
const result=spawnSync(process.execPath,['.tmp/lab-checks.mjs',...process.argv.slice(2)],{stdio:'inherit'});
process.exitCode=result.status;
