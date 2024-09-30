# @andrejground/hooks

No ordinary react hooks

## Installation

Install the package with your package manager of choice:

```sh
npm install @andrejground/hooks --save
```

## Hooks

### `useActiveBoxPosition` hook

[![StackBlitz demo](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/edit/andrejground-react-sliding-box?file=src%2Fcomponents%2FList.tsx,src%2Fhooks%2FuseActiveBoxPosition.ts)

<a href="https://andrejground.com/articles/sliding-box-over-the-active-item" target="_blank">Full guide &#8599;</a>

#### Usage

##### 1. Create styles for the active box

```css
/* List.module.css */

/* Sliding box container */
.list {
  /* Recommended */
  position: relative;

  /* Optional */
  width: fit-content;
  display: flex;
  flex-flow: row;
  margin-inline: auto;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
  padding: 1rem;
  max-width: 600px;
}

/* The sliding box */
.list::after {
  /* Required */
  content: '';
  position: absolute;
  transform: translate(var(--x), var(--y));
  width: var(--width);
  height: var(--height);
  z-index: -1;
  transition: all 250ms ease;
  inset: 0; /* or top-right-bottom-left of choice */

  /* Optional */
  background: rgb(102, 0, 255);
  border-radius: 6px;
}
```

##### 2. Use the hook

```tsx
// Call the hook
const { listItemsRef, activeBoxPosition } = useActiveBoxPosition({
  activeItem,
  recalculate: [items.length],
});

// Hook up the ref and the active box
<ul
  className={classes.list} // -> apply the styles from List.module.css
  style={activeBoxPosition} // -> inject active box position (--width, --height, --x and --y)
>
  {items.map((item) => (
    <li
      key={item}
      ref={(node) => {
        if (!node) return;

        listItemsRef.current[item] = node; // -> attach the ref
      }}
    >
      <button
        onClick={() => setActiveItem(item)} // -> the box will follow the active item
      >
        {item}
      </button>
    </li>
  ))}
</ul>;
```

#### API

##### Options

Options argument in the `useActiveBoxPosition` hook

- `activeItem` | `string | null | undefined` | A unique value representing active item in the list

- `recalculate` | `unknown[]` | The hook will observe this array and will recalculate all list elements' positions when ever any of the array items change

##### Returns

`useActiveBoxPosition` hook returns the object with

- `listItemsRef` | `{ [key: PropertyKey]: HTMLElement }` | Ref containing an array of all the elements in the list

- `activeBoxPosition` | `CSSProperties` | The object containing the CSS (variables) properties of the active item: `--x`, `--y`, `--width`, `--height`
