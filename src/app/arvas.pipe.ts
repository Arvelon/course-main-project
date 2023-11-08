import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toArvas',
})
export class ArvasPipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): unknown {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    const mirrored = alphabet.split('').reverse().join('');

    const result = value
      .toLowerCase()
      .split('')
      .map((char) => {
        if (char.match(/[a-z]/)) {
          const index = alphabet.indexOf(char);
          return mirrored[index];
        } else {
          return char;
        }
      })
      .join('');

    return result;
  }
}
