import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoFallasComponent } from './dialogo-fallas.component';

describe('DialogoFallasComponent', () => {
  let component: DialogoFallasComponent;
  let fixture: ComponentFixture<DialogoFallasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogoFallasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoFallasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
