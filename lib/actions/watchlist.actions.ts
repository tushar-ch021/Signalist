'use server';

import { connectToDatabase } from '@/database/mongoose';

export async function getWatchlistSymbolsByEmail(email: string): Promise<string[]> {
  if (!email) return [];

  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error('MongoDB connection not found');

    // Find watchlist document for the user email
    const doc = await db.collection('watchlists').findOne<{ email: string; symbols: string[] }>({ email });
    return (doc?.symbols || []).map(String);
  } catch (err) {
    console.error('getWatchlistSymbolsByEmail error:', err);
    return [];
  }
}

export async function addSymbolToWatchlist(email: string, symbol: string) {
  if (!email || !symbol) return { success: false, message: 'Missing email or symbol' };
  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error('MongoDB connection not found');
    await db.collection('watchlists').updateOne(
      { email },
      { $addToSet: { symbols: symbol } },
      { upsert: true }
    );
    return { success: true };
  } catch (err) {
    console.error('addSymbolToWatchlist error:', err);
    return { success: false, error: String(err) };
  }
}

export async function removeSymbolFromWatchlist(email: string, symbol: string) {
  if (!email || !symbol) return { success: false, message: 'Missing email or symbol' };
  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error('MongoDB connection not found');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await db.collection('watchlists').updateOne({ email }, { $pull: { symbols: symbol as any } });
    return { success: true };
  } catch (err) {
    console.error('removeSymbolFromWatchlist error:', err);
    return { success: false, error: String(err) };
  }
}