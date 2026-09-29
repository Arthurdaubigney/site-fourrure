import { execSync } from 'node:child_process';
import { rmSync, mkdirSync, cpSync } from 'node:fs';

rmSync('dist', { recursive: true, force: true });
mkdirSync('dist/assets', { recursive: true });
cpSync('src/img', 'dist/assets/img', { recursive: true });
cpSync('src/app.js', 'dist/assets/app.js');
cpSync('src/favicon.svg', 'dist/favicon.svg');
cpSync('src/index.html', 'dist/index.html');
execSync('npx tailwindcss -c tailwind.config.js -i src/input.css -o dist/assets/style.css --minify', { stdio: 'inherit' });
