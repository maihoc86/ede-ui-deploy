import { TestBed } from '@angular/core/testing';

import { PaymentShopService } from './payment-shop.service';

describe('PaymentShopService', () => {
  let service: PaymentShopService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentShopService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
