import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoAreasComponent } from './dialogo-areas.component';

describe('DialogoAreasComponent', () => {
  let component: DialogoAreasComponent;
  let fixture: ComponentFixture<DialogoAreasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogoAreasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoAreasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
