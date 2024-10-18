import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrackApplicationsPage } from './track-applications.page';

describe('TrackApplicationsPage', () => {
  let component: TrackApplicationsPage;
  let fixture: ComponentFixture<TrackApplicationsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TrackApplicationsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
