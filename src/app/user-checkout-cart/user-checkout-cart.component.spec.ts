import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCheckoutCartComponent } from './user-checkout-cart.component';

describe('UserCheckoutCartComponent', () => {
  let component: UserCheckoutCartComponent;
  let fixture: ComponentFixture<UserCheckoutCartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserCheckoutCartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserCheckoutCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
