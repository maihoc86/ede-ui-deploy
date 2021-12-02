import { TestBed } from '@angular/core/testing';

import { MyShopService } from './my-shop.service';

describe('MyShopService', () => {
  let service: MyShopService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyShopService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
