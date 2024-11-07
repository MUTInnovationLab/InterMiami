import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AllApplicationsPage } from './all-applications.page';

describe('AllApplicationsPage', () => {
  let component: AllApplicationsPage;
  let fixture: ComponentFixture<AllApplicationsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AllApplicationsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
