import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const TUTORIAL_COMPLETED = 'tutorial-completed';

@Injectable({
  providedIn: 'root',
})
export class TutorialService {
  private tutorialDataStorage: Storage = localStorage;
  public  readonly  totalSlides = 3;
  public currentSlide = new BehaviorSubject<number>(1);

  get tutorialCompleted(): boolean {
    return this.tutorialDataStorage.getItem(TUTORIAL_COMPLETED) === 'true';
  }

  set tutorialCompleted(val) {
    this.tutorialDataStorage.setItem(TUTORIAL_COMPLETED, `${val}`);
  }

  isLastSlide(): boolean {
    return this.currentSlide.getValue() === this.totalSlides;
  }

  onTutorialCompleted(): void {
    this.tutorialCompleted = true;
  }

  prevSlide(): void {
    const currentValue = this.currentSlide.getValue();
    if (currentValue === 1) {
      return;
    }
    this.currentSlide.next(currentValue - 1);
  }

  nextSlide(): void {
    const currentValue = this.currentSlide.getValue();
    if (currentValue === this.totalSlides) {
      return;
    }
    this.currentSlide.next(currentValue + 1);
  }
}
