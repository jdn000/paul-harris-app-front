import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PastAvgComponent } from './past-avg.component';

describe('PastAvgComponent', () => {
  let component: PastAvgComponent;
  let fixture: ComponentFixture<PastAvgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PastAvgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PastAvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
