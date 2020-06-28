import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoGeneralesComponent } from './dialogo-generales.component';

describe('DialogoGeneralesComponent', () => {
  let component: DialogoGeneralesComponent;
  let fixture: ComponentFixture<DialogoGeneralesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogoGeneralesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoGeneralesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
