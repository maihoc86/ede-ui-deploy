import { CheckoutComponent } from './../checkout/checkout.component';
import { Component, OnInit } from '@angular/core';

/**
 * @deprecated
 * @see CheckoutComponent create early
 */
@Component({
  selector: 'app-user-checkout-cart',
  templateUrl: './user-checkout-cart.component.html',
  styleUrls: ['./user-checkout-cart.component.css']
})
export class UserCheckoutCartComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
