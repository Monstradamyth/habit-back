import { NextFunction } from "express";

export async function defaultErrorHandler(
  cb: () => Promise<any> | any,
  next: NextFunction
) {
  try {
    return await cb();
  } catch (e) {
    next(e);
  }
}
