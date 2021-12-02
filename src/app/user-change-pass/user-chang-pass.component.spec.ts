import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserChangPassComponent } from './user-chang-pass.component';

describe('UserChangPassComponent', () => {
  let component: UserChangPassComponent;
  let fixture: ComponentFixture<UserChangPassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserChangPassComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserChangPassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
