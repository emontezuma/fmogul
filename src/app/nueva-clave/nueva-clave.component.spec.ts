import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevaClaveComponent } from './nueva-clave.component';

describe('NuevaClaveComponent', () => {
  let component: NuevaClaveComponent;
  let fixture: ComponentFixture<NuevaClaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NuevaClaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NuevaClaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
