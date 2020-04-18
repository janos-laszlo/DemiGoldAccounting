import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-csv-example',
  templateUrl: './csv-example.component.html',
  styleUrls: ['./csv-example.component.css']
})
export class CsvExampleComponent {

  constructor(
    public dialogRef: MatDialogRef<CsvExampleComponent>) { }

}
