// src/utils/errorHandler.ts
import { Request, Response, NextFunction } from "express";

// Custom API Error
export class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode || 500;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Wrapper to catch async errors in routes
export const asyncError =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

// Global error handler
export const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
) => {
  console.error("Error:", err); // good for debugging

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      status: "Error",
      message: err.message,
    });
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({
      status: "Error",
      message: "Validation Error",
    });
  }

  if (err.name === "NotFoundError") {
    return res.status(404).json({
      status: "Error",
      message: "Invalid route: " + req.url,
    });
  }

  // Default fallback
  return res.status(500).json({
    status: "Error",
    message: "An unexpected error occurred",
  });

};