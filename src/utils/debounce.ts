// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => ReturnType<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  return function debounced(...args: Parameters<T>): ReturnType<T> {
    clearTimeout(timeoutId);

    return new Promise<ReturnType<T>>((resolve) => {
      timeoutId = setTimeout(() => {
        const result = func(...args);
        resolve(result);
      }, delay);
    }) as ReturnType<T>;
  };
}
