export const getTemplates = (state) => state.templates.list;
export const getTemplateById = (state, id) => state.templates.byId[id] || { draft: {}, published: {}};
export const cloneTemplate = (template) => Object.assign({ ...template }, { name: `${template.name} Copy`, id: `${template.id}-copy` });
