import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScheduleInterviewPage } from './schedule-interview.page';

describe('ScheduleInterviewPage', () => {
  let component: ScheduleInterviewPage;
  let fixture: ComponentFixture<ScheduleInterviewPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ScheduleInterviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
