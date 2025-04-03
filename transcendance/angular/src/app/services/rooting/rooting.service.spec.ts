import { TestBed } from '@angular/core/testing';

import { RootingService } from './rooting.service';

describe('RootingService', () => {
  let service: RootingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RootingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
