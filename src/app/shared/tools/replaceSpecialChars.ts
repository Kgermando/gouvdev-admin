
 
  export function replaceSpecialChars(value: string): string {
    value.toLowerCase();
    return value.replace(/[^a-zA-Z0-9_]/g, '_');
  }