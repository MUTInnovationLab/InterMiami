import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScheduledInterviewsPage } from './scheduled-interviews.page';

describe('ScheduledInterviewsPage', () => {
  let component: ScheduledInterviewsPage;
  let fixture: ComponentFixture<ScheduledInterviewsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ScheduledInterviewsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
