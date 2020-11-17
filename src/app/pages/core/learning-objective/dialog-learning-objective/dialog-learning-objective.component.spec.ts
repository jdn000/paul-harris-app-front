import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogLearningObjectiveComponent } from './dialog-learning-objective.component';

describe('DialogLearningObjectiveComponent', () => {
  let component: DialogLearningObjectiveComponent;
  let fixture: ComponentFixture<DialogLearningObjectiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogLearningObjectiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogLearningObjectiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
