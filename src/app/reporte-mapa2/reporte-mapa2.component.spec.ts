import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteMapa2Component } from './reporte-mapa2.component';

describe('ReporteMapa2Component', () => {
  let component: ReporteMapa2Component;
  let fixture: ComponentFixture<ReporteMapa2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporteMapa2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteMapa2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
