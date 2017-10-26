export const getTemplates = (state) => state.templates.list;
export const getTemplateById = (state, props) => state.templates.byId[props.match.params.id] || { draft: {}, published: {}};
