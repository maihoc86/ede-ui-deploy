import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserUpdateEmailComponent } from './user-update-email.component';

describe('UserUpdateEmailComponent', () => {
  let component: UserUpdateEmailComponent;
  let fixture: ComponentFixture<UserUpdateEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserUpdateEmailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserUpdateEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
