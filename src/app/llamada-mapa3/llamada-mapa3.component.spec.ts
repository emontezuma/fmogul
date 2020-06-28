import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LlamadaMapa3Component } from './llamada-mapa3.component';

describe('LlamadaMapa3Component', () => {
  let component: LlamadaMapa3Component;
  let fixture: ComponentFixture<LlamadaMapa3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LlamadaMapa3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LlamadaMapa3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
