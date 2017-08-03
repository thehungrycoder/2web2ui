import React from 'react';
import { Checkbox } from '@sparkpost/matchbox';

/* Returns a Checkbox.Group that is controled by a parent checkbox. The group
   is based on the options prop, and the label for the parent checkbox comes
   through the parent prop. Built to be passed to a react-redux Field component prop. */
const CheckboxGroup = ({input, options, parent}) => {
  const {name, onChange} = input;

  const checkedValues = input.value; // array of currently checked values
  const allValues = options.map(o => o.value); // all possible values from options, used for parentOnChange
  const parentChecked = checkedValues.length === allValues.length; // controls whether the parent checkbox is checked

  /* Array of checkboxes for each option passed in. Each checkbox has
     its own onChange to add or remove itself from checkedValues */
  const checkboxes = options.map(({label, value}, index) => {
    // Adds or removes its own value from checkedValues then calls input's onChange
    const handleChange = (event) => {
      const arr = [...checkedValues];
      if (event.target.checked) {
        arr.push(value);
      } else {
        arr.splice(arr.indexOf(value), 1);
      }
      onChange(arr);
    };

    const checked = checkedValues.includes(value); // Each checkbox is checked depending on whether its value is in checkedValues;

    return (
      <Checkbox key={`checkbox-${index}`} label={label} id={`${name}[${index}]`} name={`${name}[${index}]`} value={value} checked={checked} onChange={handleChange}/>
    );
  });

  /* The parent checkbox's onChange function. It adds or removes all values from
     checkedValues and calls input's onChange with the array to check / uncheck all
     boxes. */
  const parentOnChange = (event) => {
    let arr;
    if (event.target.checked) {
      arr = allValues;
    } else {
      if (checkedValues.length === allValues.length) {
        arr = [];
      } else {
        arr = [...checkedValues];
      }
    }
    onChange(arr);
  };

  const showChildBoxes = parentChecked || Boolean(checkedValues.length);

  return (
    <div>
      <Checkbox onChange={parentOnChange} label={parent} id={parent} checked={parentChecked}/>
      {showChildBoxes && <Checkbox.Group>{checkboxes}</Checkbox.Group>}
    </div>
  );
};

export default CheckboxGroup;
