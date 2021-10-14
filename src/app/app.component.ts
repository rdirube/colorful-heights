import {Component, ElementRef} from '@angular/core';
import {CommunicationOxService, I18nService, PreloaderOxService, ResourceOx, ResourceType} from 'ox-core';
import {ResourceFinalStateOxBridge, ScreenTypeOx} from 'ox-types';
import {
  AppInfoOxService,
  BaseMicroLessonApp, ChallengeService,
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
    communicationOxService.receiveI18NInfo.subscribe(z => {
      console.log('i18n', z);
    });
    gameActions.microLessonCompleted.subscribe(__ => {
      if (resourceStateService.currentState?.value) {
        microLessonCommunicationService.sendMessageMLToManager(ResourceFinalStateOxBridge, resourceStateService.currentState.value);
      }
    });
    preloader.addResourcesToLoad(this.getGameResourcesToLoad());
  }


  protected getGameResourcesToLoad(): ResourceOx[] {
    const svgFondo: string[] = ['arbol.svg', 'Base.svg',
    'hueco.svg', 'hueco-over.svg', 'rama_derecha.svg', 'rama_izquierda.svg', 'reloj/Reloj1.svg', 'reloj/reloj4.svg'];
    const svgBirds: string[] = ['cotorra_amarillo.svg', 'gordo_azul.svg'];
    // const animationSvgs = [];
    // animationSvgs.forEach(z => svg.push('gnome-game/svg/Fondos/sorpresas/' + z));

    return svgFondo.map(x => new ResourceOx('colorful-heights/svg/Elementos fondo/' + x, ResourceType.Svg,
      [ScreenTypeOx.Game], true))
      .concat(svgBirds.map(x => new ResourceOx('colorful-heights/svg/Pajaritos/' + x, ResourceType.Svg,
        [ScreenTypeOx.Game], true)))
      .concat(getResourceArrayFromUrlList(['mini-lessons/executive-functions/svg/buttons/Home.svg',
        'mini-lessons/executive-functions/svg/buttons/Hint.svg'], ResourceType.Svg, false))
      ;
  }

  protected getBasePath(): string {
    return environment.basePath;
  }

}

function getResourceArrayFromUrlList(urlList: string[], resourceType: ResourceType, isLocal: boolean): ResourceOx[] {
  return urlList.map(listElement => new ResourceOx(listElement, resourceType, [ScreenTypeOx.Game], isLocal));
}
