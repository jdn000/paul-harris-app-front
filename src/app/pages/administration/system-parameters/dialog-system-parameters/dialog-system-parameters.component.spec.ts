import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSystemParametersComponent } from './dialog-system-parameters.component';

describe('DialogSystemParametersComponent', () => {
  let component: DialogSystemParametersComponent;
  let fixture: ComponentFixture<DialogSystemParametersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogSystemParametersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSystemParametersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
