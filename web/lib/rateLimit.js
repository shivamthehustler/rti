// In-memory sliding window rate limiter
const rateLimitMap = new Map();

// Periodic cleanup of stale rate limit entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, value] of rateLimitMap.entries()) {
      if (now - value.windowStart > value.windowMs * 2) {
        rateLimitMap.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

/**
 * Checks if a request exceeds rate limits.
 * @param {Request} request - Incoming Next.js Request object
 * @param {Object} options - Configuration options
 * @param {number} options.limit - Max allowed requests per window (default 30)
 * @param {number} options.windowMs - Time window in milliseconds (default 60000 = 1 min)
 * @param {string} options.prefix - Key prefix to separate endpoints
 * @returns {{ allowed: boolean, remaining: number, reset: number }}
 */
export function checkRateLimit(request, options = {}) {
  const limit = options.limit || 30;
  const windowMs = options.windowMs || 60 * 1000;
  const prefix = options.prefix || "global";

  // Identify client by IP headers or fallback
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : (request.headers.get("x-real-ip") || "127.0.0.1");
  const key = `${prefix}:${ip}`;
  const now = Date.now();

  const entry = rateLimitMap.get(key);

  if (!entry || (now - entry.windowStart > windowMs)) {
    rateLimitMap.set(key, {
      windowStart: now,
      windowMs,
      count: 1
    });
    return {
      allowed: true,
      remaining: limit - 1,
      reset: Math.ceil((now + windowMs) / 1000)
    };
  }

  if (entry.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      reset: Math.ceil((entry.windowStart + windowMs) / 1000)
    };
  }

  entry.count += 1;
  return {
    allowed: true,
    remaining: limit - entry.count,
    reset: Math.ceil((entry.windowStart + windowMs) / 1000)
  };
}
