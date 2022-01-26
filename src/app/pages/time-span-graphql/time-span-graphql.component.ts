import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from 'app/services/http.service';
import * as moment from 'moment';
import { fromEvent } from 'rxjs';

interface TimeSpan {
  id: number;
  date: Date;
  span: number;
  content: string;
}

@Component({
  selector: 'app-time-span-graphql',
  templateUrl: './time-span-graphql.component.html',
  styleUrls: ['./time-span-graphql.component.css'],
})
export class TimeSpanGraphqlComponent implements OnInit {
  timespans: TimeSpan[] = [];

  inputForm!: FormGroup;
  contentForm!: FormGroup;
  constructor(private fb: FormBuilder, private http: HttpService) {}

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
      this.postContent(content).then(() => this.fetchAllTimespansToday());
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
    this.http.issues().then((v: any) => {
      this.timespans = v.repository.issues.edges
        .map((item: any) => ({
          id: item.node.number,
          date: item.node.createdAt,
          span: item.node.title,
          content: item.node.body,
        }))
        .reverse();
    });
  }

  /**
   * 增加一个timespan
   * @param content : timespan内容;
   */
  async postContent(content: string) {
    // 与上时刻的差
    const span = this.timespans.length
      ? moment().diff(this.timespans[0].date, 'm')
      : 0;
    return this.http.post(span, content);
  }

  contentChange(content: string, timespan: TimeSpan, index: number): void {
    this.http.post(timespan.id, content).then((res) => {
      this.timespans[index].content = content;
      console.log(res);
    });
  }
}
