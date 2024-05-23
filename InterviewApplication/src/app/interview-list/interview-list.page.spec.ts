import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InterviewListPage } from './interview-list.page';

describe('InterviewListPage', () => {
  let component: InterviewListPage;
  let fixture: ComponentFixture<InterviewListPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(InterviewListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
