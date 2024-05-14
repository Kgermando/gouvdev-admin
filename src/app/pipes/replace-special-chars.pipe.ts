import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replaceSpecialChars'
})
export class ReplaceSpecialCharsPipe implements PipeTransform {

  transform(value: string): string {
    return value.replace(/[^a-zA-Z0-9_]/g, '_');
  }

}
