import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteGrafica3Component } from './reporte-grafica3.component';

describe('ReporteGrafica3Component', () => {
  let component: ReporteGrafica3Component;
  let fixture: ComponentFixture<ReporteGrafica3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporteGrafica3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteGrafica3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
