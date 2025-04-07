// build.js
require('dotenv').config(); // Add this at the top
const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['script.js'], // Your main JavaScript file
  outfile: 'dist/bundle.js', // Where the finished file goes
  bundle: true,
  define: {
    'process.env.SUPABASE_URL': JSON.stringify(process.env.SUPABASE_URL),
    'process.env.SUPABASE_ANON_KEY': JSON.stringify(process.env.SUPABASE_ANON_KEY),
  },
}).then(() => console.log('Build done!'))
  .catch((error) => console.error('Build failed:', error));