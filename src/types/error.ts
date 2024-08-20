export interface AppError extends Error {
  statusCode: number;
  code?: number; // for mongoose errors
}
