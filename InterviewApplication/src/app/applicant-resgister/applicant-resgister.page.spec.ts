import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApplicantResgisterPage } from './applicant-resgister.page';

describe('ApplicantResgisterPage', () => {
  let component: ApplicantResgisterPage;
  let fixture: ComponentFixture<ApplicantResgisterPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ApplicantResgisterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
