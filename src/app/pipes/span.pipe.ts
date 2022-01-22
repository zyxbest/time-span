import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'span',
})
export class SpanPipe implements PipeTransform {
  transform(value: number, ...args: unknown[]): unknown {
    const hrs = Math.floor(value / 60);
    const mins = value % 60;
    const hrsDes = hrs ? hrs + '小时 ' : '';
    return hrsDes + mins + '分';
  }
}
