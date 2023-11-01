import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AllUsersPage } from './all-users.page';

describe('AllUsersPage', () => {
  let component: AllUsersPage;
  let fixture: ComponentFixture<AllUsersPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AllUsersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
