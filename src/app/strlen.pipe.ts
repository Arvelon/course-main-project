import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'strlen',
})
export class StrlenPipe implements PipeTransform {
  transform(value: string, ...args: string[]): string {
    return value + ' (' + value.length + ')';
  }
}
