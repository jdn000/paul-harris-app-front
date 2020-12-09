import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCalificationComponent } from './dialog-calification.component';

describe('DialogCalificationComponent', () => {
  let component: DialogCalificationComponent;
  let fixture: ComponentFixture<DialogCalificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogCalificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCalificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
