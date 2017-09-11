function templateById(templates, id) {
  return templates.byId[id] || { draftDetails: {}, publishedDetails: {}};
}

export {
  templateById
};
