import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { ComunicacionService } from '../services/comunicacion.service';
import { GestionApisService } from '../services/gestion-apis.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { DialogoComponent } from '../dialogo/dialogo.component';


@Component({
  selector: 'app-dialogo-paros',
  templateUrl: './dialogo-paros.component.html',
  styleUrls: ['./dialogo-paros.component.css']
})

export class DialogoParosComponent implements OnInit {

 
  nparoSel = new FormControl('', [Validators.required]);
  tiempoParo1 =   new FormControl('', [Validators.required, Validators.min(0), Validators.max(999999)]);
  columnas: string[] = [];
  
  
  estaFecha: any;
  esteTipo: string = "";
  checked: boolean = true;
  hayError1: boolean = true;
  hayError2: boolean = true;
  hayError3: boolean = true;
  estaMaquina: string = "";
  esteParo: string = "";
  tiempoParo: string = "";
  maquinas: any = [];
  tiempoParoH: string = "0hr";
  nParos: any = [];
  idParo: string = "";
  
  
  constructor(public dialogRef: MatDialogRef<DialogoParosComponent>, @Inject(MAT_DIALOG_DATA) public datos: any, public dialog: MatDialog, private comunicacion: ComunicacionService, private gestionBD: GestionApisService) {
      let consulta2 = "SELECT id, prefijo FROM maquinas WHERE estatus = 'A'";
      let camposcab={accion: 50300, consulta: consulta2};  
      this.gestionBD.consultasBD(camposcab).subscribe((data: any []) =>{
        this.maquinas = data;
      });
      consulta2 = "SELECT id, prefijo FROM generales WHERE tabla = 200 and estatus = 'A'";
      camposcab={accion: 50300, consulta: consulta2};  
      this.gestionBD.consultasBD(camposcab).subscribe((data: any []) =>{
        this.nParos = data;
      });
      this.idParo = '' + datos.id;
      if (datos.id == 0) {
        this.estaFecha = new Date();
        this.esteTipo = "0";
      }
      else
      {
        let consulta1 = "SELECT * from detalleparos where id = " + this.idParo;
        let camposcab={accion: 50100, consulta: consulta1};  
        this.gestionBD.consultasBD(camposcab).subscribe((data) =>{
          this.tiempoParo = data.tiempo;
          this.esteTipo = data.tipo;
          this.esteParo = data.paro;
          this.estaMaquina = data.maquina;
          let tmpFecha = new Date(data.fecha);
          tmpFecha.setDate(tmpFecha.getDate() + 1);
          this.estaFecha = new Date(tmpFecha)
          this.checked = (data.contabilizar == "S" ? true : false);
          this.tiempoParoH = (+this.tiempoParo / 3600).toFixed(2) + "hr";
      });
    }
  }

  cancelar(){
    this.datos.accion = 0;
    this.dialogRef.close(this.datos);
  }

  eliminar() {
    const dialogRef = this.dialog.open(DialogoComponent, {
      width: '570px', height: '270px', data: { botones: 2, cabecera: 'ELIMINAR PARO', contenido: 'Esta acción eliminará este paro de la base de datos. ¿Está seguro de esta acción?.', boton1: 'Si, lo eliminaré', boton2: 'No, lo pensaré mejor', tipoMensaje: 'NORMAL' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result)
      {
      }
      else if (result == 1)
      {
        let consulta1 = "delete from detalleparos WHERE id = " + this.idParo;
        let camposcab={accion: 50030, consulta: consulta1};  
        this.gestionBD.escribirBD(camposcab).subscribe((data: any) =>{
          this.datos.accion = -1;
          this.dialogRef.close(this.datos);
        });
      }
    
  })
}

  validar(){
    this.hayError1=false;
    this.hayError2=false;
    this.hayError3=false;
    if (this.esteParo =="" || !this.esteParo)
      {this.hayError1 =true;}
    if (this.tiempoParo =="" || !this.tiempoParo)
    {this.hayError2 =true;}
    if (this.estaMaquina =="" || !this.estaMaquina)
    {this.hayError3 =true;}
    if (!this.hayError1 && !this.hayError2 && !this.hayError3)
    {

    let consulta1 = "SELECT * from detalleparos where id = " + this.idParo;
        let camposcab={accion: 50100, consulta: consulta1};  
        this.gestionBD.consultasBD(camposcab).subscribe((data) =>{
        if (!this.tiempoParo) {this.tiempoParo="0"}
        if (!data) {
          consulta1 = "insert into detalleparos (paro, tipo, maquina, fecha, tiempo, contabilizar) VALUES (" + this.esteParo + ", " + this.esteTipo + ", " + this.estaMaquina + ", '" + this.comunicacion.convertirFecha(2, this.estaFecha, "yyyy/MM/dd") + "', " + this.tiempoParo + ", '" + (this.checked ? "S" : "N") + "');";
        }
        else {
          consulta1 = "update detalleparos set paro = " + this.esteParo + ", tipo = " + this.esteTipo + ", maquina = " + this.estaMaquina  + ", fecha = '" + this.comunicacion.convertirFecha(2, this.estaFecha, "yyyy/MM/dd") + "', tiempo = " + this.tiempoParo + ", contabilizar = '" + (this.checked ? "S" : "N") + "' WHERE id = " + this.idParo;
        }
          camposcab={accion: 50030, consulta: consulta1};  
        this.gestionBD.escribirBD(camposcab).subscribe((data: any) =>{
          this.datos.accion = 1;
          this.dialogRef.close(this.datos);
        });
      });
    }
  }

  convertir() {
    this.tiempoParoH = (+this.tiempoParo / 3600).toFixed(2) + "hr";
  }

  ngOnInit() {
  }

}
