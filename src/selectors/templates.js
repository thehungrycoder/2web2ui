function templateById(templates, id) {
  return templates.byId[id] || { draft: {}, published: {}};
}

export {
  templateById
};
