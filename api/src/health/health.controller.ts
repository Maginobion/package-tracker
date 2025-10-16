import { Request, Response, NextFunction } from 'express';
import config from '../config/config';

export const getHealth = (req: Request, res: Response, _: NextFunction) => {
  res.status(200).json({ message: `API is running on port ${config.port}` });
};