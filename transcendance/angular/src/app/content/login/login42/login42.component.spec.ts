import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Login42Component } from './login42.component';

describe('Login42Component', () => {
  let component: Login42Component;
  let fixture: ComponentFixture<Login42Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Login42Component]
    });
    fixture = TestBed.createComponent(Login42Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
