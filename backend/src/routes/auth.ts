import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import pool from '../config/database.js';
import { generateToken } from '../utils/jwt.js';
import { AuthRequest, authMiddleware } from '../middleware/auth.js';

const router = Router();

router.post('/login', async (req: Request, res: Response) => {
  try {
    console.log('=== LOGIN ATTEMPT ===');
    console.log('Request body:', req.body);
    console.log('Content-Type:', req.headers['content-type']);
    
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('ERROR: Missing credentials');
      console.log('Email provided:', !!email);
      console.log('Password provided:', !!password);
      return res.status(400).json({ error: 'Email and password required' });
    }

    console.log('Looking for admin with email:', email);
    
    const connection = await pool.getConnection();
    const [rows]: any = await connection.execute(
      'SELECT id, email, password FROM admins WHERE email = ?',
      [email]
    );
    connection.release();

    console.log('Number of admins found:', rows.length);
    
    if (rows.length > 0) {
      console.log('Admin found - ID:', rows[0].id);
      console.log('Admin found - Email:', rows[0].email);
      console.log('Password hash (first 30 chars):', rows[0].password.substring(0, 30));
    }

    if (rows.length === 0) {
      console.log('ERROR: No admin found with this email');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const admin = rows[0];
    console.log('Comparing passwords...');
    console.log('Input password length:', password.length);
    console.log('Stored hash length:', admin.password.length);
    
    const passwordMatch = await bcrypt.compare(password, admin.password);
    console.log('Password match result:', passwordMatch);

    if (!passwordMatch) {
      console.log('ERROR: Password does not match');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(admin.id, admin.email);
    console.log('SUCCESS: Login successful for user:', admin.email);
    console.log('===================\n');
    
    res.json({ token, admin: { id: admin.id, email: admin.email } });
  } catch (error) {
    console.error('FATAL ERROR during login:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/logout', authMiddleware, (req: AuthRequest, res: Response) => {
  res.json({ message: 'Logged out' });
});

export default router;