import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteMapa3Component } from './reporte-mapa3.component';

describe('ReporteMapa3Component', () => {
  let component: ReporteMapa3Component;
  let fixture: ComponentFixture<ReporteMapa3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporteMapa3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteMapa3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
