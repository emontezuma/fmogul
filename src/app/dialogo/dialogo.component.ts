import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ComunicacionService } from '../services/comunicacion.service';

@Component({
  selector: 'app-dialogo',
  templateUrl: './dialogo.component.html',
  styleUrls: ['./dialogo.component.css']
})
export class DialogoComponent implements OnInit {

  iconoSel: string = "propioVobo";
  constructor( private comunicacion: ComunicacionService, public dialogRef: MatDialogRef<DialogoComponent>, @Inject(MAT_DIALOG_DATA) public data: any ) { 
    this.iconoSel = this.comunicacion.recuperIconoDialogo();

  }


  ngOnInit() {
  }

  cancelar(){
    this.dialogRef.close('0');
  }

  aceptar() {
    this.dialogRef.close('1');
  }
}
