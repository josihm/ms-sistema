import { TestBed } from '@angular/core/testing';

import { SsinService } from './ssin.service';

describe('SsinService', () => {
  let service: SsinService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SsinService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
