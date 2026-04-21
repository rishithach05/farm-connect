import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import Order from '@/lib/models/Order';
import Product from '@/lib/models/Product';
import Review from '@/lib/models/Review';
import Wishlist from '@/lib/models/Wishlist';

export const dynamic = 'force-dynamic';

function getUser() {
  try {
    const token = cookies().get('auth_token')?.value;
    if (!token) return null;
    return jwt.verify(token, process.env.JWT_SECRET || 'super-secret-fallback');
  } catch { return null; }
}

export async function GET() {
  try {
    await connectDB();
    const user = getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const profile = await User.findById(user.userId)
      .select('_id name email phone location role createdAt')
      .lean();

    if (!profile) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const [orders, products, reviews, wishlist] = await Promise.all([
      Order.countDocuments({ customerId: user.userId }),
      Product.countDocuments({ farmerId: user.userId }),
      Review.countDocuments({ userId: user.userId }),
      Wishlist.countDocuments({ userId: user.userId }),
    ]);

    return NextResponse.json({
      profile: {
        ...profile,
        id: profile._id.toString(),
        _count: { orders, products, reviews, wishlist },
      }
    });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await connectDB();
    const user = getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { name, phone, location } = await req.json();

    const updated = await User.findByIdAndUpdate(
      user.userId,
      { name, phone, location },
      { new: true, select: '_id name email phone location role' }
    ).lean();

    return NextResponse.json({
      profile: { ...updated, id: updated._id.toString() },
      message: 'Profile updated!'
    });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
