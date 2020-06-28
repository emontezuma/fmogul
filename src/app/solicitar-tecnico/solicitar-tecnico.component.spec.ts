import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitarTecnicoComponent } from './solicitar-tecnico.component';

describe('SolicitarTecnicoComponent', () => {
  let component: SolicitarTecnicoComponent;
  let fixture: ComponentFixture<SolicitarTecnicoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolicitarTecnicoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitarTecnicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
