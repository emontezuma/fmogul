import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoConfiguracionComponent } from './dialogo-configuracion.component';

describe('DialogoConfiguracionComponent', () => {
  let component: DialogoConfiguracionComponent;
  let fixture: ComponentFixture<DialogoConfiguracionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogoConfiguracionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoConfiguracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
