import React from 'react';
import { Pagination, Button } from '@sparkpost/matchbox';

export default function({
  data,
  perPage,
  currentPage,
  pageRange = 5,
  perPageButtons = [10, 25, 50],
  onPageChange,
  onPerPageChange
}) {

  if (!currentPage) { return null; }

  return (
    <div>
      {data.length > perPage && <Pagination
        pages={Math.ceil(data.length / perPage)}
        pageRange={pageRange}
        initialIndex={(currentPage - 1)}
        onChange={onPageChange}
      />}
      <Button.Group>Show Per Page:&nbsp;
        {perPageButtons.map((perPage) => (
          <Button key={perPage} onClick={() => onPerPageChange(perPage)}>{perPage}</Button>
        ))}
      </Button.Group>
    </div>
  );
}
