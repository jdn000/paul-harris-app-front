import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogUserSubjectComponent } from './dialog-user-subject.component';

describe('DialogUserSubjectComponent', () => {
  let component: DialogUserSubjectComponent;
  let fixture: ComponentFixture<DialogUserSubjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogUserSubjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogUserSubjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
