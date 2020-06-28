import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LlamadaMapa2Component } from './llamada-mapa2.component';

describe('LlamadaMapa2Component', () => {
  let component: LlamadaMapa2Component;
  let fixture: ComponentFixture<LlamadaMapa2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LlamadaMapa2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LlamadaMapa2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
