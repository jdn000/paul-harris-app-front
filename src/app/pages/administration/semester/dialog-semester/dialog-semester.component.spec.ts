import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSemesterComponent } from './dialog-semester.component';

describe('DialogSemesterComponent', () => {
  let component: DialogSemesterComponent;
  let fixture: ComponentFixture<DialogSemesterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogSemesterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSemesterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
