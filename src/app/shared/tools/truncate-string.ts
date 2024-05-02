

export function truncateString(value: string, limit: number = 80, trail = ''): string {
    if (value.length <= limit) {
      return value;
    }
    return value.substring(0, limit) + trail;
  }
  