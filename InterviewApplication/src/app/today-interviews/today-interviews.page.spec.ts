import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodayInterviewsPage } from './today-interviews.page';

describe('TodayInterviewsPage', () => {
  let component: TodayInterviewsPage;
  let fixture: ComponentFixture<TodayInterviewsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TodayInterviewsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
