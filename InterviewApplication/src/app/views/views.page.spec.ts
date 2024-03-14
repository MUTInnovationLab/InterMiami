import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewsPage } from './views.page';

describe('ViewsPage', () => {
  let component: ViewsPage;
  let fixture: ComponentFixture<ViewsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ViewsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
