import { NextFunction, Request, Response } from "express";
import { LoginBody } from "./auth.dto";
import { loginUser } from "./auth.service";

export const postLogin = async (
  req: Request<object, object, LoginBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const authResponse = await loginUser(email, password);

    // Set token in response header
    res.setHeader("Authorization", `Bearer ${authResponse.token}`);

    res.status(200).json(authResponse);
  } catch (error) {
    next(error);
  }
};
