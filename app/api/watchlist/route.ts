import { NextResponse } from 'next/server';
import { getWatchlistSymbolsByEmail, addSymbolToWatchlist, removeSymbolFromWatchlist } from '@/lib/actions/watchlist.actions';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get('email') || '';
    if (!email) return NextResponse.json({ success: false, message: 'email is required' }, { status: 400 });
    const symbols = await getWatchlistSymbolsByEmail(email);
    return NextResponse.json({ success: true, symbols });
  } catch (e) {
    console.error('GET /api/watchlist error', e);
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, symbol } = body || {};
    if (!email || !symbol) return NextResponse.json({ success: false, message: 'email and symbol required' }, { status: 400 });
    const res = await addSymbolToWatchlist(email, symbol.toUpperCase());
    return NextResponse.json(res);
  } catch (e) {
    console.error('POST /api/watchlist error', e);
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { email, symbol } = body || {};
    if (!email || !symbol) return NextResponse.json({ success: false, message: 'email and symbol required' }, { status: 400 });
    const res = await removeSymbolFromWatchlist(email, symbol.toUpperCase());
    return NextResponse.json(res);
  } catch (e) {
    console.error('DELETE /api/watchlist error', e);
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 });
  }
}
