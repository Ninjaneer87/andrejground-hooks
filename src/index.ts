import type { CSSProperties } from 'react';

export { useActiveBoxPosition } from './hooks/useActiveBoxPosition/index.js';

export interface BoxPosition extends CSSProperties {
  '--x': `${number}px`;
  '--y': `${number}px`;
  '--width': `${number}px`;
  '--height': `${number}px`;
}
