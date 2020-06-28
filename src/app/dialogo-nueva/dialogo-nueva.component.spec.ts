import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoNuevaComponent } from './dialogo-nueva.component';

describe('DialogoNuevaComponent', () => {
  let component: DialogoNuevaComponent;
  let fixture: ComponentFixture<DialogoNuevaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogoNuevaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoNuevaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
