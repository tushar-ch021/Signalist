"use client";
import React, { useCallback, useEffect, useState } from 'react';

const WatchlistPage = () => {
  const [email, setEmail] = useState('');
  const [symbol, setSymbol] = useState('');
  const [symbols, setSymbols] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const fetchWatchlist = useCallback(async (emailToFetch: string) => {
    if (!emailToFetch) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/watchlist?email=${encodeURIComponent(emailToFetch)}`);
      const json = await res.json();
      if (json.success) setSymbols(json.symbols || []);
      else setMessage(json.message || 'Failed to load watchlist');
    } catch {
      setMessage('Failed to load watchlist');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // try load email from localStorage as a convenience
    const stored = localStorage.getItem('watchlist.email');
    if (stored) {
      setEmail(stored);
      fetchWatchlist(stored);
    }
    // If there are pending symbols queued from search, show them in UI (but don't send until email is set)
    const pendingJson = localStorage.getItem('watchlist.pending');
    if (pendingJson) {
      try {
        const pending = JSON.parse(pendingJson) as string[];
        if (pending && pending.length > 0) {
          setSymbols((s) => Array.from(new Set([...s, ...pending])));
          setMessage(`You have ${pending.length} pending symbol(s). Set your email and click Load to save them.`);
        }
      } catch {}
    }
  }, [fetchWatchlist]);

  const handleAdd = async () => {
    if (!symbol) return setMessage('Please provide a symbol');
    setLoading(true);
    try {
      const storedEmail = email || localStorage.getItem('watchlist.email') || '';
      if (!storedEmail) return setMessage('Please set your email and click Load to save watchlist items');

      const res = await fetch('/api/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: storedEmail, symbol }),
      });
      const json = await res.json();
      if (json.success) {
        localStorage.setItem('watchlist.email', storedEmail);
        setSymbol('');
        fetchWatchlist(storedEmail);
        setMessage('Added');
      } else {
        setMessage(json.message || 'Failed to add');
      }
    } catch {
      setMessage('Failed to add symbol');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (s: string) => {
    const storedEmail = email || localStorage.getItem('watchlist.email') || '';
    if (!storedEmail) return setMessage('No email set');
    setLoading(true);
    try {
      const res = await fetch('/api/watchlist', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: storedEmail, symbol: s }),
      });
      const json = await res.json();
      if (json.success) {
        fetchWatchlist(storedEmail);
        setMessage('Removed');
      } else {
        setMessage(json.message || 'Failed to remove');
      }
    } catch {
      setMessage('Failed to remove symbol');
    } finally {
      setLoading(false);
    }
  };

  // Flush pending symbols stored from search dialog when user sets an email (Load)
  const flushPending = async (emailToUse: string) => {
    const pendingJson = localStorage.getItem('watchlist.pending');
    if (!pendingJson) return;
    let pending: string[] = [];
    try {
      pending = JSON.parse(pendingJson);
      if (!Array.isArray(pending) || pending.length === 0) return;
    } catch {
      return;
    }

    for (const sym of pending) {
      try {
        await fetch('/api/watchlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: emailToUse, symbol: sym }),
        });
      } catch (e) {
        console.error('Failed to flush pending symbol', sym, e);
      }
    }
    localStorage.removeItem('watchlist.pending');
    // Refresh list
    fetchWatchlist(emailToUse);
    setMessage(`Saved ${pending.length} pending symbol(s)`);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Watchlist</h1>
      <div className="mb-4">
        <label className="block text-sm font-medium">Your email (used to identify your watchlist)</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full border rounded p-2"
          placeholder="you@example.com"
        />
        <button
          onClick={async () => {
            if (email) {
              localStorage.setItem('watchlist.email', email);
              await flushPending(email);
              fetchWatchlist(email);
            }
          }}
          className="mt-2 px-3 py-2 bg-yellow-400 rounded text-black"
        >
          Load
        </button>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium">Add symbol</label>
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            className="flex-1 border rounded p-2"
            placeholder="AAPL"
          />
            <button onClick={handleAdd} disabled={loading} className="px-3 py-2 bg-yellow-400 rounded text-black">
              Add
            </button>
        </div>
      </div>

      {message && <div className="mb-4 text-sm text-red-600">{message}</div>}

      <div>
  <h2 className="text-lg font-semibold mb-2">Your Stocks</h2>
        {loading && <div>Loading...</div>}
        {!loading && symbols.length === 0 && <div>No symbols in your watchlist</div>}
        <ul>
          {symbols.map((s) => (
            <li key={s} className="flex justify-between items-center border-b py-2">
              <span>{s}</span>
              <button onClick={() => handleRemove(s)} className="text-sm text-red-600">
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WatchlistPage;
