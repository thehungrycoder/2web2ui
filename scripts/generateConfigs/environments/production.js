const productionEnvironment = {
  sentry: {
    projectId: 237613,
    publicKey: '014f9707c27b4e7ea90aff051a82e561'
  },
  support: {
    algolia: {
      index: 'production_site_posts_support_article'
    }
  }
};

module.exports = productionEnvironment;
