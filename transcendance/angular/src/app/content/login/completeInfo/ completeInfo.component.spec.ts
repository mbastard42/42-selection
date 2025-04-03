import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteInfoComponent } from './completeInfo.component';

describe('RegisterComponent', () => {
  let component: CompleteInfoComponent;
  let fixture: ComponentFixture<CompleteInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompleteInfoComponent]
    });
    fixture = TestBed.createComponent(CompleteInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
