export function createSvgBlurDataURL(base: string, highlight: string) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1600" preserveAspectRatio="none">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stop-color="${base}" />
          <stop offset="55%"  stop-color="${highlight}" />
          <stop offset="100%" stop-color="${base}" />
        </linearGradient>
      </defs>
      <rect width="1200" height="1600" fill="url(#g)" />
      <rect width="1200" height="1600" fill="rgba(5,7,10,0.22)" />
    </svg>
  `.trim();

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
