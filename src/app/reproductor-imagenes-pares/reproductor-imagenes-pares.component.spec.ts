import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReproductorImagenesParesComponent } from './reproductor-imagenes-pares.component';

describe('ReproductorImagenesParesComponent', () => {
  let component: ReproductorImagenesParesComponent;
  let fixture: ComponentFixture<ReproductorImagenesParesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReproductorImagenesParesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReproductorImagenesParesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
