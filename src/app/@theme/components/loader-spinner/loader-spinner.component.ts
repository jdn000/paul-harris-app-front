import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ngx-loader-spinner',
  templateUrl: './loader-spinner.component.html',
  styleUrls: ['./loader-spinner.component.scss']
})
export class LoaderSpinnerComponent implements OnInit {

  constructor() { }

  @Input() value: number = 100;
  @Input() diameter: number = 100;
  @Input() mode: string = 'indeterminate';
  @Input() strokeWidth: number = 10;
  @Input() overlay: boolean = false;
  @Input() color: string = 'primary';

  ngOnInit(): void {
  }

}
