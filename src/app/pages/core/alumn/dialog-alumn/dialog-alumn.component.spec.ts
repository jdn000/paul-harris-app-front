import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAlumnComponent } from './dialog-alumn.component';

describe('DialogAlumnComponent', () => {
  let component: DialogAlumnComponent;
  let fixture: ComponentFixture<DialogAlumnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogAlumnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAlumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
