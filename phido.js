#!/usr/bin/env node

require('child_process').spawn(
   require('nw').findpath(),
   ['.'].concat( process.argv.slice(2) ),
   {
      cwd: __dirname,
      detached: true,
      stdio: 'ignore'
   }
).unref();