import {
  useEffect,
  useRef,
  useState,
  useCallback,
  type MutableRefObject,
} from 'react';
import type { BoxPosition } from '../../index.js';

type ListItems<T> = { [key: PropertyKey]: T };

const initialBoxPosition: BoxPosition = {
  '--x': '0px',
  '--y': '0px',
  '--width': '0px',
  '--height': '0px',
};

type SlidingBox<Item> = {
  /** Ref containing an array of all the elements in the list. */
  listItemsRef: MutableRefObject<ListItems<Item>>;

  /**
   * Object containing the following CSS (variables) properties of the active item:
   *
   * `--x`(offsetLeft): x-axis position in `px`
   *
   * `--y`(offsetTop):  y-axis position in `px`
   *
   * `--width`(width): width in `px`
   *
   * `--height`(height): height in `px`
   */
  activeBoxPosition: BoxPosition;
};

export function useActiveBoxPosition<ItemElement extends HTMLElement>({
  activeItem,
  recalculate = [],
}: {
  /** A unique value representing active item in the list. */
  activeItem: string | null | undefined;

  /** Will recalculate (and map) all list elements' sizes and positions when ever any of these values change.
   *
   * Example: new item is added to the list
   */
  recalculate?: unknown[];
}): SlidingBox<ItemElement> {
  const [activeBoxPosition, setActiveBoxPosition] =
    useState(initialBoxPosition);
  const listItemsRef: MutableRefObject<ListItems<ItemElement>> = useRef({});
  const listItemsPositionsRef: MutableRefObject<ListItems<BoxPosition>> =
    useRef({});

  const setPosition = useCallback(() => {
    if (!activeItem) return;

    const activeItemPosition = listItemsPositionsRef.current[activeItem];
    if (!activeItemPosition) return;

    setActiveBoxPosition(activeItemPosition);
  }, [activeItem]);

  const recalcAndSetPosition = useCallback(() => {
    Object.entries(listItemsRef.current).forEach(([key, item]) => {
      const { offsetTop, offsetLeft, offsetWidth, offsetHeight } = item;
      const itemPosition: BoxPosition = {
        '--x': `${Math.round(offsetLeft)}px`,
        '--y': `${Math.round(offsetTop)}px`,
        '--width': `${Math.round(offsetWidth)}px`,
        '--height': `${Math.round(offsetHeight)}px`,
      };

      listItemsPositionsRef.current[key] = itemPosition;
    });

    setPosition();
  }, [setPosition, ...recalculate]);

  useEffect(setPosition, [activeItem]);
  useEffect(recalcAndSetPosition, [...recalculate]);
  useEffect(() => {
    window.addEventListener('resize', recalcAndSetPosition);
    return () => window.removeEventListener('resize', recalcAndSetPosition);
  }, [recalcAndSetPosition]);

  return { listItemsRef, activeBoxPosition };
}
