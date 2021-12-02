import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserOderComponent } from './user-oder.component';

describe('UserOderComponent', () => {
  let component: UserOderComponent;
  let fixture: ComponentFixture<UserOderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserOderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserOderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
