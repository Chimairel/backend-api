import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { signupSchema, loginSchema, verifyEmailSchema } from "../schema/auth.schema";

const authService = new AuthService();

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = signupSchema.parse(req.body);
    const result = await authService.signup(parsed.email, parsed.password);
    res.status(201).json(result);
  } catch (error: any) {
    if (error.name === "ZodError") {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
};

export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = verifyEmailSchema.parse(req.query);
    const result = await authService.verifyEmail(parsed.token);
    res.status(200).json(result);
  } catch (error: any) {
    if (error.name === "ZodError") {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = loginSchema.parse(req.body);
    const result = await authService.login(parsed.email, parsed.password);
    res.status(200).json(result);
  } catch (error: any) {
    if (error.name === "ZodError") {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
};