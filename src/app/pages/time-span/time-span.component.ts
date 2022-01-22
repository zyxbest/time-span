import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { fromEvent } from 'rxjs';

interface TimeSpan {
  id: number;
  date: Date;
  span: number;
  content: string;
}

@Component({
  selector: 'app-time-span',
  templateUrl: './time-span.component.html',
})
export class TimeSpanComponent implements OnInit {
  timespans: TimeSpan[] = [];

  inputForm!: FormGroup;
  contentForm!: FormGroup;
  constructor(private fb: FormBuilder, private http: HttpClient) {}

  @ViewChild('input') input: any;
  ngOnInit(): void {
    this.inputForm = this.fb.group({
      content: [null, [Validators.required]],
    });
    this.fetchAllTimespansToday();
    fromEvent(window, 'keyup').subscribe((event: any) => {
      if (event.key === '/') {
        console.log(event.key);
        this.input.nativeElement.focus();
      }
    });
  }

  submitForm(): void {
    if (this.inputForm.valid) {
      const content = this.inputForm.value.content;
      this.postContent(content).subscribe({
        next: () => {
          this.fetchAllTimespansToday();
        },
      });
      this.inputForm.reset();
      console.log(content);
    } else {
      Object.values(this.inputForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  /**
   * 找到今天的所有timespan
   */
  fetchAllTimespansToday() {
    this.http.get<TimeSpan[]>('timespans/today').subscribe((v) => {
      this.timespans = v.reverse();
    });
  }

  /**
   * 增加一个timespan
   * @param content : timespan内容;
   */
  postContent(content: string) {
    // 与上时刻的差
    const span = this.timespans.length
      ? moment().diff(this.timespans[0].date, 'm')
      : 0;
    return this.http.post('timespans', {
      date: new Date(),
      span,
      content,
    });
  }

  contentChange(content: string, timespan: TimeSpan, index: number): void {
    const newTimespan = { ...timespan, content };
    this.http.post('timespans', newTimespan).subscribe();
    this.timespans[index].content = content;
    console.log(newTimespan);
  }
}
