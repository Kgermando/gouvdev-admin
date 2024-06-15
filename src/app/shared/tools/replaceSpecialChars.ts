
 
  export function replaceSpecialChars(value: string): string { 
    const dataValue = value.toLowerCase();
    return dataValue.replace(/[^a-zA-Z0-9_]/g, '_');
  }