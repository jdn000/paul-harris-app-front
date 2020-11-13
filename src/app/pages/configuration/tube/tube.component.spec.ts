import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TubeComponent } from './tube.component';

describe('TubeComponent', () => {
  let component: TubeComponent;
  let fixture: ComponentFixture<TubeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TubeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TubeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
