import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReproductorMtbfComponent } from './reproductor-mtbf.component';

describe('ReproductorMtbfComponent', () => {
  let component: ReproductorMtbfComponent;
  let fixture: ComponentFixture<ReproductorMtbfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReproductorMtbfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReproductorMtbfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
