import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import connectDB from '@/lib/mongodb';
import Review from '@/lib/models/Review';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');
    if (!productId) return NextResponse.json({ error: 'productId required' }, { status: 400 });

    const reviews = await Review.find({ productId })
      .populate('userId', 'name')
      .sort({ createdAt: -1 })
      .lean();

    const avg = reviews.length > 0
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : null;

    const normalized = reviews.map(r => ({
      ...r,
      id: r._id.toString(),
      user: r.userId,
    }));

    return NextResponse.json({ reviews: normalized, avgRating: avg, count: reviews.length });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const cookieStore = cookies();
    const token = cookieStore.get('auth_token')?.value;
    if (!token) return NextResponse.json({ error: 'Login required to review' }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super-secret-fallback');
    const { productId, rating, comment } = await req.json();

    if (!productId || !rating) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    if (rating < 1 || rating > 5) return NextResponse.json({ error: 'Rating must be 1-5' }, { status: 400 });

    const existing = await Review.findOne({ userId: decoded.userId, productId });

    let review;
    if (existing) {
      existing.rating  = rating;
      existing.comment = comment;
      review = await existing.save();
    } else {
      review = await Review.create({
        userId:    decoded.userId,
        productId,
        rating:    parseInt(rating),
        comment:   comment || null,
      });
    }

    const populated = await review.populate('userId', 'name');
    return NextResponse.json({
      review: { ...populated.toJSON(), id: populated._id.toString(), user: populated.userId }
    }, { status: 201 });
  } catch (e) {
    console.error('Review error:', e);
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}
