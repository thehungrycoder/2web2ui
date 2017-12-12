# Styles

For the most part, CSS is handled by [Matchbox](https://github.com/SparkPost/matchbox/), our component library. Most components accept either stylistic, or `className` props.

## Links
- [Matchbox](https://github.com/SparkPost/matchbox/)
- [Matchbox Component Documentation](https://sparkpost.github.io/matchbox/)
- [Matchbox Sass Documentation](https://github.com/SparkPost/matchbox/blob/master/src/styles/README.md)

## Components
[CSS modules](https://github.com/css-modules/css-modules) is used to modularize our styles. This helps ensure unique class names to prevent class name conflicts in the global scope.

To use CSS modules, **add the `.module` suffix to your file. This will tell Webpack to modularize its class names.**

```js
// Import your style sheet
// CSS modules will place all your class names into this styles object
import styles from './MyComponent.module.scss'

// Use your class names in React
const Card = () => (
  <div className={styles.Card}>
    A Card Component
  </div>
);
```
```css
/* ./MyComponent.module.scss */

@import '~@sparkpost/matchbox/src/styles/config.scss';
/* Does not output any css, but provides useful helpers - see Matchbox Sass Documentation */

.Card {
  background: blue;
}
```

## Dynamic Class Names
The [classnames](https://github.com/JedWatson/classnames) package allows multiple css rules to be stringed together.

For example - We want to add an `active` boolean prop and a `type` prop that both add class names.
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
Global CSS should be avoided, but is necessary in some cases - ie. overwriting package styles like recharts or ace editor that don't support styling through React. Simply leave out the `.module` suffix. Class names will no longer be unique, so be sure to encapsulate them properly.

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
#uncontrolled-selector-from-a-package {
  .Card {
    background: blue;
  }
}
```

## Critical Styles
Webpack listens for a file named `critcal.scss`, and inlines its content to the `<head>` of each page. These styles are only meant to be applied while other style sheets have yet to load. The takeaway here is - **don't name your file critical.scss**.
