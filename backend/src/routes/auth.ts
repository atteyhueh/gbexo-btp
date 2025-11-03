import { Router, Response } from 'express';
import bcrypt from 'bcrypt';
import pool from '../config/database.js';
import { generateToken } from '../utils/jwt.js';
import { AuthRequest, authMiddleware } from '../middleware/auth.js';

const router = Router();

router.post('/login', async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const connection = await pool.getConnection();
    const [rows]: any = await connection.execute(
      'SELECT id, email, password FROM admins WHERE email = ?',
      [email]
    );
    connection.release();

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const admin = rows[0];
    const passwordMatch = await bcrypt.compare(password, admin.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(admin.id, admin.email);
    res.json({ token, admin: { id: admin.id, email: admin.email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/logout', authMiddleware, (req: AuthRequest, res: Response) => {
  res.json({ message: 'Logged out' });
});

export default router;
