import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadProductFilterComponent } from './load-product-filter.component';

describe('LoadProductFilterComponent', () => {
  let component: LoadProductFilterComponent;
  let fixture: ComponentFixture<LoadProductFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadProductFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadProductFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
