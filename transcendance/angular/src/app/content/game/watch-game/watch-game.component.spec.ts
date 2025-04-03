import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WatchGameComponent } from './watch-game.component';

describe('WatchGameComponent', () => {
  let component: WatchGameComponent;
  let fixture: ComponentFixture<WatchGameComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WatchGameComponent]
    });
    fixture = TestBed.createComponent(WatchGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
