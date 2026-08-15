// 把篆文「本」印章渲染成各尺寸 PNG 图标
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const CINNABAR = '#8C3B2E';
const RICE = '#F5EFE3';

// 满底图标（系统自行裁圆角，用于 apple-touch-icon / PWA）
const iconSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="${CINNABAR}"/>
  <rect x="72" y="72" width="368" height="368" rx="44" fill="none" stroke="${RICE}" stroke-opacity="0.55" stroke-width="9"/>
  <g transform="translate(100 96) scale(6.5)" stroke="${RICE}" stroke-width="2.4" stroke-linecap="round" fill="none">
    <path d="M24 9.5 L24 38.5"/>
    <path d="M24 15.5 Q19.5 14 17.8 8.5"/>
    <path d="M24 15.5 Q28.5 14 30.2 8.5"/>
    <path d="M14 31 C14 22.5 18.2 18.8 24 18.8 C29.8 18.8 34 22.5 34 31"/>
    <path d="M16.5 26 L31.5 26"/>
  </g>
</svg>`;

// 浏览器 tab favicon（自带圆角）
const faviconSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
  <rect x="2" y="2" width="44" height="44" rx="9" fill="${CINNABAR}"/>
  <rect x="7.5" y="7.5" width="33" height="33" rx="5" fill="none" stroke="${RICE}" stroke-opacity="0.55" stroke-width="1"/>
  <g stroke="${RICE}" stroke-width="2.2" stroke-linecap="round" fill="none">
    <path d="M24 9.5 L24 38.5"/>
    <path d="M24 15.5 Q19.5 14 17.8 8.5"/>
    <path d="M24 15.5 Q28.5 14 30.2 8.5"/>
    <path d="M14 31 C14 22.5 18.2 18.8 24 18.8 C29.8 18.8 34 22.5 34 31"/>
    <path d="M16.5 26 L31.5 26"/>
  </g>
</svg>`;

const outDir = path.join(__dirname, '..', 'public', 'icons');
fs.writeFileSync(path.join(outDir, '..', 'favicon.svg'), faviconSVG);

const jobs = [
  { size: 512, name: 'icon-512.png' },
  { size: 192, name: 'icon-192.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 32, name: 'favicon-32.png' },
];

(async () => {
  for (const j of jobs) {
    await sharp(Buffer.from(iconSVG), { density: 300 })
      .resize(j.size, j.size)
      .png()
      .toFile(path.join(outDir, j.name));
    console.log('✓', j.name);
  }
})();
