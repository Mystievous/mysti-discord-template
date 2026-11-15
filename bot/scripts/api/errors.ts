// Thrown when an API call returns a status the caller doesn't handle.
// Carries the status and body so the command handler's log shows what
// was returned.
export class UnexpectedResponseError extends Error {
  readonly status: number;
  readonly data: unknown;

  constructor(operation: string, response: { status: number; data: unknown }) {
    super(`${operation} returned unexpected status ${response.status}`);
    this.name = "UnexpectedResponseError";
    this.status = response.status;
    this.data = response.data;
  }
}
