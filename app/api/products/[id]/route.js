import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import Review from '@/lib/models/Review';

export const dynamic = 'force-dynamic';

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const product = await Product.findById(id)
      .populate('farmerId', 'name location email createdAt')
      .lean();

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const reviews = await Review.find({ productId: id })
      .populate('userId', 'name')
      .sort({ createdAt: -1 })
      .lean();

    const avgRating = reviews.length > 0
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : null;

    const normalizedReviews = reviews.map(r => ({
      ...r,
      id: r._id.toString(),
      user: r.userId,
    }));

    return NextResponse.json({
      product: {
        ...product,
        id: product._id.toString(),
        farmer: product.farmerId,
        farmerId: product.farmerId?._id?.toString(),
        reviews: normalizedReviews,
        avgRating,
        _count: { reviews: reviews.length },
      }
    });
  } catch (e) {
    console.error('Fetch product error:', e);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}
