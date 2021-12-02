import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountActiveComponent } from './account-active.component';

describe('AccountActiveComponent', () => {
  let component: AccountActiveComponent;
  let fixture: ComponentFixture<AccountActiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountActiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountActiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
