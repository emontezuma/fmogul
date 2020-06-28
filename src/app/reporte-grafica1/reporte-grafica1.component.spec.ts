import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteGrafica1Component } from './reporte-grafica1.component';

describe('ReporteGrafica1Component', () => {
  let component: ReporteGrafica1Component;
  let fixture: ComponentFixture<ReporteGrafica1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporteGrafica1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteGrafica1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
