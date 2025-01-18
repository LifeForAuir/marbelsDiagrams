import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObservableControllerComponent } from './observable-controller.component';

describe('ObservableControllerComponent', () => {
  let component: ObservableControllerComponent;
  let fixture: ComponentFixture<ObservableControllerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObservableControllerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObservableControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
