import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReproductorCelulasComponent } from './reproductor-celulas.component';

describe('ReproductorCelulasComponent', () => {
  let component: ReproductorCelulasComponent;
  let fixture: ComponentFixture<ReproductorCelulasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReproductorCelulasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReproductorCelulasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
