// useFetch: a small caching/deduping data-fetching hook.
//
// This is the concrete "optimized frontend state management" piece. The original
// code re-ran network requests on every render (a useEffect with no dependency
// array). This hook:
//   - fetches once per unique key
//   - caches the result in a module-level Map, so revisiting a page or
//     re-mounting a component serves the cached data instantly (no refetch)
//   - dedupes concurrent requests for the same key
//
// The cache is what makes repeat page loads fast — measurable with the React
// Profiler / Lighthouse before-and-after (see /benchmark).
import { useEffect, useState, useRef } from "react";
import client from "../api/client";

const cache = new Map();      // key -> data
const inflight = new Map();   // key -> Promise

export function clearCache() {
  cache.clear();
  inflight.clear();
}

export default function useFetch(path, { enabled = true } = {}) {
  const [data, setData] = useState(() => (cache.has(path) ? cache.get(path) : null));
  const [loading, setLoading] = useState(!cache.has(path));
  const [error, setError] = useState(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!enabled || !path) return;

    if (cache.has(path)) {
      setData(cache.get(path));
      setLoading(false);
      return;
    }

    setLoading(true);

    let promise = inflight.get(path);
    if (!promise) {
      promise = client.get(path).then((res) => {
        cache.set(path, res.data);
        inflight.delete(path);
        return res.data;
      });
      inflight.set(path, promise);
    }

    promise
      .then((d) => {
        if (mounted.current) {
          setData(d);
          setError(null);
          setLoading(false);
        }
      })
      .catch((e) => {
        inflight.delete(path);
        if (mounted.current) {
          setError(e);
          setLoading(false);
        }
      });
  }, [path, enabled]);

  return { data, loading, error };
}
