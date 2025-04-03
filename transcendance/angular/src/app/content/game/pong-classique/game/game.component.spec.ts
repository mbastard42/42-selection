import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PongGameComponent } from './game.component';

describe('GameComponent', () => {
  let component: PongGameComponent;
  let fixture: ComponentFixture<PongGameComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PongGameComponent]
    });
    fixture = TestBed.createComponent(PongGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
