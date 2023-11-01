import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewAcademicRecordModalPage } from './view-academic-record-modal.page';

describe('ViewAcademicRecordModalPage', () => {
  let component: ViewAcademicRecordModalPage;
  let fixture: ComponentFixture<ViewAcademicRecordModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ViewAcademicRecordModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
