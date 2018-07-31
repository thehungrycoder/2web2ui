import React from 'react';
import TemplateTypeahead from '../typeahead/TemplateTypeahead';

/**
 * @example
 * // This plugs into a redux-form Field like so:
 * <Field
 *   name="template"
 *   component={TemplateTypeahead}
 *   results={templatesFromReduxStore}
 * />
 */
export default function TemplateTypeaheadWrapper({ input, meta, ...rest }) {
  const { active, error, touched } = meta;

  return (
    <TemplateTypeahead
      name={input.name}
      onChange={input.onChange}
      selectedItem={input.value}
      error={!active && touched && error ? error : undefined}
      {...rest}
    />
  );
}
