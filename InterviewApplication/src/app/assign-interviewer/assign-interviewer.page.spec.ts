import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AssignInterviewerPage } from './assign-interviewer.page';

describe('AssignInterviewerPage', () => {
  let component: AssignInterviewerPage;
  let fixture: ComponentFixture<AssignInterviewerPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AssignInterviewerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
