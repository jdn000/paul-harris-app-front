import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogUserManagerComponent } from './dialog-user-manager.component';

describe('DialogUserManagerComponent', () => {
  let component: DialogUserManagerComponent;
  let fixture: ComponentFixture<DialogUserManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogUserManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogUserManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
