import { RequestHandler } from "express";

export const getUserFromRequest: (
  ...args: Parameters<RequestHandler>
) => Express.User = (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).send("Unauthorized") as unknown as Express.User;
  }
  return user;
};
