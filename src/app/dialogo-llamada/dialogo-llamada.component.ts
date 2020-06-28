import { Component, OnInit, inject, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ComunicacionService } from '../services/comunicacion.service';


@Component({
  selector: 'app-dialogo-llamada',
  templateUrl: './dialogo-llamada.component.html',
  styleUrls: ['./dialogo-llamada.component.css']
})


export class DialogoLlamadaComponent implements OnInit {

  detalle: string = "";
  accion: number = 0;
  visible: boolean = false;

  constructor( private comunicacion: ComunicacionService, public dialogRef: MatDialogRef<DialogoLlamadaComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

  aceptar(){
    this.data.accion = 1;
    this.dialogRef.close(this.data);
  }

  cancelar(){
    this.data.accion = 0;
    this.dialogRef.close(this.data);
  }

}
