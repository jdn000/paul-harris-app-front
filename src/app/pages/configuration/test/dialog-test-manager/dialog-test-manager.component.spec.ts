import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogTestManagerComponent } from './dialog-test-manager.component';

describe('DialogTestManagerComponent', () => {
  let component: DialogTestManagerComponent;
  let fixture: ComponentFixture<DialogTestManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogTestManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogTestManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
