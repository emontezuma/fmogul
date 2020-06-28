import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LlamadaReporteComponent } from './llamada-reporte.component';

describe('LlamadaReporteComponent', () => {
  let component: LlamadaReporteComponent;
  let fixture: ComponentFixture<LlamadaReporteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LlamadaReporteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LlamadaReporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
