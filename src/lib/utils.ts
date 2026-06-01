export function safeLower(str: any): string {
  if (typeof str !== 'string') {
    return '';
  }
  return str.toLowerCase();
}
