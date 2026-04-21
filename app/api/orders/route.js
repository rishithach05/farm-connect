import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import connectDB from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import Product from '@/lib/models/Product';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    const token = cookies().get('auth_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super-secret-fallback');

    const orders = await Order.find({ customerId: decoded.userId })
      .populate({
        path: 'items.productId',
        select: 'name image unit',
      })
      .sort({ createdAt: -1 })
      .lean();

    // Normalize to match previous shape: items[].product + items[].productId as string
    const normalized = orders.map(o => ({
      ...o,
      id: o._id.toString(),
      items: o.items.map(item => ({
        ...item,
        id: item._id?.toString(),
        product: item.productId,
        productId: item.productId?._id?.toString() || item.productId?.toString(),
      })),
    }));

    return NextResponse.json({ orders: normalized });
  } catch (e) {
    console.error('Fetch orders error:', e);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const token = cookies().get('auth_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super-secret-fallback');
    const body = await req.json();
    const { items, total, deliveryType, deliveryFee } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    let agentData = {};
    if (deliveryType === 'partner') {
      const agents = [
        { name: 'Ramesh', phone: '9876543210', vehicle: 'Bike' },
        { name: 'Suresh', phone: '9123456780', vehicle: 'Scooter' },
        { name: 'Anil',   phone: '9012345678', vehicle: 'Electric Bike' },
      ];
      const agent = agents[Math.floor(Math.random() * agents.length)];
      agentData = { agentName: agent.name, agentPhone: agent.phone, agentVehicle: agent.vehicle };
    }

    const eta = Math.floor(Math.random() * 21) + 20;

    const newOrder = await Order.create({
      customerId:   decoded.userId,
      total:        total + (deliveryFee || 0),
      deliveryType: deliveryType || 'self',
      deliveryFee:  deliveryFee || 0,
      eta,
      ...agentData,
      items: items.map(item => ({
        productId: item.id,
        quantity:  item.quantity,
        price:     item.price,
      })),
    });

    // Decrement stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item.id, { $inc: { quantity: -item.quantity } });
    }

    return NextResponse.json({ success: true, orderId: newOrder._id.toString() });
  } catch (e) {
    console.error('Order creation error:', e);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
