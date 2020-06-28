import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleParosComponent } from './detalle-paros.component';

describe('DetalleParosComponent', () => {
  let component: DetalleParosComponent;
  let fixture: ComponentFixture<DetalleParosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleParosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleParosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
