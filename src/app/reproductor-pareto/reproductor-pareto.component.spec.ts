import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReproductorParetoComponent } from './reproductor-pareto.component';

describe('ReproductorParetoComponent', () => {
  let component: ReproductorParetoComponent;
  let fixture: ComponentFixture<ReproductorParetoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReproductorParetoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReproductorParetoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
