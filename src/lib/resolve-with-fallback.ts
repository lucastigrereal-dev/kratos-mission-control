export function timeoutPromise<T>(
  timeoutMs: number,
  message = `timeout:${timeoutMs}`,
): Promise<T> {
  return new Promise<T>((_, reject) => {
    const timer = setTimeout(() => {
      clearTimeout(timer)
      reject(new Error(message))
    }, timeoutMs)
  })
}

export async function resolveWithFallback<T>(
  load: () => Promise<T>,
  fallback: T,
  timeoutMs = 2500,
): Promise<T> {
  try {
    return await Promise.race([load(), timeoutPromise<T>(timeoutMs)])
  } catch {
    return fallback
  }
}
