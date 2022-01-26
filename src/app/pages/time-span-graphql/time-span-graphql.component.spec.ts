import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeSpanGraphqlComponent } from './time-span-graphql.component';

describe('TimeSpanGraphqlComponent', () => {
  let component: TimeSpanGraphqlComponent;
  let fixture: ComponentFixture<TimeSpanGraphqlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimeSpanGraphqlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeSpanGraphqlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
