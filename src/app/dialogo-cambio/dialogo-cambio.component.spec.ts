import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoCambioComponent } from './dialogo-cambio.component';

describe('DialogoCambioComponent', () => {
  let component: DialogoCambioComponent;
  let fixture: ComponentFixture<DialogoCambioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogoCambioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoCambioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
