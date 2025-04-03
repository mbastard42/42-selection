import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpecialPongGameComponent } from './game.component';


describe('SpecialGameComponent', () => {
  let component: SpecialPongGameComponent;
  let fixture: ComponentFixture<SpecialPongGameComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SpecialPongGameComponent]
    });
    fixture = TestBed.createComponent(SpecialPongGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
