// helpers

function makeError(cursor, value, error) {
  return {
    error,
    cursor,
  };
}

// Exports

module.exports = makeError;
