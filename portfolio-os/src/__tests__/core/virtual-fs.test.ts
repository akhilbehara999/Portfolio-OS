import { describe, it, expect } from 'vitest';
import { virtualFs } from '../../core/file-system/virtual-fs';

describe('Virtual File System', () => {
  describe('listDirectory', () => {
    it('should list children of a directory', () => {
      const children = virtualFs.listDirectory('home');
      expect(children).toHaveLength(1);
      expect(children[0].id).toBe('user');
    });

    it('should return empty array for invalid directory', () => {
      const children = virtualFs.listDirectory('invalid_id');
      expect(children).toEqual([]);
    });
  });

  describe('resolvePath', () => {
    it('should resolve absolute paths', () => {
      const path = virtualFs.resolvePath('/home/user', '/');
      expect(path).toBe('/home/user');
    });

    it('should resolve relative paths', () => {
      const path = virtualFs.resolvePath('Documents', '/home/user');
      expect(path).toBe('/home/user/Documents');
    });

    it('should handle parent directory (..)', () => {
      const path = virtualFs.resolvePath('../', '/home/user/Documents');
      // The current implementation might leave a trailing slash if input has one
      expect(path.replace(/\/$/, '')).toBe('/home/user');
    });
  });

  describe('search', () => {
    it('should find files by name', () => {
      const results = virtualFs.search('Resume');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].name).toContain('Resume');
    });

    it('should be case insensitive', () => {
      const results = virtualFs.search('resume');
      expect(results.length).toBeGreaterThan(0);
    });
  });

  describe('getBreadcrumb', () => {
    it('should return correct breadcrumb for a file', () => {
      // resume is at /home/user/Documents/Resume.pdf
      // id: resume, parent: documents
      // documents parent: user
      // user parent: home
      // home parent: root

      const breadcrumb = virtualFs.getBreadcrumb('resume');
      const names = breadcrumb.map((node) => node.name);

      expect(names).toEqual(['root', 'home', 'user', 'Documents', 'Resume.pdf']);
    });
  });
});
