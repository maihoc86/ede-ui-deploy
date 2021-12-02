import { TestBed } from '@angular/core/testing';

import { ReturnAddressService } from './return-address.service';

describe('ReturnAddressService', () => {
  let service: ReturnAddressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReturnAddressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
