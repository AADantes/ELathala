import { useEffect } from 'react';

export const useDynamicLocalFont = (fontName: string, defaultFonts: string[]) => {
  useEffect(() => {
    if (!fontName || defaultFonts.includes(fontName)) return;

    const fontId = `dynamic-font-${fontName.replace(/\s+/g, '-')}`;
    if (document.getElementById(fontId)) return;

    const cleanedFontName = fontName.replace(/\s+/g, ''); // e.g., "NerkoOne"
    const folderName = cleanedFontName.toLowerCase();     // e.g., "nerkoone"
    const fileName = `${cleanedFontName}-Regular.ttf`;    // e.g., "NerkoOne-Regular.ttf"

    const fontPath = `/all-ttf/${fileName}`;

    const style = document.createElement('style');
    style.id = fontId;
    style.innerHTML = `
      @font-face {
        font-family: '${fontName}';
        src: url('${fontPath}') format('truetype');
        font-weight: 400;
        font-style: normal;
      }
    `;
    document.head.appendChild(style);
  }, [fontName, defaultFonts]);
};