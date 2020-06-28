import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteMapa1Component } from './reporte-mapa1.component';

describe('ReporteMapa1Component', () => {
  let component: ReporteMapa1Component;
  let fixture: ComponentFixture<ReporteMapa1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporteMapa1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteMapa1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
