import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MensajeFlotanteComponent } from './mensaje-flotante.component';

describe('MensajeFlotanteComponent', () => {
  let component: MensajeFlotanteComponent;
  let fixture: ComponentFixture<MensajeFlotanteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MensajeFlotanteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MensajeFlotanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
