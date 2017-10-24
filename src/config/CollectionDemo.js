import React from 'react';
import TableCollection from 'src/components/collection/TableCollection';
import Layout from 'src/components/layout/Layout';

// const headerComponent = () => <h1>Sci-Fi Movies</h1>;
// const rowComponent = ({ title, director, year, matchScore }) => (
//   <div>
//     <h3 style={{ marginBottom: '0' }}>{title} ({year})</h3>
//     <p>Directed by {director} {(typeof matchScore !== 'undefined') && <span>{` - Match Score: ${matchScore}`}</span>}</p>

//   </div>
// );
const props = {
  rows: [
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
  ],
  columns: ['Title', 'Director', 'Released'],
  getRowData: (item) => [item.title, item.director, item.year],
  defaultPerPage: 5,
  perPageButtons: [3, 5, 10],
  pagination: true
};

export default function CollectionDemo() {
  return (
    <Layout.App>
      <TableCollection {...props} />
    </Layout.App>
  );
}
