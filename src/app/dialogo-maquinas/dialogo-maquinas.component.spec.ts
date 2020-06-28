import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoMaquinasComponent } from './dialogo-maquinas.component';

describe('DialogoMaquinasComponent', () => {
  let component: DialogoMaquinasComponent;
  let fixture: ComponentFixture<DialogoMaquinasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogoMaquinasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoMaquinasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
