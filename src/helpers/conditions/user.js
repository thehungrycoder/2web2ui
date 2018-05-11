export const isHeroku = ({ currentUser }) => currentUser.access_level === 'heroku';

export const isAzure = ({ currentUser }) => currentUser.access_level === 'azure';

export const isAdmin = ({ currentUser }) => currentUser.access_level === 'admin';

export const isSso = ({ currentUser }) => currentUser.is_sso;
