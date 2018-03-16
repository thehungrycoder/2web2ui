import algoliaClient from 'algoliasearch';
import config from 'src/config';
const searchCfg = config.support.algolia;

export default algoliaClient(searchCfg.appID, searchCfg.apiKey).initIndex(searchCfg.index);
