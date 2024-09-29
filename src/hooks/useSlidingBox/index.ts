import {
  useEffect,
  useRef,
  useState,
  useCallback,
  type CSSProperties,
  type MutableRefObject,
} from 'react';

type ListItems<T> = { [key: PropertyKey]: T };

interface BoxSizeAndPosition extends CSSProperties {
  '--x': `${number}px`;
  '--y': `${number}px`;
  '--width': `${number}px`;
  '--height': `${number}px`;
}

const initialBoxSizeAndPosition: BoxSizeAndPosition = {
  '--x': '0px',
  '--y': '0px',
  '--width': '0px',
  '--height': '0px',
};

const itemPositions: Record<string, BoxSizeAndPosition> = {};

const mapAllPositions = (items: HTMLElement[]) => {
  items.forEach((item) => {
    const itemKey = item.dataset.key;
    if (!itemKey) return;

    const { offsetTop, offsetLeft, offsetWidth, offsetHeight } = item;
    const itemPosition: BoxSizeAndPosition = {
      '--x': `${Math.round(offsetLeft)}px`,
      '--y': `${Math.round(offsetTop)}px`,
      '--width': `${Math.round(offsetWidth)}px`,
      '--height': `${Math.round(offsetHeight)}px`,
    };

    itemPositions[itemKey] = itemPosition;
  });
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
  boxSizeAndPosition: BoxSizeAndPosition;
};

export function useSlidingBox<ItemElement extends HTMLElement>({
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
  const [boxSizeAndPosition, setBoxSizeAndPosition] = useState(
    initialBoxSizeAndPosition,
  );
  const listItemsRef: MutableRefObject<ListItems<ItemElement>> = useRef({});

  const setActivePosition = useCallback(() => {
    if (!activeItem) return;

    const activeItemPosition = itemPositions[activeItem];
    if (!activeItemPosition) return;

    setBoxSizeAndPosition(activeItemPosition);
  }, [activeItem]);

  const mapAndSetActivePosition = useCallback(() => {
    if (!listItemsRef.current) return;

    const allItems = Object.values(listItemsRef.current);
    mapAllPositions(allItems);
    setActivePosition();
  }, [setActivePosition, ...recalculate]);

  useEffect(setActivePosition, [activeItem]);
  useEffect(mapAndSetActivePosition, [...recalculate]);
  useEffect(() => {
    window.addEventListener('resize', mapAndSetActivePosition);
    return () => window.removeEventListener('resize', mapAndSetActivePosition);
  }, [mapAndSetActivePosition]);

  return { listItemsRef, boxSizeAndPosition };
}
