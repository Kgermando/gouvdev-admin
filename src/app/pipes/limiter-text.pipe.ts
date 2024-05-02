import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'limiterText'
})
export class LimiterTextPipe implements PipeTransform {
  
  transform(value: string, maxLength: number = 250): string {
    if (value?.length > maxLength) {
      return value.substring(0, maxLength) + '...';
    }
    return value;
  }

}
