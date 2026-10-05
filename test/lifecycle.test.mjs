import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { install, status, update, pythonCandidatesFor } from '../src/cli.mjs';
test('locked update preserves UI metadata and retains a complete backup', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'yuce-locked-'));
  const target = path.join(root, 'yuce-category-opportunity-report');
  await install(root, 'copy');
  assert.ok(JSON.parse(await fs.readFile(path.join(target,'.install-meta.json'),'utf8')).title);
  await fs.writeFile(path.join(target,'.install-meta.json'),JSON.stringify({title:'用户标题'}));
  const manifestPath = path.join(target,'.yuce-category-research-managed.json');
  const manifest = JSON.parse(await fs.readFile(manifestPath,'utf8'));
  manifest.sourceDigest = 'previous-version';
  await fs.writeFile(manifestPath,JSON.stringify(manifest));
  assert.equal((await status(root)).state,'stale');
  const result = await update(root,{forceInPlace:true});
  assert.equal(result.state,'current');
  assert.equal(result.updateStrategy,'in-place');
  assert.equal(JSON.parse(await fs.readFile(path.join(target,'.install-meta.json'),'utf8')).title,'用户标题');
  assert.equal((await fs.stat(path.join(result.backup,'SKILL.md'))).isFile(),true);
});
test('managed runtime discovery includes macOS and Windows candidates', () => {
  const mac = pythonCandidatesFor('darwin','/Users/example','/Users/example/.sealseek');
  const win = pythonCandidatesFor('win32','C:\\Users\\example','C:\\Users\\example\\.sealseek');
  assert.ok(mac.some(p=>p.endsWith(path.join('binaries','python','envs','default','bin','python'))));
  assert.ok(win.some(p=>p.endsWith(path.join('binaries','python','envs','default','Scripts','python.exe'))));
});
