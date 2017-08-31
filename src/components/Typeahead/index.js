import React from 'react';
import Downshift from 'downshift';

export default function({ items, onChange }) {

  const tafn = ({
    getInputProps,
    getItemProps,
    isOpen,
    inputValue,
    selectedItem,
    highlightedIndex
  }) => (
    <div>
    <input {...getInputProps({ placeholder: 'Favorite color ?' })} />
    {isOpen ? (
      <div style={{ border: '1px solid #ccc' }}>
        {items
          .filter(
            (i) =>
              !inputValue ||
              i.value.toLowerCase().includes(inputValue.toLowerCase()),
          )
          .map((item, index) => (
            <div
              {...getItemProps({ item, index })}
              key={item.value}
              style={{
                backgroundColor:
                  highlightedIndex === index ? 'gray' : 'white',
                fontWeight: selectedItem === item ? 'bold' : 'normal'
              }}
            >
              {item.value} [{item.type}]
            </div>
          ))}
      </div>
    ) : null}
    </div>
  );

  return (
    <Downshift onChange={onChange}>
      {tafn}
    </Downshift>
  );
}
