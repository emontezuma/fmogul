import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoPagerComponent } from './dialogo-pager.component';

describe('DialogoPagerComponent', () => {
  let component: DialogoPagerComponent;
  let fixture: ComponentFixture<DialogoPagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogoPagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoPagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
