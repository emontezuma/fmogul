import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoTablasComponent } from './dialogo-tablas.component';

describe('DialogoTablasComponent', () => {
  let component: DialogoTablasComponent;
  let fixture: ComponentFixture<DialogoTablasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogoTablasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoTablasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
