import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoReproductorComponent } from './dialogo-reproductor.component';

describe('DialogoReproductorComponent', () => {
  let component: DialogoReproductorComponent;
  let fixture: ComponentFixture<DialogoReproductorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogoReproductorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoReproductorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
