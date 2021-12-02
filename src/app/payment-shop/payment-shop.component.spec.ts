import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentShopComponent } from './payment-shop.component';

describe('PaymentShopComponent', () => {
  let component: PaymentShopComponent;
  let fixture: ComponentFixture<PaymentShopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentShopComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
