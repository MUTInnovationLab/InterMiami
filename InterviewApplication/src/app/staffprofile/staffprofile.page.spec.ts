import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StaffprofilePage } from './staffprofile.page';

describe('StaffprofilePage', () => {
  let component: StaffprofilePage;
  let fixture: ComponentFixture<StaffprofilePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(StaffprofilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
