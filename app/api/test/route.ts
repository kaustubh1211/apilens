
import { NextResponse } from 'next/server';

const sampleData = {
  users: [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'admin', active: true },
    { id: 2, name: 'Bob Smith',    email: 'bob@example.com',   role: 'user',  active: true },
    { id: 3, name: 'Carol White',  email: 'carol@example.com', role: 'user',  active: false },
  ],
  meta: {
    total: 3,
    page: 1,
    perPage: 10,
  },
};

export async function GET() {
  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    data: sampleData,
  });
}