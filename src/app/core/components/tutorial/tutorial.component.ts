import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';

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

  getTopValue(): number {
    return window.innerHeight - this.elRef.offsetTop <
      this.elRef.clientHeight + 60
      ? this.elRef.offsetTop - this.elRef.clientHeight - 25
      : this.elRef.offsetTop - this.elRef.clientHeight / 2;
  }

  ngOnDestroy(): void {
    this.elRef.classList.remove('z-20');
  }
}
