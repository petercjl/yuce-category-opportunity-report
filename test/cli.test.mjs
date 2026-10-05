import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {status,install,update} from '../src/cli.mjs';
const root=fileURLToPath(new URL('../',import.meta.url)),bin=path.join(root,'bin/yuce-category-research.mjs');
test('independent canonical source and runtime are discoverable',()=>{
 const r=spawnSync(process.execPath,[bin,'skill','source','--json'],{encoding:'utf8'});assert.equal(r.status,0);
 assert.equal(JSON.parse(r.stdout).source,path.join(root,'skill/yuce-category-opportunity-report'));
 const d=spawnSync(process.execPath,[bin,'doctor','--json'],{encoding:'utf8'});assert.equal(d.status,0);
 assert.equal(JSON.parse(d.stdout).checks.find(c=>c.id==='report-runtime').ok,true);
});
test('unmanaged targets are preserved',async()=>{
 const dir=await fs.mkdtemp(path.join(os.tmpdir(),'yuce-cli-'));await fs.mkdir(path.join(dir,'yuce-category-opportunity-report'));
 await fs.writeFile(path.join(dir,'yuce-category-opportunity-report','note'),'保留');
 await assert.rejects(install(dir,'copy'),e=>e.code==='TARGET_EXISTS');
});
test('managed local edits stop updates',async()=>{
 const dir=await fs.mkdtemp(path.join(os.tmpdir(),'yuce-cli-'));await install(dir,'copy');
 assert.equal((await status(dir)).state,'current');
 await fs.appendFile(path.join(dir,'yuce-category-opportunity-report','SKILL.md'),'用户修改');
 assert.equal((await status(dir)).state,'modified');await assert.rejects(update(dir),e=>e.code==='UNMANAGED_TARGET');
});
