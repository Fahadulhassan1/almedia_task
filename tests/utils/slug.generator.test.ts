import { generateSlug } from '../../src/utils/slug.generator';

describe('Slug Generator', () => {
  describe('generateSlug', () => {
    it('should convert basic text to slug', () => {
      expect(generateSlug('Hello World')).toBe('hello-world');
    });

    it('should handle special characters', () => {
      expect(generateSlug('Hello & World!')).toBe('hello-world');
    });

    it('should handle multiple spaces', () => {
      expect(generateSlug('Hello    World   Test')).toBe('hello-world-test');
    });

    it('should handle numbers and letters', () => {
      expect(generateSlug('MyGym - iOS v2.1')).toBe('mygym-ios-v21');
    });

    it('should handle empty string', () => {
      expect(generateSlug('')).toBe('');
    });

    it('should handle null/undefined', () => {
      expect(generateSlug(null as any)).toBe('');
      expect(generateSlug(undefined as any)).toBe('');
    });

    it('should remove leading and trailing hyphens', () => {
      expect(generateSlug('---Hello World---')).toBe('hello-world');
    });

    it('should handle unicode characters', () => {
      expect(generateSlug('Café & Restaurant')).toBe('caf-restaurant');
    });
  });
});
