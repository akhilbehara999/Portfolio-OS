export const FileType = {
  /** Text documents */
  DOCUMENT: 'DOCUMENT',
  /** Image files */
  IMAGE: 'IMAGE',
  /** Executable applications or scripts */
  EXECUTABLE: 'EXECUTABLE',
  /** Configuration files */
  CONFIG: 'CONFIG',
  /** Markdown documentation */
  MARKDOWN: 'MARKDOWN',
  /** PDF documents */
  PDF: 'PDF',
  /** Generic or unknown file type */
  UNKNOWN: 'UNKNOWN',
} as const;

export type FileType = typeof FileType[keyof typeof FileType];

export type FileSystemNodeType = 'file' | 'folder' | 'shortcut';

export interface FileSystemNode {
  /** Unique identifier for the file system node */
  id: string;
  /** Display name of the file or folder */
  name: string;
  /** Type of the node (file, folder, or shortcut) */
  type: FileSystemNodeType;
  /** Icon identifier or URL */
  icon?: string;
  /** Full path to the node */
  path: string;
  /** ID of the parent folder (null for root) */
  parent: string | null;
  /** IDs of children nodes (if folder) */
  children?: string[];
  /** Arbitrary metadata associated with the file */
  metadata?: Record<string, any>;
  /** Creation timestamp */
  createdAt: number;
  /** Last modification timestamp */
  modifiedAt: number;
  /** Size of the file in bytes */
  size: number;
  /** File extension (e.g., 'txt', 'png') */
  extension?: string;
  /** Specific type of file content */
  fileType?: FileType;
  /** Reference to file content or external source */
  content?: string | Blob | any;
}
