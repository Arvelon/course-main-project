import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toArvas',
})
export class ArvasPipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): unknown {
    if (!value) return value;

    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    const vowels = 'aeiou';

    const transformedValue = value
      .toLowerCase()
      .split('')
      .map((char) => {
        if (alphabet.includes(char)) {
          const index = alphabet.indexOf(char);
          const mirroredChar = alphabet[alphabet.length - 1 - index];
          return char === char.toLowerCase() ? mirroredChar : mirroredChar.toUpperCase();
        } else if (vowels.includes(char)) {
          const index = vowels.indexOf(char);
          const mirroredChar = vowels[vowels.length - 1 - index];
          return char === char.toLowerCase() ? mirroredChar : mirroredChar.toUpperCase();
        } else {
          return char;
        }
      })
      .join('');

    return transformedValue;
  }
}
