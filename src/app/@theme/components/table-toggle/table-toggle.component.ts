import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'ngx-table-toggle',
  templateUrl: './table-toggle.component.html',
  styleUrls: ['./table-toggle.component.scss']
})
export class TableToggleComponent implements OnInit {

  @Input() rowData: {
    status: boolean
  };

  constructor() { }

  ngOnInit(): void {
  }

  @Output() update: EventEmitter<any> = new EventEmitter();

  updateStatus() {
    this.update.emit(this.rowData);
  }

}
