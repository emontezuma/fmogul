import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartesComponent } from './partes.component';

describe('PartesComponent', () => {
  let component: PartesComponent;
  let fixture: ComponentFixture<PartesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
