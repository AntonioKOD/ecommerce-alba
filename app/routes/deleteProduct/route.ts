import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(req: NextRequest) {
    try {
        const { id } = await req.json();

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        const data = await prisma.product.delete({
            where: { id: id },
        });

        return NextResponse.json({ message: 'Product deleted successfully', data }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: 'Failed to delete product', details: err }, { status: 500 });
    }
}