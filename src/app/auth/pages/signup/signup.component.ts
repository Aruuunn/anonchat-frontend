import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['../../../../styles/palette.scss', '../../../../styles/common.scss']
})
export class SignupComponent implements OnInit {

  @ViewChild('f') form: NgForm | undefined;

  constructor() {
  }

  ngOnInit(): void {
  }

  submitHandler(): void {
    console.log(this.form);
  }

}
