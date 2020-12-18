import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogMyGradeCalificationComponent } from './dialog-my-grade-calification.component';

describe('DialogMyGradeCalificationComponent', () => {
  let component: DialogMyGradeCalificationComponent;
  let fixture: ComponentFixture<DialogMyGradeCalificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DialogMyGradeCalificationComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogMyGradeCalificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
