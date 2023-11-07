import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DevToolsService {
  constructor() {}

  betterLog(message: string = 'No string was provided for betterLog()', color: string = 'black') {
    console.log(`%c${message}`, `color: ${color}; font-weight: bold;`);
  }
}
