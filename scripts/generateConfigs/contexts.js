// Shareable tenant configurations
// TODO: Name them something other than environments
const contexts = {
  uat: {
    sentry: {
      projectId: 237611,
      publicKey: 'b63907577f9c4091895c49cc963fa8e4'
    },
    support: {
      algolia: {
        index: 'development_site_posts_support_article'
      }
    }
  },
  staging: {
    sentry: {
      projectId: 237612,
      publicKey: 'cb27762b225f4884b5e035580f1cc289'
    },
    support: {
      algolia: {
        index: 'staging_site_posts_support_article'
      }
    }
  },
  production: {
    sentry: {
      projectId: 237613,
      publicKey: '014f9707c27b4e7ea90aff051a82e561'
    },
    support: {
      algolia: {
        index: 'production_site_posts_support_article'
      }
    }
  }
};

module.exports = contexts;
