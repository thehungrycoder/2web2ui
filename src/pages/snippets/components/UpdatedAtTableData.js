import { formatDateTime } from 'src/helpers/date';

// on initial creation of a snippet, updated_at is not present
const UpdatedAtTableData = ({ created_at, updated_at }) => (
  formatDateTime(updated_at || created_at)
);

export default UpdatedAtTableData;
