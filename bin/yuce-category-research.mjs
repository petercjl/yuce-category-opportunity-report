#!/usr/bin/env node
import {main} from '../src/cli.mjs';
try{await main(process.argv.slice(2));}catch(e){console.error(JSON.stringify({ok:false,code:e.code||'UNEXPECTED_ERROR',message:e.message}));process.exitCode=1;}
