import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LlamadaAtencionComponent } from './llamada-atencion.component';

describe('LlamadaAtencionComponent', () => {
  let component: LlamadaAtencionComponent;
  let fixture: ComponentFixture<LlamadaAtencionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LlamadaAtencionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LlamadaAtencionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
