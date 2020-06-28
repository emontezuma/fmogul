import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LlamadaMapa4Component } from './llamada-mapa4.component';

describe('LlamadaMapa4Component', () => {
  let component: LlamadaMapa4Component;
  let fixture: ComponentFixture<LlamadaMapa4Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LlamadaMapa4Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LlamadaMapa4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
