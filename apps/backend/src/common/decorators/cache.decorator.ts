type CacheKeyGenerator<T extends unknown[]> = (...args: T) => string;

interface CacheEntry<T> {
  data: T;
  expiry: number;
}

const globalCache = new Map<string, CacheEntry<unknown>>();

export function Cached<T extends unknown[]>(
  keyOrGenerator: string | CacheKeyGenerator<T>,
  ttlMs = 600_000,
): MethodDecorator {
  return (
    _target: unknown,
    _propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: T) {
      const cacheKey =
        typeof keyOrGenerator === 'function'
          ? keyOrGenerator(...args)
          : keyOrGenerator;

      const cached = globalCache.get(cacheKey);
      if (cached && cached.expiry > Date.now()) {
        return cached.data;
      }

      const result = await originalMethod.apply(this, args);
      globalCache.set(cacheKey, { data: result, expiry: Date.now() + ttlMs });

      return result;
    };

    return descriptor;
  };
}

export function clearCache(key?: string): void {
  if (key) {
    globalCache.delete(key);
  } else {
    globalCache.clear();
  }
}
