import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManagepostsPage } from './manageposts.page';

describe('ManagepostsPage', () => {
  let component: ManagepostsPage;
  let fixture: ComponentFixture<ManagepostsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ManagepostsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
