import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoTurnosComponent } from './dialogo-turnos.component';

describe('DialogoTurnosComponent', () => {
  let component: DialogoTurnosComponent;
  let fixture: ComponentFixture<DialogoTurnosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogoTurnosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoTurnosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
