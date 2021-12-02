import { TestBed } from '@angular/core/testing';

import { AddressUserService } from './address-user.service';

describe('AddressUserService', () => {
  let service: AddressUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddressUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
