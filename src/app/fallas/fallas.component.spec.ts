import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FallasComponent } from './fallas.component';

describe('FallasComponent', () => {
  let component: FallasComponent;
  let fixture: ComponentFixture<FallasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FallasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FallasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
