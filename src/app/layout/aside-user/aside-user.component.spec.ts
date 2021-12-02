import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsideUserComponent } from './aside-user.component';

describe('AsideUserComponent', () => {
  let component: AsideUserComponent;
  let fixture: ComponentFixture<AsideUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsideUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsideUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
