import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HrModalPage } from './hr-modal.page';

describe('HrModalPage', () => {
  let component: HrModalPage;
  let fixture: ComponentFixture<HrModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(HrModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
