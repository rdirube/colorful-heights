import {EventEmitter, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BirdsService {

  public birdsInteractable = new EventEmitter<boolean>();

  constructor() { }
}
