import { TestBed } from '@angular/core/testing';

import { ColorfulHeightsChallengeService } from './colorful-heights-challenge.service';

describe('ColorfulHeightsChallengeService', () => {
  let service: ColorfulHeightsChallengeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ColorfulHeightsChallengeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
