import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevenueShopComponent } from './revenue-shop.component';

describe('RevenueShopComponent', () => {
  let component: RevenueShopComponent;
  let fixture: ComponentFixture<RevenueShopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RevenueShopComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RevenueShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
