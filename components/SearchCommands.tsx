"use client"

import { useEffect , useState } from "react"
import { CommandDialog, CommandEmpty, CommandInput, CommandList } from "@/components/ui/command"
import {Button} from "@/components/ui/button";
import {Loader2,  TrendingUp, Star} from "lucide-react";
import Link from "next/link";
import { searchStocks } from "@/lib/actions/finnhub.action";
import { useDebounce } from "@/app/hooks/useDebounce";
import { useSession } from "@/lib/auth-client";

export default function SearchCommand({ renderAs = 'button', label = 'Add stock', initialStocks }: SearchCommandProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)
  const [stocks, setStocks] = useState<StockWithWatchlistStatus[]>(initialStocks);
  const { data: session } = useSession();

  const isSearchMode = !!searchTerm.trim();
  const displayStocks = isSearchMode ? stocks : stocks?.slice(0, 10);

  const addSymbol = async (symbol: string) => {
    try {
      // optimistic UI update
      setStocks((s) => s.map((st) => (st.symbol === symbol ? { ...st, isInWatchlist: true } : st)));

      const email = session?.user?.email || localStorage.getItem('watchlist.email');
      if (!email) {
        // Queue pending symbol to be flushed from the watchlist page when email is set
        const pendingJson = localStorage.getItem('watchlist.pending');
        const pending: string[] = pendingJson ? JSON.parse(pendingJson) : [];
        if (!pending.includes(symbol)) {
          pending.push(symbol);
          localStorage.setItem('watchlist.pending', JSON.stringify(pending));
        }
        // Do not call API now; watchlist page will flush pending entries when user sets email
        return;
      }

      const res = await fetch('/api/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, symbol }),
      });
      const json = await res.json();
      if (!json.success) {
        console.error('Failed to add symbol', json);
        // revert optimistic UI
        setStocks((s) => s.map((st) => (st.symbol === symbol ? { ...st, isInWatchlist: false } : st)));
      }
    } catch (e) {
      console.error(e);
      // revert optimistic UI on unexpected error
      setStocks((s) => s.map((st) => (st.symbol === symbol ? { ...st, isInWatchlist: false } : st)));
    }
  }

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setOpen(v => !v)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  const handleSearch = async () => {
    if(!isSearchMode) return setStocks(initialStocks);

    setLoading(true)
    try {
        const results = await searchStocks(searchTerm.trim());
        setStocks(results);
    } catch {
      setStocks([])
    } finally {
      setLoading(false)
    }
  }

  const debouncedSearch = useDebounce(handleSearch, 300);

  useEffect(() => {
    debouncedSearch();
  }, [searchTerm, debouncedSearch]);

  const handleSelectStock = () => {
    setOpen(false);
    setSearchTerm("");
    setStocks(initialStocks);
  }

  return (
    <>
      {renderAs === 'text' ? (
          <span onClick={() => setOpen(true)} className="search-text">
            {label}
          </span>
      ): (
          <Button onClick={() => setOpen(true)} className="search-btn">
            {label}
          </Button>
      )}
      <CommandDialog open={open} onOpenChange={setOpen} className="search-dialog">
        <div className="search-field">
          <CommandInput value={searchTerm} onValueChange={setSearchTerm} placeholder="Search stocks..." className="search-input" />
          {loading && <Loader2 className="search-loader" />}
        </div>
  <CommandList className="search-list no-scrollbar">
          {loading ? (
              <CommandEmpty className="search-list-empty">Loading stocks...</CommandEmpty>
          ) : displayStocks?.length === 0 ? (
              <div className="search-list-indicator text-white">
                {isSearchMode ? 'No results found' : 'No stocks available'}
              </div>
            ) : (
            <ul>
              <div className="search-count">
                {isSearchMode ? 'Search results' : 'Popular stocks'}
                {` `}({displayStocks?.length || 0})
              </div>
              {displayStocks?.map((stock) => (
                  <li key={stock.symbol} className="search-item">
                    <div className="search-item-row flex items-center">
                      <button
                        aria-label={stock.isInWatchlist ? 'In watchlist' : 'Add to watchlist'}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          if (!stock.isInWatchlist) addSymbol(stock.symbol);
                        }}
                        className="mr-3"
                      >
                        <Star className={`h-5 w-5 ${stock.isInWatchlist ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-400'}`} />
                      </button>
                      <Link
                          href={`/stocks/${stock.symbol}`}
                          onClick={handleSelectStock}
                          className="search-item-link flex-1"
                      >
                        <TrendingUp className="h-4 w-4 text-gray-500" />
                        <div  className="flex-1">
                          <div className="search-item-name">
                            {stock.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {stock.symbol} | {stock.exchange } | {stock.type}
                          </div>
                        </div>
                      </Link>
                    </div>
                  </li>
              ))}
            </ul>
          )
          }
        </CommandList>
      </CommandDialog>
    </>
  )
}