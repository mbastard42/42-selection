import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialPongMenuComponent } from './pong-menu.component';

describe('SpecialPongGameComponent', () => {
  let component: SpecialPongMenuComponent;
  let fixture: ComponentFixture<SpecialPongMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SpecialPongMenuComponent]
    });
    fixture = TestBed.createComponent(SpecialPongMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
