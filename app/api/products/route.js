import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import connectDB from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import User from '@/lib/models/User';

export const dynamic = 'force-dynamic';

const IMAGE_MAP = {
  tomato:     'https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?w=600&q=80',
  potato:     'https://images.unsplash.com/photo-1590165482129-1b8b27698780?w=600&q=80',
  carrot:     'https://images.unsplash.com/photo-1447175008436-054170c2e979?w=600&q=80',
  onion:      'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&q=80',
  cabbage:    '/images/cabbage.png',
  mango:      '/images/mango.jpg',
  apple:      'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=600&q=80',
  banana:     'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&q=80',
  orange:     'https://images.unsplash.com/photo-1547514701-42782101795e?w=600&q=80',
  watermelon: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&q=80',
  rice:       '/images/rice.png',
  wheat:      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&q=80',
  corn:       'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&q=80',
  dal:        '/images/toordal.jpg',
  millet:     '/images/millet_new.png',
  milk:       'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&q=80',
  ghee:       '/images/ghee.png',
  paneer:     '/images/paneer.jpg',
  curd:       '/images/curd.jpg',
  fallback:   'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80',
};

function getCropImage(name) {
  if (!name) return IMAGE_MAP.fallback;
  const lower = name.toLowerCase();
  for (const [key, url] of Object.entries(IMAGE_MAP)) {
    if (lower.includes(key)) return url;
  }
  return IMAGE_MAP.fallback;
}

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const farmerId = searchParams.get('farmerId');
    const category = searchParams.get('category');

    const filter = {};
    if (farmerId) filter.farmerId = farmerId;
    if (category && category !== 'all') filter.category = category;

    const products = await Product.find(filter)
      .populate('farmerId', 'name location')
      .sort({ createdAt: -1 })
      .lean();

    // Normalize: rename farmerId → farmer to keep frontend compatible
    const normalized = products.map(p => ({
      ...p,
      id: p._id.toString(),
      farmer: p.farmerId,
      farmerId: p.farmerId?._id?.toString(),
    }));

    return NextResponse.json({ products: normalized }, { status: 200 });
  } catch (error) {
    console.error('Fetch products error:', error);
    return NextResponse.json({ error: error.message || error.toString(), stack: error.stack }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const cookieStore = cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super-secret-fallback');

    if (decoded.role !== 'FARMER') {
      return NextResponse.json({ error: 'Only farmers can add products' }, { status: 403 });
    }

    const body = await req.json();
    const { name, description, price, unit, quantity, category, image, deliveryOption } = body;

    if (!name || !price || !quantity) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newProduct = await Product.create({
      name,
      description: description || '',
      price: parseFloat(price),
      unit: unit || 'kg',
      quantity: parseInt(quantity),
      category: category || 'vegetables',
      deliveryOption: deliveryOption || 'BOTH',
      image: image || getCropImage(name),
      farmerId: decoded.userId,
    });

    return NextResponse.json(
      { message: 'Product added successfully', product: { ...newProduct.toJSON(), id: newProduct._id.toString() } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Add product error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
