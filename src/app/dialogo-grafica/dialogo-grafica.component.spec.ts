import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoGraficaComponent } from './dialogo-grafica.component';

describe('DialogoGraficaComponent', () => {
  let component: DialogoGraficaComponent;
  let fixture: ComponentFixture<DialogoGraficaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogoGraficaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoGraficaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
