import { describe, it, expect } from 'vitest';
import { createSvgBlurDataURL } from '../../src/lib/image-utils';

describe('Image Utilities: createSvgBlurDataURL', () => {
  it('returns a correctly formatted data URL blob', () => {
    const dataUrl = createSvgBlurDataURL('#000000', '#ffffff');
    expect(dataUrl).toContain('data:image/svg+xml;charset=UTF-8,');
  });
});
