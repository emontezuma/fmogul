import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteGrafica2Component } from './reporte-grafica2.component';

describe('ReporteGrafica2Component', () => {
  let component: ReporteGrafica2Component;
  let fixture: ComponentFixture<ReporteGrafica2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporteGrafica2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteGrafica2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
