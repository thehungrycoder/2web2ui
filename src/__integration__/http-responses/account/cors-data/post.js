// POST /account/cors-data

export default ({ params }) => ({
  results: {
    signature: `${params.context}__signature`,
    token: `${params.context}__token`
  }
});
