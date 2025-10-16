import { Router } from "express";
import { validateRequest } from "../middlewares/validateRequest";
import { postLogin } from "./auth.controller";
import { loginSchema } from "./auth.dto";

const router = Router();

router.post("/login", validateRequest(loginSchema), postLogin);

export default router;
