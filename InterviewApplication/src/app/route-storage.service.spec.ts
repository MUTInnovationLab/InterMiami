import { TestBed } from '@angular/core/testing';

import { RouteStorageService } from './route-storage.service';

describe('RouteStorageService', () => {
  let service: RouteStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RouteStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
