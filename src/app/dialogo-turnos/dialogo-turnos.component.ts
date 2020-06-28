import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, } from '@angular/material';
import { ComunicacionService } from '../services/comunicacion.service';
import { FormControl, Validators } from '@angular/forms';
import { GestionApisService } from '../services/gestion-apis.service';
import { MatDialog } from '@angular/material';
import { DialogoComponent } from '../dialogo/dialogo.component';

@Component({
  selector: 'app-dialogo-turnos',
  templateUrl: './dialogo-turnos.component.html',
  styleUrls: ['./dialogo-turnos.component.css']
})
export class DialogoTurnosComponent implements OnInit {

  
  referencia1 = new FormControl('', [Validators.required]);
  desde1 =   new FormControl('', [Validators.required, Validators.min(0), Validators.max(999999)]);
  hasta1 =   new FormControl('', [Validators.required, Validators.min(0), Validators.max(999999)]);
  estatus: boolean = true;  
  estatusantes: string = "";
  idParo: string = "";
  referencia: string = "";
  desde: string = "000000";
  hasta: string = "235959";
  cambio: boolean = false;
  mover: string = "0";
  modificador: string = "";
  creador: string = "";
  fcreacion: string = "";
  fmodificacion: string = "";

  hayError1: boolean = false;
  hayError2: boolean = false;
  hayError3: boolean = false;
  hayError4: boolean = false;

  constructor(public dialogRef: MatDialogRef<DialogoTurnosComponent>, @Inject(MAT_DIALOG_DATA) public datos: any, public dialog: MatDialog, private comunicacion: ComunicacionService, private gestionBD: GestionApisService) {
    this.idParo = '' + datos.id;
    if (datos.id > 0) 
    {
      let consulta1 = "SELECT turnos.*, a.nombre as tcreador, b.nombre as tmodificador FROM turnos LEFT JOIN usuarios AS a ON turnos.creado = a.id LEFT JOIN usuarios AS b ON turnos.modificado = b.id WHERE turnos.id = " + this.idParo;
      let camposcab={accion: 50100, consulta: consulta1};  
      this.gestionBD.consultasBD(camposcab).subscribe((data) =>{
        this.referencia = data.referencia;
        this.desde = data.inicia.replace(/:/g, "");
        this.hasta = data.termina.replace(/:/g, "");
        this.estatus = (data.estatus =="A" ? true : false);
        this.estatusantes = data.estatus;
        this.cambio = (data.cambiodia =="S" ? true : false);
        this.mover = data.mover;
        this.modificador = data.tmodificador;
        this.creador = data.tcreador;
        this.fcreacion = this.comunicacion.convertirFecha(2,data.creacion,"dd-MM-yyyy hh:mm a");
        this.fmodificacion = this.comunicacion.convertirFecha(2,data.modificacion,"dd-MM-yyyy hh:mm a");
    });
  }
}

cancelar(){
  this.datos.accion = 0;
  this.dialogRef.close(this.datos);
}

eliminar() {
  const dialogRef = this.dialog.open(DialogoComponent, {
    width: '570px', height: '270px', data: { botones: 2, cabecera: 'INACTIVAR TURNO', contenido: 'Esta acción inactivará el turno y no estará disponible en el sistema. ¿Está seguro de esta acción?', boton1: 'Si, lo inactivaré', boton2: 'No, lo pensaré mejor', tipoMensaje: 'NORMAL' }
  });
  dialogRef.afterClosed().subscribe(result => {
    if (!result)
    {
    }
    else if (result == 1)
    {
      let consulta1 = "update turnos set estatus = 'I' WHERE id = " + this.idParo;
      let camposcab={accion: 50030, consulta: consulta1};  
      this.gestionBD.escribirBD(camposcab).subscribe((data: any) =>{
        this.estatus = false;
        this.datos.accion = -1;
        this.dialogRef.close(this.datos);
      });
    }
  
})
}

copiar() {
  this.idParo="0";
  this.modificador="";
  this.creador="";
  this.fcreacion="";
  this.fmodificacion="";
}

validar(){
  this.hayError1=false;
  this.hayError2=false;
  this.hayError3=false;
  this.hayError4=false;
  if (this.referencia =="" || !this.referencia)
    {this.hayError1 =true}
  if (this.desde =="" || !this.desde)
    {this.hayError2 =true;}
    if (this.hasta =="" || !this.hasta)
    {this.hayError3 =true;}
  if (!this.hayError1 && !this.hayError2)
  {
    let consulta1 = "";
    
    if (+this.desde >240000) {this.desde="235959"};
    if (+this.hasta >240000) {this.hasta="235959"};
    if (+this.desde <0) {this.desde="0"};
    if (+this.hasta <0) {this.hasta="0"};
    let ndesde = '' + this.desde 
    let nhasta = '' + this.hasta 

    ndesde = this.padLeft(ndesde, 6);
    nhasta = this.padLeft(nhasta, 6);
    if (+this.desde > +this.hasta) {this.cambio=true}; 
    ndesde = ndesde.substr(0,2) + ":" + ndesde.substr(2,2) + ":" + ndesde.substr(4,2)
    nhasta = nhasta.substr(0,2) + ":" + nhasta.substr(2,2) + ":" + nhasta.substr(4,2)
    let usuario = this.comunicacion.rUsuario().id;
    let fecha = this.comunicacion.convertirFecha(1,"","yyyy/MM/dd HH:mm:ss");
      if (this.idParo=="0") {
        consulta1 = "insert into turnos (referencia, inicia, termina, cambiodia, mover, estatus, creacion, modificacion, creado, modificado) VALUES ('" + this.referencia + "', '" + ndesde +  "', '" + nhasta + "', '" + (this.cambio ? "S" : "N") + "', '" + this.mover + "', 'A', '" + fecha + "', '" + fecha + "', " + usuario + ", " + usuario + ");";
      }
      else {
        consulta1 = "update turnos set estatus = '" + (this.estatus ? "A" : "I") + "', referencia = '" + this.referencia + "', inicia = '" + ndesde + "', termina = '" + nhasta + "', cambiodia = '" + (this.cambio ? "S" : "N") + "', mover = '" + this.mover + "', modificado = " + usuario + ", modificacion = '" + fecha + "' WHERE id = " + this.idParo;
      }
      let camposcab={accion: 50030, consulta: consulta1};  
      this.gestionBD.escribirBD(camposcab).subscribe((data2: any) =>{
            this.datos.accion = 1;
            this.dialogRef.close(this.datos);
      });
  }
}

padLeft(value, length) {
  return (value.toString().length < length) ? this.padLeft("0" + value, length) : 
  value;
}

ngOnInit() {
}

}

