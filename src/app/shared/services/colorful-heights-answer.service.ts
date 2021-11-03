import {Injectable} from '@angular/core';
import {AnswerService, GameActionsService, MicroLessonMetricsService} from 'micro-lesson-core';
import {ColorfulHeightsChallengeService} from './colorful-heights-challenge.service';
import {ExpandedShowable, PartCorrectness, UserAnswer} from 'ox-types';
import {Observable} from 'rxjs';
import {BirdInfo} from '../models/types';
import {sameBird} from '../models/functions';

@Injectable({
  providedIn: 'root'
})
export class ColorfulHeightsAnswerService extends AnswerService {
  constructor(private gameActionsService: GameActionsService<any>,
              m: MicroLessonMetricsService<any>,
              private challenge: ColorfulHeightsChallengeService) {
    super(gameActionsService, m);
    this.gameActionsService.showNextChallenge.subscribe(value => {
      this.cleanAnswer();
    });
    this.gameActionsService.finishedTimeOfExercise.subscribe(() => {
      console.log('finishedTimeOfExercise');
      this.onTryAnswer();
    });
  }

  public cleanAnswer(): void {
    this.currentAnswer = {parts: []};
  }


//     /*  // todo chequear segun sea el id del juego
//   return this.equalsGnomeArray(this.currentExercise.value.exerciseData.gnomes, answer.sequence.reverse());
// */
//     return of(this.equalsGnomeArray(this.challenge.currentExercise.value.exerciseData.gnomes, answer.sequence));
//   }

  protected isValidAnswer(answer: UserAnswer): boolean {
    return false;
  }

  setBirdAsAnswer(bird: BirdInfo, birdImage: string) {
    const isCorrectAnswer = this.challenge.currentExercise.value !== undefined &&
      sameBird(this.challenge.currentExercise.value.exerciseData.targetBird, bird);
    this.currentAnswer = {
      parts: [
        {
          correctness: isCorrectAnswer ? 'correct' : 'wrong',
          parts: [
            {
              customProperties: [{name: 'color', value: bird.color}, {
                name: 'type',
                value: bird.type
              }, {name: 'isDouble', value: bird.isDouble as boolean}],
              value: {image: birdImage} as ExpandedShowable,
              format: 'expanded-showable'
            }
          ]
        }
      ]
    };
  }
}
