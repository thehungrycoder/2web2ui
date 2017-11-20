import _ from 'lodash';
import config from 'src/config';

export const selectTemplates = (state) => state.templates.list;
export const selectTemplateById = (state, props) => state.templates.byId[props.match.params.id] || { draft: {}, published: {}};

export const selectDefaultTestData = () => JSON.stringify(config.templates.testData, null, 2);
export const selectTemplateTestData = (state) => JSON.stringify(state.templates.testData || config.templates.testData, null, 2);

export const cloneTemplate = (template) => Object.assign({ ...template }, { name: `${template.name} Copy`, id: `${template.id}-copy` });

export const selectClonedTemplate = (state, props) => {
  const template = selectTemplateById(state, props);

  if (_.get(props, 'match.params.id') && !_.isEmpty(template.draft)) {
    return cloneTemplate(template.draft);
  }
};
