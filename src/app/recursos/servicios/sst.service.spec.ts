import { TestBed } from '@angular/core/testing';

import { SstService } from './sst.service';

describe('SstService', () => {
  let service: SstService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SstService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
