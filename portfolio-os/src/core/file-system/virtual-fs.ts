import { type FileSystemNode, type FileSystemNodeType, FileType } from '../../types/filesystem.types';

export class VirtualFileSystem {
  private static instance: VirtualFileSystem;
  private nodes: Map<string, FileSystemNode> = new Map();
  private rootId: string = 'root';

  private constructor() {
    this.initializeFileSystem();
  }

  public static getInstance(): VirtualFileSystem {
    if (!VirtualFileSystem.instance) {
      VirtualFileSystem.instance = new VirtualFileSystem();
    }
    return VirtualFileSystem.instance;
  }

  private initializeFileSystem() {
    // Root
    this.createNode(this.rootId, 'root', 'folder', '', null);

    // /home
    this.createNode('home', 'home', 'folder', '/home', 'root');

    // /home/user
    this.createNode('user', 'user', 'folder', '/home/user', 'home');

    const userPath = '/home/user';
    const userId = 'user';

    // Desktop
    this.createNode('desktop', 'Desktop', 'folder', `${userPath}/Desktop`, userId);

    // Documents
    this.createNode('documents', 'Documents', 'folder', `${userPath}/Documents`, userId);
    this.createNode('resume', 'Resume.pdf', 'file', `${userPath}/Documents/Resume.pdf`, 'documents', { fileType: FileType.PDF });
    this.createNode('cover_letter', 'CoverLetter.md', 'file', `${userPath}/Documents/CoverLetter.md`, 'documents', { fileType: FileType.MARKDOWN });

    // Projects
    this.createNode('projects', 'Projects', 'folder', `${userPath}/Projects`, userId);
    this.createNode('project1', 'Project1', 'folder', `${userPath}/Projects/Project1`, 'projects');
    this.createNode('project2', 'Project2', 'folder', `${userPath}/Projects/Project2`, 'projects');

    // Certificates
    this.createNode('certificates', 'Certificates', 'folder', `${userPath}/Certificates`, userId);

    // Pictures
    this.createNode('pictures', 'Pictures', 'folder', `${userPath}/Pictures`, userId);
    this.createNode('screenshots', 'Screenshots', 'folder', `${userPath}/Pictures/Screenshots`, 'pictures');
    this.createNode('avatar', 'Avatar.png', 'file', `${userPath}/Pictures/Avatar.png`, 'pictures', { fileType: FileType.IMAGE });

    // .config
    this.createNode('config', '.config', 'folder', `${userPath}/.config`, userId);
  }

  private createNode(
    id: string,
    name: string,
    type: FileSystemNodeType,
    path: string,
    parentId: string | null,
    extra: Partial<FileSystemNode> = {}
  ): FileSystemNode {
    const node: FileSystemNode = {
      id,
      name,
      type,
      path,
      parent: parentId,
      children: type === 'folder' ? [] : undefined,
      createdAt: Date.now(),
      modifiedAt: Date.now(),
      size: 0,
      ...extra,
    };

    this.nodes.set(id, node);

    if (parentId && this.nodes.has(parentId)) {
      const parent = this.nodes.get(parentId);
      if (parent && parent.children) {
        parent.children.push(id);
      }
    }

    return node;
  }

  public getNode(id: string): FileSystemNode | undefined {
    return this.nodes.get(id);
  }

  public getNodeByPath(path: string): FileSystemNode | undefined {
    // Normalize path
    const normalizedPath = path.replace(/\/+$/, '') || '/';
    if (normalizedPath === '/') return this.nodes.get(this.rootId);

    return Array.from(this.nodes.values()).find((node) => node.path === normalizedPath);
  }

  public listDirectory(id: string): FileSystemNode[] {
    const node = this.nodes.get(id);
    if (!node || node.type !== 'folder' || !node.children) {
      return [];
    }
    return node.children
      .map((childId) => this.nodes.get(childId))
      .filter((child): child is FileSystemNode => !!child);
  }

  public getParent(id: string): FileSystemNode | null {
    const node = this.nodes.get(id);
    if (!node || !node.parent) {
      return null;
    }
    return this.nodes.get(node.parent) || null;
  }

  public resolvePath(relativePath: string, currentPath: string): string {
    if (relativePath.startsWith('/')) {
      return relativePath;
    }

    const stack = currentPath.split('/').filter(Boolean);
    const parts = relativePath.split('/');

    for (const part of parts) {
      if (part === '.') continue;
      if (part === '..') {
        stack.pop();
      } else {
        stack.push(part);
      }
    }

    return '/' + stack.join('/');
  }

  public search(query: string): FileSystemNode[] {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.nodes.values()).filter((node) =>
      node.name.toLowerCase().includes(lowerQuery)
    );
  }

  public getFileContent(id: string): any {
    const node = this.nodes.get(id);
    if (!node || node.type !== 'file') {
      return null;
    }
    return node.content;
  }

  public getBreadcrumb(id: string): FileSystemNode[] {
    const breadcrumb: FileSystemNode[] = [];
    let current: FileSystemNode | undefined = this.nodes.get(id);

    while (current) {
      breadcrumb.unshift(current);
      if (current.parent) {
        current = this.nodes.get(current.parent);
      } else {
        current = undefined;
      }
    }

    return breadcrumb;
  }
}

export const virtualFs = VirtualFileSystem.getInstance();
