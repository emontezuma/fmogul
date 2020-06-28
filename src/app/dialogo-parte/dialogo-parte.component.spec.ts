import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoParteComponent } from './dialogo-parte.component';

describe('DialogoParteComponent', () => {
  let component: DialogoParteComponent;
  let fixture: ComponentFixture<DialogoParteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogoParteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoParteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
