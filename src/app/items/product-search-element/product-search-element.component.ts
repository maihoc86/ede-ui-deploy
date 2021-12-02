import { Component, Input, OnInit, Output } from '@angular/core';
import { Product } from 'src/app/models/product.model';

@Component({
  selector: 'app-product-search-element',
  templateUrl: './product-search-element.component.html',
  styleUrls: ['./product-search-element.component.css']
})
export class ProductSearchElementComponent implements OnInit {

  constructor() { }

  @Input("product")
  public product: any = {};

  ngOnInit(): void {
    console.log(this.product)
  }

}
