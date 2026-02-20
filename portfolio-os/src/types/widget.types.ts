import type { ComponentType } from 'react';

export type WidgetSize = 'small' | 'medium' | 'large';

export interface WidgetPosition {
  x: number;
  y: number;
}

export interface Widget {
  /** Unique identifier for the widget instance */
  id: string;
  /** Display name of the widget */
  name: string;
  /** React component to render the widget content */
  component: ComponentType<any>;
  /** Size category of the widget */
  size: WidgetSize;
  /** Grid position or coordinates */
  position: WidgetPosition;
  /** Interval in milliseconds to refresh data (0 for manual/none) */
  refreshInterval?: number;
  /** Source URL or identifier for fetching data */
  dataSource?: string;
  /** Arbitrary configuration options for the widget */
  config?: Record<string, any>;
}
