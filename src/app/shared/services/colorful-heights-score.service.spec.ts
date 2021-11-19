import { TestBed } from '@angular/core/testing';

import { ColorfulHeightsScoreService } from './colorful-heights-score.service';

describe('ColorfulHeightsScoreService', () => {
  let service: ColorfulHeightsScoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ColorfulHeightsScoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
