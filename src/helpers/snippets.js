import { slugify, slugToFriendly, tagAsCopy } from './string';

export const duplicate = (snippet) => {
  const name = tagAsCopy(snippet.name || slugToFriendly(snippet.id));

  return {
    ...snippet,
    id: slugify(name),
    name
  };
};
