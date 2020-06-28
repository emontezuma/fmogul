import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteGrafica4Component } from './reporte-grafica4.component';

describe('ReporteGrafica4Component', () => {
  let component: ReporteGrafica4Component;
  let fixture: ComponentFixture<ReporteGrafica4Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporteGrafica4Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteGrafica4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
