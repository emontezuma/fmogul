import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoLlamadaComponent } from './dialogo-llamada.component';

describe('DialogoLlamadaComponent', () => {
  let component: DialogoLlamadaComponent;
  let fixture: ComponentFixture<DialogoLlamadaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogoLlamadaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoLlamadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
