export function makeError(cursor, value, error) {
  return {
    error,
    cursor,
  };
}
