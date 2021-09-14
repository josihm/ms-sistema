import { TestBed } from '@angular/core/testing';

import { SscService } from './ssc.service';

describe('SscService', () => {
  let service: SscService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SscService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
