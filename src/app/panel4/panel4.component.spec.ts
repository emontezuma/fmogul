import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Panel4Component } from './panel4.component';

describe('Panel4Component', () => {
  let component: Panel4Component;
  let fixture: ComponentFixture<Panel4Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Panel4Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Panel4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
