const esbuild = require('esbuild');

async function build() {
    try {
        await esbuild.build({
            entryPoints: ['extension/content.ts', 'extension/popup.ts', 'extension/dashboard.ts'],
            bundle: true,
            minify: true,
            outdir: 'extension',
            entryNames: '[name].bundle',
            loader: { '.ts': 'ts' },
            format: 'iife',
        });
        console.log('Build successful: I bundle sono stati creati in extension/.');
    } catch (err) {
        console.error('Build failed:', err);
        process.exit(1);
    }
}

build();
