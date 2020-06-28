import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoCTComponent } from './dialogo-ct.component';

describe('DialogoCTComponent', () => {
  let component: DialogoCTComponent;
  let fixture: ComponentFixture<DialogoCTComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogoCTComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoCTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
