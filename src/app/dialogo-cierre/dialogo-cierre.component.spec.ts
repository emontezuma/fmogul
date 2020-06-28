import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoCierreComponent } from './dialogo-cierre.component';

describe('DialogoCierreComponent', () => {
  let component: DialogoCierreComponent;
  let fixture: ComponentFixture<DialogoCierreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogoCierreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoCierreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
