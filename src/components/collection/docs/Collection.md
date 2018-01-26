# Collection Components

These are useful when you need to display any list of items. There is a generic `Collection` component, a `TableCollection` component which uses an HTML `<table>` element, as well as `Pagination` and `CollectionFilter` which are used internally.

* [Using the Collection component](#using-collection)
  * [Collection props](#collection-props)
  * [Collection with Pagination example](#collection-with-pagination)
* [Using the TableCollection component](#using-tablecollection)
  * [Table Collection props](#tablecollection-props) 
  * [Table Collection with Sorting example](#table-collection-with-sorting)

* [Using the filterBox prop](#using-the-filterbox-prop)
  * [Filter box props](#filterbox-config)
  * [Filter box examples](#filter-box-examples)

Note: all examples below will use the following data.
```js
const movies = [
  { title: 'Star Wars', director: 'George Lucas', year: 1977 },
  { title: 'Blade Runner', director: 'Ridley Scott', year: 1982 },
  { title: 'The Matrix', director: 'Lana and Lilly Wachowski', year: 1999 },
  { title: 'Terminator 2: Judgment Day', director: 'James Cameron', year: 1991 },
  { title: 'Jurassic Park', director: 'Steven Spielberg', year: 1993 },
  { title: 'Back to the Future', director: 'Robert Zemeckis', year: 1985 },
  { title: 'Mad Max: Fury Road', director: 'George Miller', year: 2015 },
  { title: '12 Monkeys', director: 'Terry Gilliam', year: 1995 },
  { title: 'Ex Machina', director: 'Alex Garland', year: 2015 },
  { title: 'Eternal Sunshine of the Spotless Mind', director: 'Michel Gondry', year: 2004 },
  { title: 'Looper', director: 'Rian Johnson', year: 2012 }
]
```

## Using `<Collection>`

Basic Example:
```jsx
const headerComponent = () => <h1>Sci-Fi Movies</h1>;
const rowComponent = ({ title, director, year }) => (
  <div>
    <h3 style={{ marginBottom: '0' }}>{title} ({year})</h3>
    <p>Directed by {director}</p>
  </div>
);

function MyCollectionComponent() {
  return (
    <Collection
      rows={movies}
      headerComponent={headerComponent}
      rowComponent={rowComponent}
    />
  )
}
```

![A basic Collection component](/docs/images/collection-01-standard.png)

### Collection Props

See also: [PropTypes definitions for this component](/src/components/collection/Collection.propTypes.js)

**rows** (required)

The list of data you want to display, which will be mapped over with each item being given to the `rowComponent`.

**rowComponent** (required)

A React component that will receive each of the items in `rows` as a spread object (i.e. each key on the item will be available as a prop)

**headerComponent**

A React component that, if passed, will be rendered as the header of your collection display.

**rowKeyName**

A string representing a key name on the item to use as the unique key for the component. The Collection will attempt to use `id` by default, and then fall back to `row-${index}` if no `rowKeyName` is passed.

_Note: If you pass in this prop and the key is not available on the first item in `rows`, a propTypes error will be logged._

**outerWrapper**

An optional React component which should render `props.children` and will wrap around the outside of the header and collection. Useful for something like a `<table>` element. Defaults to an invisible pass-through component.

**bodyWrapper**

An optional React component which should render `props.children` and will wrap around the body of the collection (excluding the header). Useful for something like a `<tbody>` element. Defaults to an invisible pass-through component.

**pagination**

Boolean toggle deciding whether the pagination behavior should be turned on. If `true`, page and perPage buttons will appear below the collection when there are enough items.

**defaultPerPage**

If `pagination` is `true`, this sets the initial per page value. Defaults to 25.

**perPageButtons**

An array of numbers that determines the buttons to show for per page. Defaults to `[10, 25, 50]`.

**updateQueryString**

Boolean toggle to force the update query string behavior re: `page` and `perPage` values. Only has an effect if `pagination` is `true`. If this prop is true, query string will always be updated, and if it's explicitly false, the query string will never be updated. If the prop is omitted and `page` appears in the query string (e.g. via a link to the page), the query string will continue to update automatically. 

**filterBox**

Optional object to set config around the filter box (see [Filter Box section]() below for more details). Must at least include `{ show: true }` in this config for the box to appear. Other settings are listed below.


### Collection with Pagination

```jsx
const headerComponent = () => <h1>Sci-Fi Movies</h1>;
const rowComponent = ({ title, director, year }) => (
  <div>
    <h3 style={{ marginBottom: '0' }}>{title} ({year})</h3>
    <p>Directed by {director}</p>
  </div>
);

function MyPaginatedCollectionComponent() {
  return (
    <Collection
      rows={movies}
      headerComponent={headerComponent}
      rowComponent={rowComponent}
      pagination={true}
      defaultPerPage={5}
      perPageButtons={[3, 5, 10]}
    />
  )
}
```

![A paginated Collection component](/docs/images/collection-02-pagination.png)

## Using `<TableCollection>`

The `<TableCollection>` component uses the `<Collection>` component under the hood, but sets up the data as an HTML table using matchbox Table components.

```jsx
function MyTableCollectionComponent() {
  return (
    <TableCollection
      rows={movies}
      columns={['Title', 'Director', 'Released']}
      getRowData={(item) => [item.title, item.director, item.year]}
      defaultPerPage={5}
      perPageButtons={[3, 5, 10]}
      pagination={true}
    />
  )
}
```

![TableCollection example](/docs/images/table-collection-01.png)

### `<TableCollection>` props

**rows** (required)

See [collection props](#collection-props) for `rows` description.

**columns** (required)

A list of strings that will be used as the column headings for the table.

**getRowData** (required)

A function that will be run against each item in the passed in `rows` list and should return an array whose items will be the cells for each table row. The items in that resulting array can be anything (string, component, etc).

_Note: All [Collection props](#collection-props) (except `headerComponent` and `rowComponent`) will be passed through to the underlying `<Collection>` component. 

**defaultSortColumn**

Pass a key name to sort the collection by that key. Default: `null`. Collection won't be sorted unless this prop is passed. 
This parameter can be a function too. If a function is passed, it'll be called with the row object and should return value to be sorted on. Basically it can be anything lodash's [orderBy function](https://lodash.com/docs/4.17.4#orderBy) accepts as iteratee. 

**defaultSortDirection**

Pass sorting direction (`asc` or `desc`). Default: `asc`.


### Table Collection with Sorting

```jsx
function MyTableCollectionComponent() {
  return (
    <TableCollection
      rows={movies}
      columns={[ 
        { label: 'Title', sortKey: 'title' },
        { label: 'Director', sortKey: 'director' }
        { label: 'Released', sortKey: (movie) => parseInt(movie.year, 10) }
        'Actions' //this column won't be sortable. 
        ]}
      getRowData={(item) => [item.title, item.director, item.year, '...']}
      defaultSortColumn='released'
      defaultSortDirection='desc'
    />
  )
}
```

## Using the `filterBox` prop

The filter box is an input that will filter the results showing in any collection. Matches will be scored in 2 ways:

1. **Object match**: If the input finds any `key:value` or `key:"some value"` pairs in the input string, it will convert them all into one object. For each key in that object that matches the keys in the collection items, the values will be compared and scored using the basic match scorer.

1. **Basic match**: Any other values found in the input will be scored using a sort match, comparing that string to a list of specified values from each item's object, joined together by a space.

For example, given the list of movies above, a search for "Matrix" will return The Matrix as the top result, but a search for "year:198" will put the movies from the 80s at the top of the result list.

### filterBox config

**filterBox.show**

Without this set to `true`, the box won't show. Useful for keeping config in place but temporarily disabling the filter box, etc.

**filterBox.keyMap**

Hash map whose keys represent the names of keys in the object pattern, and whose values represent the name of the same key in the items itself. e.g. if you wanted to allow searches for in:1999, the keyMap would be `{ in: 'year' }`

**filterBox.itemToStringKeys**

Specify which keys whose values should be joined together to be searched for the basic search. If you only want title and year to be generically searchable, you'd specify `itemToStringKeys: ['title', 'year']`

_Note: Be sure to use the key names found on the item itself, not any mapped key names._

**filterBox.exampleModifiers**

Specify a list of keys that will be used for placeholder and help text, as examples to search for. If you don't specify this, it will use the first 3 keys of the first item in the collection.

### Filter Box Examples

Some notes about the examples below:
* The filter box examples below include a "Match Score" to demonstrate how the scoring works under the hood.
* Modifier searches (i.e. key:value or key:"some value") are run as "OR" searches with the highest-scoring matches at the top.
* All examples use this code:

```jsx
const headerComponent = () => <h1>Sci-Fi Movies</h1>;
const rowComponent = ({ title, director, year }) => (
  <div>
    <h3 style={{ marginBottom: '0' }}>{title} ({year})</h3>
    <p>Directed by {director}</p>
  </div>
);

function MyFilteredCollectionComponent() {
  return (
    <Collection
      rows={movies}
      headerComponent={headerComponent}
      rowComponent={rowComponent}
      defaultPerPage={5}
      perPageButtons={[3, 5, 10]}
      pagination={true}
      filterBox={{
        show: true,
        itemToStringKeys: ['title', 'year'],
        keyMap: { released: 'year' }
      }}
    />
  )
}
```

#### Movies whose director is "George"
![director:george search](/docs/images/filter-box-01-director.png)

#### Movies whose director is "George" or whose release year is 2015

Remember, modifier searches work as OR clauses.

![director:george year:2015 search](/docs/images/filter-box-02-director-year.png)

#### Movies that contain "loop"

This search will be compared against `item.director item.year` for each item (based on the `itemToStringKeys` value)

![loop search](/docs/images/filter-box-03-loop.png)

#### Movies that contain "Rian Johnson"

Because "director" does not appear in `itemToStringKeys`, this search returns nothing.

!["Rian Johnson" search](/docs/images/filter-box-04-rian-johnson.png)

#### Movies whose director is "Rian Johnson"

This works because it looks for the "director" key and finds the item with `director: "Rian Johnson"`. Also note the use of `""` to search for a value that contains spaces.

![director:"Rian Johnson" search](/docs/images/filter-box-05-director-rian-johnson.png)

#### Movies released in the 80s

`released` is a mapped key which looks for item.year -- numbers are converted to strings for comparison so you can do `198` to find the "198x" values (this search would also find movies released in 2198 etc, but they would be scored lower because "starts with" matches are scored higher than "contains" matches).

![released:198 search](/docs/images/filter-box-06-released.png)
