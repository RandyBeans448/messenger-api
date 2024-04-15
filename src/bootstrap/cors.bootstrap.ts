export function getCorsArray(list: string): string[] {
  if (!list) {
    throw 'You need to include CORS_WHITELIST in your .env';
  }
  return list.split(',').map((item) => item.trim());
}
