import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from 'app/services/http.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { fromEvent } from 'rxjs';

interface TimeSpan {
  id: number;
  date: Date;
  span: number;
  content: string;
  comments: Comment[];
}

interface Comment {
  id: number;
  body: string | undefined;
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
  constructor(
    private fb: FormBuilder,
    private http: HttpService,
    private toastr: ToastrService
  ) {}

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
    this.http
      .issues()
      .then((v: any) => {
        this.timespans = v.repository.issues.edges
          .map((item: any) => ({
            id: item.node.number,
            date: item.node.createdAt,
            span: item.node.body,
            content: item.node.title,
          }))
          .reverse();
      })
      .then(async () => {
        const promises = this.timespans.map((v, i) =>
          this.listComments(v.id, i)
        );
        await Promise.all(promises);
      })
      .catch((error: Error) => {
        this.toastr.error(error.message);
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
    this.http.update(timespan.id, { title: content }).then((res) => {
      this.timespans[index].content = content;
      console.log(res);
    });
  }
  commentChange(
    content: string,
    id: number,
    index: number,
    commentIndex: number
  ): void {
    this.http.updateComment(id, content).then((res) => {
      this.timespans[index].comments[commentIndex].body = content;
      // this.fetchAllTimespansToday();
      console.log(res, 'commentchange');
    });
  }

  comment(content: string, id: number, index: number) {
    if (content) {
      this.http.createIssueComment(content, id).then(async (res) => {
        await this.listComments(id, index);
        console.log(res, 'res');
      });
    }
  }

  listComments(id: number, index: number) {
    return this.http.listComments(id).then((res) => {
      if (res) {
        this.timespans[index].comments = res.data.map((v) => ({
          body: v.body,
          id: v.id,
        }));
      }
      console.log(res, 'res list');
    });
  }
}
