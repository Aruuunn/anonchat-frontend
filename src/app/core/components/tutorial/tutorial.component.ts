import {
  AfterContentInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { TutorialService } from '../../services/tutorial/tutorial.service';

@Component({
  styleUrls: ['./tutorial.component.scss'],
  templateUrl: './tutorial.component.html',
  selector: 'app-tutorial',
})
export class TutorialComponent implements OnInit, OnDestroy, AfterContentInit {
  constructor(
    public tutorialService: TutorialService,
    private ref: ElementRef
  ) {}

  private containerHeight!: number;
  private nextButtonEl!: HTMLButtonElement;

  @Input() title!: string;
  @Input() description!: string;
  @Input() elRef!: HTMLElement;

  containerElRef!: HTMLDivElement;

  ngOnInit(): void {
    this.containerElRef = this.ref.nativeElement.querySelector('#tuts-ctn');
    this.nextButtonEl = this.ref.nativeElement.querySelector('#next-btn');
    this.containerHeight = this.containerElRef.clientHeight;
    this.elRef.classList.add('z-20');
  }

  ngAfterContentInit(): void {
    this.nextButtonEl?.focus();
  }

  isLargeScreen(): boolean {
    return window.innerWidth > 767;
  }

  getTopValue(): number {
    if (!this.isLargeScreen()) {
      console.log((this.elRef.offsetParent as HTMLElement)?.offsetTop);

      return (
        ((this.elRef.offsetParent as HTMLElement)?.offsetTop ?? 0) -
        this.containerHeight
      );
    }

    return window.innerHeight - this.elRef.offsetTop < this.containerHeight
      ? this.elRef.offsetTop - this.containerHeight - 10
      : this.elRef.offsetTop - this.containerHeight / 2;
  }

  getArrowTopValue(): number {
    if (this.isLargeScreen()) {
      return this.elRef.offsetTop + 10;
    }

    return window.screen.height - 100;
  }

  getArrowLeftSm(): number {
    return this.elRef.offsetLeft + 10;
  }

  ngOnDestroy(): void {
    this.elRef.classList.remove('z-20');
  }
}
