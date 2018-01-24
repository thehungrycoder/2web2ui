export const MOCK_ERROR = new Error('should have mocked this function');

export function apiRequest() {
  throw MOCK_ERROR;
}

export function formatColor() {
  throw MOCK_ERROR;
}

export default function main() {
  throw MOCK_ERROR;
}
