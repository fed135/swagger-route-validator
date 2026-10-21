export type SRVError = {
  error: string
  cursor: string
};

export type ErrorAccumulator = (condition: boolean, errorMessage: string) => boolean;

export function accumulator(cursor: string, errors: SRVError[]): ErrorAccumulator {
  return function failIf(condition: boolean, errorMessage: string): boolean {
    if (condition) errors.push({ error: errorMessage, cursor });
    return condition;
  };
}
