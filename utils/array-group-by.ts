export default function arrayGroupBy<T>(
  items: T[],
  keySelector: (k: T) => string
) {
  return items.reduce<{ [k: string]: T[] }>((dictionary, item) => {
    const key = keySelector(item);
    dictionary[key] = (dictionary[key] ?? []).concat(item);
    return dictionary;
  }, {});
}
