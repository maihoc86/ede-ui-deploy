import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSearchElementComponent } from './product-search-element.component';

describe('ProductSearchElementComponent', () => {
  let component: ProductSearchElementComponent;
  let fixture: ComponentFixture<ProductSearchElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductSearchElementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSearchElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
