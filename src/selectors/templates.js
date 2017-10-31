import _ from 'lodash';

export const getTemplates = (state) => state.templates.list;
export const getTemplateById = (state, props) => state.templates.byId[props.match.params.id] || { draft: {}, published: {}};
export const cloneTemplate = (template) => Object.assign({ ...template }, { name: `${template.name} Copy`, id: `${template.id}-copy` });

export const getClonedTemplate = (state, props) => {
  const template = getTemplateById(state, props);

  if (_.get(props, 'match.params.id') && !_.isEmpty(template.draft)) {
    return cloneTemplate(template.draft);
  }
};
