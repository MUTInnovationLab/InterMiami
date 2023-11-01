import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CvModalPage } from './cv-modal.page';

describe('CvModalPage', () => {
  let component: CvModalPage;
  let fixture: ComponentFixture<CvModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CvModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
