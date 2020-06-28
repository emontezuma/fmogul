import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReproductorImagenesComponent } from './reproductor-imagenes.component';

describe('ReproductorImagenesComponent', () => {
  let component: ReproductorImagenesComponent;
  let fixture: ComponentFixture<ReproductorImagenesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReproductorImagenesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReproductorImagenesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
