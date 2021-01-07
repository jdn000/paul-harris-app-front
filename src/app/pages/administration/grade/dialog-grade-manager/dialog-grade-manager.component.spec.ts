import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogGradeManagerComponent } from './dialog-grade-manager.component';

describe('DialogGradeManagerComponent', () => {
  let component: DialogGradeManagerComponent;
  let fixture: ComponentFixture<DialogGradeManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogGradeManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogGradeManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
