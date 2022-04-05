import { TestBed } from '@angular/core/testing';

import { XlsExporterService } from './xls-exporter.service';

describe('XlsExporterService', () => {
  let service: XlsExporterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(XlsExporterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
