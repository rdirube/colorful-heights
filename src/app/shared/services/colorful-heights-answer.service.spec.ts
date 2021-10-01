import { TestBed } from '@angular/core/testing';

import { ColorfulHeightsAnswerService } from './colorful-heights-answer.service';

describe('ColorfulHeightsAnswerService', () => {
  let service: ColorfulHeightsAnswerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ColorfulHeightsAnswerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
