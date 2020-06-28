import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoParosComponent } from './dialogo-paros.component';

describe('DialogoParosComponent', () => {
  let component: DialogoParosComponent;
  let fixture: ComponentFixture<DialogoParosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogoParosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoParosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
