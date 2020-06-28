import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagersComponent } from './pagers.component';

describe('PagersComponent', () => {
  let component: PagersComponent;
  let fixture: ComponentFixture<PagersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
