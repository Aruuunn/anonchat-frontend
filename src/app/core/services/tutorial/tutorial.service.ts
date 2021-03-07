import { Injectable } from '@angular/core';

const TUTORIAL_COMPLETED = 'tutorial-completed';

@Injectable({
  providedIn: 'root',
})
export class TutorialService {
  private tutorialDataStorage: Storage = localStorage;

  get tutorialCompleted(): boolean {
    return this.tutorialDataStorage.getItem(TUTORIAL_COMPLETED) === 'true';
  }

  set tutorialCompleted(val) {
    this.tutorialDataStorage.setItem(TUTORIAL_COMPLETED, `${val}`);
  }
}
