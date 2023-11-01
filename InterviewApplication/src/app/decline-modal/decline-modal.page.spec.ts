import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeclineModalPage } from './decline-modal.page';

describe('DeclineModalPage', () => {
  let component: DeclineModalPage;
  let fixture: ComponentFixture<DeclineModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DeclineModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
