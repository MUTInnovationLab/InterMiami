import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InterviewHistoryPage } from './interview-history.page';

describe('InterviewHistoryPage', () => {
  let component: InterviewHistoryPage;
  let fixture: ComponentFixture<InterviewHistoryPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(InterviewHistoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
