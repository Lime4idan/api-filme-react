class MemoryCache {
  constructor() {
    this.entries = new Map();
  }

  get(key) {
    const entry = this.entries.get(key);
    if (!entry) return undefined;
    if (entry.expiresAt <= Date.now()) {
      this.entries.delete(key);
      return undefined;
    }
    return entry.value;
  }

  set(key, value, ttlMs) {
    this.entries.set(key, { value, expiresAt: Date.now() + ttlMs });
    if (this.entries.size > 500) this.cleanup();
    return value;
  }

  async remember(key, ttlMs, producer) {
    const cached = this.get(key);
    if (cached !== undefined) return cached;
    const value = await producer();
    return this.set(key, value, ttlMs);
  }

  cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.entries) {
      if (entry.expiresAt <= now) this.entries.delete(key);
    }
  }

  clear() {
    this.entries.clear();
  }
}

module.exports = new MemoryCache();
