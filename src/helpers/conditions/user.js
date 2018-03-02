export const notHeroku = () => ({ currentUser }) => currentUser.access_level !== 'heroku';

export const notAzure = () => ({ currentUser }) => currentUser.access_level !== 'azure';
