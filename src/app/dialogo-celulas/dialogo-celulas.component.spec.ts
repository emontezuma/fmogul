import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoCelulasComponent } from './dialogo-celulas.component';

describe('DialogoCelulasComponent', () => {
  let component: DialogoCelulasComponent;
  let fixture: ComponentFixture<DialogoCelulasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogoCelulasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoCelulasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
