// POST /ip-pools
export default ({ data: { name }}) => ({
  results: { id: name }
});
