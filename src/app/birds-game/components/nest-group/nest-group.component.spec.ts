import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NestGroupComponent } from './nest-group.component';

describe('NestGroupComponent', () => {
  let component: NestGroupComponent;
  let fixture: ComponentFixture<NestGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NestGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NestGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
