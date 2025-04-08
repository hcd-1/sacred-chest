const { build } = require('esbuild');
const { cpSync } = require('fs');
require('dotenv').config();

build({
  entryPoints: ['script.js'],
  outfile: 'dist/bundle.js',
  bundle: true,
  define: {
    'process.env.SUPABASE_URL': JSON.stringify(process.env.SUPABASE_URL),
    'process.env.SUPABASE_ANON_KEY': JSON.stringify(process.env.SUPABASE_ANON_KEY),
  },
}).then(() => {
  cpSync('index.html', 'dist/index.html');
  cpSync('assets/logo.svg', 'dist/logo.svg');
  cpSync('assets/background.jpg', 'dist/background.jpg');
  cpSync('assets/favicon.png', 'dist/favicon.png');
  console.log('Build done! dist/ contents:', require('fs').readdirSync('dist'));
}).catch((error) => {
  console.error('Build failed:', error);
  process.exit(1); // Exit with error code to make it obvious
});