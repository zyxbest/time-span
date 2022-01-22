import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  ngOnInit(): void {
    this.inputForm = this.fb.group({
      content: [null, [Validators.required]],
    });

    this.http.get<TimeSpan[]>('timespans/today').subscribe((v) => {
      this.timespans = v;
    });
  }

  submitForm(): void {
    if (this.inputForm.valid) {
      const content = this.inputForm.value.content;
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

  updateContent(value:string):void{

  }
}
