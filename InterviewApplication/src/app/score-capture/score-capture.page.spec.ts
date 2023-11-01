import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScoreCapturePage } from './score-capture.page';

describe('ScoreCapturePage', () => {
  let component: ScoreCapturePage;
  let fixture: ComponentFixture<ScoreCapturePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ScoreCapturePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
