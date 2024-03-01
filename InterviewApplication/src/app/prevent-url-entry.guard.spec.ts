import { TestBed } from '@angular/core/testing';

import { PreventUrlEntryGuard } from './prevent-url-entry.guard';

describe('PreventUrlEntryGuard', () => {
  let guard: PreventUrlEntryGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PreventUrlEntryGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
