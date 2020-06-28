import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoPoliticasComponent } from './dialogo-politicas.component';

describe('DialogoPoliticasComponent', () => {
  let component: DialogoPoliticasComponent;
  let fixture: ComponentFixture<DialogoPoliticasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogoPoliticasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoPoliticasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
