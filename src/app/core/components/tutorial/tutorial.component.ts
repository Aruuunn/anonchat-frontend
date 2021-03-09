import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  styleUrls: ['./tutorial.component.scss'],
  templateUrl: './tutorial.component.html',
  selector: 'app-tutorial',
})
export class TutorialComponent implements OnInit, OnDestroy {
  @Input() title!: string;
  @Input() description!: string;
  @Input() elRef!: HTMLElement;

  ngOnInit(): void {
    this.elRef.focus();
    this.elRef.classList.add('z-20');
  }

  isLargeScreen(): boolean {
    return window.innerWidth > 767;
  }

  getTopValue(): number {
    if (!this.isLargeScreen()) {
      console.log((this.elRef.offsetParent as HTMLElement)?.offsetTop);

      return (
        ((this.elRef.offsetParent as HTMLElement)?.offsetTop ?? 0) -
        this.elRef.clientHeight -
        100
      );
    }

    return window.innerHeight - this.elRef.offsetTop <
      this.elRef.clientHeight + 60
      ? this.elRef.offsetTop - this.elRef.clientHeight - 25
      : this.elRef.offsetTop - this.elRef.clientHeight / 2;
  }


  ngOnDestroy(): void {
    this.elRef.classList.remove('z-20');
  }
}
