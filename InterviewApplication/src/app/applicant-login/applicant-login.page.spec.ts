import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApplicantLoginPage } from './applicant-login.page';

describe('ApplicantLoginPage', () => {
  let component: ApplicantLoginPage;
  let fixture: ComponentFixture<ApplicantLoginPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ApplicantLoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
