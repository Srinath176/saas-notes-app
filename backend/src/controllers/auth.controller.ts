import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import { config } from '../config/env';

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Find user and explicitly select the password field
    const user = await User.findOne({ email }).select('+password');
    if (!user || !user.password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const payload = {
      userId: user._id,
      role: user.role,
      tenantId: user.tenantId,
    };

    const secret = config.jwt.secret;
    if (!secret) throw new Error('JWT_SECRET not defined');

    const token = jwt.sign(payload, secret, { expiresIn: '1d' });

    return res.json({ token });
  } catch (error) {
    return res.status(500).json({ message: 'Auth Server error' });
  }
};