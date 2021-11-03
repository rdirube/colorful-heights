import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BirdToSelectComponent } from './bird-to-select.component';

describe('BirdToSelectComponent', () => {
  let component: BirdToSelectComponent;
  let fixture: ComponentFixture<BirdToSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BirdToSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BirdToSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
