import { Pipe, PipeTransform } from '@angular/core';

import { Range } from './range.model';

@Pipe({
  name: 'range'
})
export class RangePipe implements PipeTransform {

  transform(value: Range, args?: any): any {
    if (!value) {
      return 'undefined range';
    }
    return `[${value.start.toFixed(2)} - ${value.end.toFixed(2)}]`;
  }

}
