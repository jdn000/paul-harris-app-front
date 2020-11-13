import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogTubeManagerComponent } from './dialog-tube-manager.component';

describe('DialogTubeManagerComponent', () => {
  let component: DialogTubeManagerComponent;
  let fixture: ComponentFixture<DialogTubeManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogTubeManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogTubeManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
