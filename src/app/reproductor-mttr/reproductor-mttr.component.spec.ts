import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReproductorMttrComponent } from './reproductor-mttr.component';

describe('ReproductorMttrComponent', () => {
  let component: ReproductorMttrComponent;
  let fixture: ComponentFixture<ReproductorMttrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReproductorMttrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReproductorMttrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
