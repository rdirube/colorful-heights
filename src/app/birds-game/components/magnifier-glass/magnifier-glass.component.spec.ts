import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MagnifierGlassComponent } from './magnifier-glass.component';

describe('MagnifierGlassComponent', () => {
  let component: MagnifierGlassComponent;
  let fixture: ComponentFixture<MagnifierGlassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MagnifierGlassComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MagnifierGlassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
