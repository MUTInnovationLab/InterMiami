import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ValidateDocsPage } from './validate-docs.page';

describe('ValidateDocsPage', () => {
  let component: ValidateDocsPage;
  let fixture: ComponentFixture<ValidateDocsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ValidateDocsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
