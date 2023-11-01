import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MarksPage } from './marks.page';

describe('MarksPage', () => {
  let component: MarksPage;
  let fixture: ComponentFixture<MarksPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MarksPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
