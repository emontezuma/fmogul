import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReproductorAreasComponent } from './reproductor-areas.component';

describe('ReproductorAreasComponent', () => {
  let component: ReproductorAreasComponent;
  let fixture: ComponentFixture<ReproductorAreasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReproductorAreasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReproductorAreasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
