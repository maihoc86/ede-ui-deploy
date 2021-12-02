import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopInterfaceComponent } from './shop-interface.component';

describe('ShopInterfaceComponent', () => {
  let component: ShopInterfaceComponent;
  let fixture: ComponentFixture<ShopInterfaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShopInterfaceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopInterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
