import { spawnSync } from 'node:child_process';
const python = process.env.YUCE_CATEGORY_PYTHON || (process.platform === 'win32' ? 'python' : 'python3');
const result = spawnSync(python, ['-m','unittest','discover','-s','skill/yuce-category-opportunity-report/tests','-q'], {stdio:'inherit'});
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
