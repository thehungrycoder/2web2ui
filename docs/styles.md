# Styles

For the most part, CSS is handled by [Matchbox](https://github.com/SparkPost/matchbox/), our component library. Most components accept either stylistic props, or `className` props.

## Links
- [Matchbox](https://github.com/SparkPost/matchbox/)
- [Matchbox Component Documentation](https://sparkpost.github.io/matchbox/)
- [Matchbox SASS Documentation](https://github.com/SparkPost/matchbox/blob/master/src/styles/README.md)

## Components
[CSS modules](https://github.com/css-modules/css-modules) is used to modularize our styles. This helps ensure unique class names to prevent class name conflicts in the global scope. To use CSS modules:

```js
// Import your style sheet
import styles from './MyComponent.module.scss'
// CSS modules will place all your class names into this styles object
// Important: The 'module' suffix, tells webpack that this file should not be in the global scope

// Use your class names in React
const Card = () => (
  <div className={styles.Card}>
    A Card Component
  </div>
);
```
```css
/* And your scss file would look like this */

/* Does not output any css, but provides useful helpers */
@import '~@sparkpost/matchbox/src/styles/config.scss';

.Card {
  background: blue;
}
```

## Dynamic Class Names
The `classnames` package allows multiple css rules to be stringed together.

EG: We want to add an `active` boolean prop and a `type` prop that both add class names.
```js
import cx from 'classnames';

const Card = ({ active, type }) => {

  const cardClasses = cx(
    // Card class always used
    styles.Card,

    // Adds 'active' class if active prop is true
    active && styles.active,

    // Adds 'type' prop as a class
    type && styles[type]
  );

  return (
    <div className={cardClasses}>
      A Card Component
    </div>
  );
}
```

## Global Styles
Global CSS should be avoided, but is necessary in some cases - ie. overwritting package styles like recharts or ace editor that don't support styling through React. CSS class names will no longer be unique, so be sure to encapsulate them properly.

```js
import './MyGlobal.scss';
// .module is left out

const Card = () => (
  <div className='Card'>
    A Card Component
  </div>
);
```
```css
#uncontrolled-selector {
  .Card {
    background: blue;
  }
}
```
