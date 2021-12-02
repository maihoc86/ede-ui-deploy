import { TestBed } from '@angular/core/testing';

import { AccountActiveService } from './account-active.service';

describe('AccountActiveService', () => {
  let service: AccountActiveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountActiveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
