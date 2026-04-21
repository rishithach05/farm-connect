import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import connectDB from '@/lib/mongodb';
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

    const wishlist = await Wishlist.find({ userId: user.userId })
      .populate({
        path: 'productId',
        populate: { path: 'farmerId', select: 'name location' },
      })
      .lean();

    const normalized = wishlist.map(w => ({
      ...w,
      id: w._id.toString(),
      product: {
        ...w.productId,
        id: w.productId?._id?.toString(),
        farmer: w.productId?.farmerId,
      },
    }));

    return NextResponse.json({ wishlist: normalized });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch wishlist' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const user = getUser();
    if (!user) return NextResponse.json({ error: 'Login required' }, { status: 401 });

    const { productId } = await req.json();
    if (!productId) return NextResponse.json({ error: 'productId required' }, { status: 400 });

    const existing = await Wishlist.findOne({ userId: user.userId, productId });

    if (existing) {
      await Wishlist.deleteOne({ _id: existing._id });
      return NextResponse.json({ wishlisted: false, message: 'Removed from wishlist' });
    } else {
      await Wishlist.create({ userId: user.userId, productId });
      return NextResponse.json({ wishlisted: true, message: 'Added to wishlist' });
    }
  } catch (e) {
    return NextResponse.json({ error: 'Failed to toggle wishlist' }, { status: 500 });
  }
}
