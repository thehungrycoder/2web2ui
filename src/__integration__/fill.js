import debugLog from 'src/__testHelpers__/debugLog';

function getControl({
  type,
  mounted,
  name,
  selector = `${type === 'select' ? 'select' : 'input'}[name="${name}"]`
}) {
  if (type === 'typeahead' || type === 'downshift') {
    const field = mounted.find(`Field[name="${name}"]`);
    const downshift = field.find('Downshift');
    if (downshift.length !== 1) {
      throw new Error(`Single downshift component not found, instead found ${downshift.length}`);
    }
    return downshift;
  }

  const control = mounted.find(selector);

  if (control.length === 0) {
    debugLog(selector, mounted.html());
    throw new Error(`No control found in this field ${selector}`);
  }

  if (control.length > 1) {
    control.forEach((el) => debugLog(selector, el.html()));
  }

  return control;
}

function selectRadioOption({ radios, value, index }) {
  let control;

  if (value) {
    const options = radios.map((option) => option);
    control = options.find((option) => option.props().value === value);
  }

  if (!control && typeof index === 'number') {
    control = radios.at(index);
  }

  if (!control || control.length !== 1) {
    throw new Error(`Single radio not found for this field, instead found ${control.length} for ${value || index}`);
  }

  // redux form seems to be watching for currentTarget for radio buttons lol no idea why
  control.simulate('change', { currentTarget: { checked: true }});
}

export default function getFiller(mounted) {
  return function fill(options) {

    if (Array.isArray(options)) {
      options.forEach(fill);
      return;
    }

    const { type, name, selector, ...args } = options;
    const control = getControl({ mounted, type, name, selector });
    let updated = false;

    try {
      switch (type) {

        case 'radio': {
          selectRadioOption({ radios: control, ...args });
          updated = true;
          break;
        }

        case 'downshift':
        case 'typeahead': {
          control.props().onChange(args.value);
          updated = true;
        }

        // eslint-disable-next-line no-fallthrough
        case 'checkbox':
        case 'select':
        case 'text':
        default: {
          control.simulate('change', { target: { value: args.value }});
          updated = true;
        }
      }
    } catch (err) {
      throw new Error(`Problem with ${selector} -- ${err.message}`);
    }

    updated && mounted.update();
    type === 'checkbox' && debugLog('checked after:', control.props().checked);
  };
}
