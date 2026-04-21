import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function POST(req) {
  try {
    await connectDB();
    const { name, email, password, role, location, phone } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    const userRole = role === 'FARMER' ? 'FARMER' : 'CUSTOMER';

    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password, // Hash in production!
      role: userRole,
      location: location || null,
      phone: phone || null,
    });

    const token = jwt.sign(
      { userId: newUser._id.toString(), role: newUser.role, name: newUser.name },
      process.env.JWT_SECRET || 'super-secret-fallback',
      { expiresIn: '7d' }
    );

    const response = NextResponse.json(
      { message: 'User registered successfully', user: { id: newUser._id.toString(), name: newUser.name, role: newUser.role } },
      { status: 201 }
    );

    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
