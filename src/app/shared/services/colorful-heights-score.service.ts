import { Injectable } from '@angular/core';
import {ScoreStarsService} from 'micro-lesson-core';
import {ExerciseData, MiniLessonMetrics, numberArrayRange, sum} from 'ox-types';
import {ColorfulHeightsChallengeService} from './colorful-heights-challenge.service';
import {ColorfulHeightsScoreCriteria} from '../models/types';

@Injectable({
  providedIn: 'root'
})
export class ColorfulHeightsScoreService  extends ScoreStarsService<any> {

  constructor(private challengeService: ColorfulHeightsChallengeService) {
    super();
  }

  calculateScore(metrics: MiniLessonMetrics, minScore?: number, maxScore?: number): void {
    const scoreDifficulty = this.challengeService.exerciseConfig.scoreCriteria;
    const totalTime = this.challengeService.exerciseConfig.totalGameTime;
    const maxCorrectBirds = Math.ceil(totalTime / getStimatedTimeByDifficulty(scoreDifficulty));
    const maxRelativeScore = 10000;
    const valuePerBird = maxRelativeScore / maxCorrectBirds;
    (metrics.expandableInfo?.exercisesData as ExerciseData[]).forEach( z => {
      metrics.pointsScore += z.finalStatus === 'correct' ? valuePerBird :
      z.finalStatus === 'wrong' ? -2 * valuePerBird : 0;
      console.log('Metric was', z.finalStatus);
      console.log('New score...', metrics.pointsScore);
    });
    metrics.pointsScore = Math.round(Math.max(500, metrics.pointsScore));
    metrics.bonusScore = 0;
    metrics.score = Math.round(metrics.pointsScore + metrics.bonusScore);
    // En los primeros n (5) ejercicios cada gnomo vale la sumatoria 6000/(1 a n) = valorGnomo (400).
    //   En los siguientes m a infinito ejercicios (9-5 = 4) cada gnomo vale 4000/=

  }
}

function getStimatedTimeByDifficulty(c: ColorfulHeightsScoreCriteria): number {
  switch (c) {
    case 'fácil': return 10;
    case 'media': return 7;
    case 'difícil': return 4;
    case 'lengendario': return 2.5;
    default:
      console.error('There was not difficulty to calculate the score. Using media.');
      return getStimatedTimeByDifficulty('media');
      // throw new Error('There was not difficulty to calculate the score.')
  }
}
