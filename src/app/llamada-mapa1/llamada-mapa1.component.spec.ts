import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LlamadaMapa1Component } from './llamada-mapa1.component';

describe('LlamadaMapa1Component', () => {
  let component: LlamadaMapa1Component;
  let fixture: ComponentFixture<LlamadaMapa1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LlamadaMapa1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LlamadaMapa1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
