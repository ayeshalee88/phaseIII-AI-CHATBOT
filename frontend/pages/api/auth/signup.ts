import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { useState } from 'react'; import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import styles from '../styles/Login.module.css';
import Image from 'next/image';
 

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user WITH password (this was missing!)
    const user = await prisma.user.create({
      data: {
        email,
        name: email.split('@')[0],
        password: hashedPassword, // ✅ CRITICAL: Save the hashed password!
      },
    });

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return res.status(201).json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}