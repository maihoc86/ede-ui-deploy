import { TestBed } from '@angular/core/testing';

import { OrderShopService } from './order-shop.service';

describe('OrderShopService', () => {
  let service: OrderShopService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderShopService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
