import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PongMenuComponent } from './pong-menu.component';

describe('PongGameComponent', () => {
  let component: PongMenuComponent;
  let fixture: ComponentFixture<PongMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PongMenuComponent]
    });
    fixture = TestBed.createComponent(PongMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
