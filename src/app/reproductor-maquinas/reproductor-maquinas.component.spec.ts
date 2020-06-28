import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReproductorMaquinasComponent } from './reproductor-maquinas.component';

describe('ReproductorMaquinasComponent', () => {
  let component: ReproductorMaquinasComponent;
  let fixture: ComponentFixture<ReproductorMaquinasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReproductorMaquinasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReproductorMaquinasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
