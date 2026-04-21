import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import connectDB from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import Product from '@/lib/models/Product';
import User from '@/lib/models/User';

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const order = await Order.findById(id)
      .populate('customerId')
      .populate('items.productId')
      .lean();

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Normalize to match frontend expectations
    const normalized = {
      ...order,
      id: order._id.toString(),
      items: order.items.map(item => ({
        ...item,
        product: item.productId,
        productId: item.productId?._id?.toString() || item.productId?.toString(),
      }))
    };

    return NextResponse.json({ order: normalized });
  } catch (error) {
    console.error('Fetch order error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const cookieStore = cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super-secret-fallback');

    if (decoded.role !== 'DELIVERY_PARTNER' && decoded.role !== 'FARMER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { action, status } = body;

    const order = await Order.findById(id);
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    if (action === 'accept') {
      if (order.status !== 'Placed' && order.status !== 'Accepted') {
        return NextResponse.json({ error: 'Order already being processed' }, { status: 400 });
      }
      order.status      = 'Accepted';
      order.agentName   = decoded.name;
      order.agentPhone  = decoded.phone || 'N/A';
      order.agentVehicle = 'Bike';
      await order.save();
      return NextResponse.json({ message: 'Order accepted', order: order.toJSON() });
    }

    if (action === 'update_status') {
      if (!status) return NextResponse.json({ error: 'Status missing' }, { status: 400 });
      order.status = status;
      await order.save();
      return NextResponse.json({ message: 'Status updated', order: order.toJSON() });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Update order error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
