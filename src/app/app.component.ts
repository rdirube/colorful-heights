import {Component, ElementRef} from '@angular/core';
import {CommunicationOxService, I18nService, PreloaderOxService, ResourceOx, ResourceType} from 'ox-core';
import {ResourceFinalStateOxBridge, ScreenTypeOx} from 'ox-types';
import {
  AppInfoOxService,
  BaseMicroLessonApp,
  ChallengeService,
  EndGameService,
  GameActionsService,
  InWumboxService,
  LevelService,
  MicroLessonCommunicationService,
  MicroLessonMetricsService,
  ProgressService,
  ResourceStateService,
  SoundOxService
} from 'micro-lesson-core';
import {TranslocoService} from '@ngneat/transloco';
import {HttpClient} from '@angular/common/http';
import {PostMessageBridgeFactory} from 'ngox-post-message';
import {environment} from '../environments/environment';
import {BirdType} from './shared/models/types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends BaseMicroLessonApp {
  title = 'colorful-heights';

  constructor(preloader: PreloaderOxService, translocoService: TranslocoService, wumboxService: InWumboxService,
              communicationOxService: CommunicationOxService, microLessonCommunicationService: MicroLessonCommunicationService<any>,
              progressService: ProgressService, elementRef: ElementRef, gameActions: GameActionsService<any>,
              endGame: EndGameService, i18nService: I18nService, levelService: LevelService, http: HttpClient,
              challenge: ChallengeService<any, any>, appInfo: AppInfoOxService,
              microLessonMetrics: MicroLessonMetricsService<any>, // Todo
              resourceStateService: ResourceStateService,
              sound: SoundOxService, bridgeFactory: PostMessageBridgeFactory,
              transloco: TranslocoService) {
    super(preloader, translocoService, wumboxService, communicationOxService, microLessonCommunicationService,
      progressService, elementRef, gameActions, endGame,
      i18nService, levelService, http, challenge, appInfo, microLessonMetrics, sound, bridgeFactory);
    console.log(svgBirdGenerator("lechuza", ["alas", "1"]));
    console.log(svgBirdGenerator("lechuza", ["alas", "2"]));
    console.log(svgBirdGenerator("lechuza", ["happy"]));
    console.log(svgBirdGenerator("lechuza", ["sad"]));
    console.log(svgBirdGenerator("lechuza", []));
    communicationOxService.receiveI18NInfo.subscribe(z => {
      console.log('i18n', z);
    });
    gameActions.microLessonCompleted.subscribe(__ => {
      if (resourceStateService.currentState?.value) {
        microLessonCommunicationService.sendMessageMLToManager(ResourceFinalStateOxBridge, resourceStateService.currentState.value);
      }
    });
    preloader.addResourcesToLoad(this.getGameResourcesToLoad());
    console.log("se instancio coloful");
  }


  protected getGameResourcesToLoad(): ResourceOx[] {
    const svgFondo: string[] = ['arbol.svg', 'Base.svg',
      'hueco.svg', 'hueco-over.svg', 'rama_derecha.svg', 'rama_izquierda.svg', 'reloj/Reloj1.svg', 'reloj/reloj4.svg', 'Muestra pajaritos.svg','tutorial/tutorial_botón.svg'];
    const svgBirds: string[] = ['cóndor.svg', 'cóndor_alas_1.svg', 'cóndor_alas_2.svg', 'cóndor_happy.svg', 'cóndor_sad.svg', 'cotorra.svg',
      'cotorra_alas_1.svg', 'cotorra_alas_2.svg', 'cotorra_happy.svg', 'cotorra_sad.svg', 'gordo.svg', 'gordo_alas_1.svg', 'gordo_alas_2.svg', 'gordo_happy.svg',
      'gordo_sad.svg', 'lechuza.svg', 'lechuza_alas_1.svg', 'lechuza_alas_2.svg', 'lechuza_happy.svg', 'lechuza_sad.svg', 'pelado.svg', 'pelado_alas_1.svg',
      'pelado_alas_2.svg', 'pelado_happy.svg', 'pelado_sad.svg'];
    // const animationSvgs = [];
    // animationSvgs.forEach(z => svg.push('gnome-game/svg/Fondos/sorpresas/' + z));
    const sounds = ['bonus.mp3', 'bird_sound_colorful_heights.mp3', 'magnifier_sound.mp3'].map( z => 'colorful-heights/sounds/' + z);
    return svgFondo.map(x => new ResourceOx('colorful-heights/svg/Elementos fondo/' + x, ResourceType.Svg,
      [ScreenTypeOx.Game], true))
      .concat(svgBirds.map(x => new ResourceOx('mini-lessons/executive-functions/colorful-heights/svg/Pajaritos/' + x, ResourceType.Svg,
        [ScreenTypeOx.Game], false)))
      .concat(getResourceArrayFromUrlList(sounds, ResourceType.Audio, true))
      .concat(getResourceArrayFromUrlList(['mini-lessons/executive-functions/svg/buttons/Home.svg',
        'mini-lessons/executive-functions/svg/buttons/Hint.svg',
        'mini-lessons/executive-functions/svg/buttons/saltear.svg'], ResourceType.Svg, false))
      ;
  }

  protected getBasePath(): string {
    return environment.basePath;
  }

}

function getResourceArrayFromUrlList(urlList: string[], resourceType: ResourceType, isLocal: boolean): ResourceOx[] {
  return urlList.map(listElement => new ResourceOx(listElement, resourceType, [ScreenTypeOx.Game], isLocal));
}


function svgBirdGenerator(bird: BirdType, extraWords: string[]): string {
  return "colorful-heights/svg/Pajaritos/" + [bird as string].concat(extraWords).join('_') + ".svg";
}
// }
// function svgBirdGenerator(bird: BirdType, svgType?: string): string {
//   if (svgType === "happy" || svgType === "sad") {
//     svgType = "_" + svgType;
//   } else if (svgType) {
//     const wingTypeSolution = svgType.split(" ");
//     svgType = "_" + wingTypeSolution[0] + "_" + wingTypeSolution[1];
//   } else {
//     svgType = "";
//   }
//   return "colorful-heights/svg/Pajaritos/" + bird + svgType + ".svg";
// }
