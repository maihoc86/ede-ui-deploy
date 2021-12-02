import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAllProductsShopInterfaceComponent } from './show-all-products-shop-interface.component';

describe('ShowAllProductsShopInterfaceComponent', () => {
  let component: ShowAllProductsShopInterfaceComponent;
  let fixture: ComponentFixture<ShowAllProductsShopInterfaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAllProductsShopInterfaceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAllProductsShopInterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
