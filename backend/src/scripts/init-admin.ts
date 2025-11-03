import bcrypt from 'bcrypt';
import pool from '../config/database.js';

const initAdmin = async () => {
  try {
    const email = 'admin@gbexobtp.com';
    const password = 'Admin1234!';

    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hash generated:', hashedPassword);

    const connection = await pool.getConnection();

    const [existing]: any = await connection.execute(
      'SELECT id FROM admins WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      console.log('Admin already exists, deleting...');
      await connection.execute('DELETE FROM admins WHERE email = ?', [email]);
    }

    await connection.execute(
      'INSERT INTO admins (email, password) VALUES (?, ?)',
      [email, hashedPassword]
    );

    console.log('Admin created successfully');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('You can now login with these credentials');

    connection.release();
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

initAdmin();