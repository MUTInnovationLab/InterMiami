import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeApplyPage } from './home-apply.page';

describe('HomeApplyPage', () => {
  let component: HomeApplyPage;
  let fixture: ComponentFixture<HomeApplyPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(HomeApplyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
