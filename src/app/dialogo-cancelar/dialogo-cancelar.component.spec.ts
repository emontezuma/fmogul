import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoCancelarComponent } from './dialogo-cancelar.component';

describe('DialogoCancelarComponent', () => {
  let component: DialogoCancelarComponent;
  let fixture: ComponentFixture<DialogoCancelarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogoCancelarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoCancelarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
