import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, } from '@angular/material';
import { ComunicacionService } from '../services/comunicacion.service';
import { FormControl, Validators } from '@angular/forms';
import { GestionApisService } from '../services/gestion-apis.service';
import { MatDialog } from '@angular/material';
import { DialogoComponent } from '../dialogo/dialogo.component';

@Component({
  selector: 'app-dialogo-celulas',
  templateUrl: './dialogo-celulas.component.html',
  styleUrls: ['./dialogo-celulas.component.css']
})
export class DialogoCelulasComponent implements OnInit {

  prefijo1 = new FormControl('', [Validators.required]);
  nombre1 = new FormControl('', [Validators.required]);
  referencia1 = new FormControl('', [Validators.required]);
  color1 = new FormControl('', [Validators.required]);
  imagen1 = new FormControl('', [Validators.required]);
  secuencia1 =   new FormControl('', [Validators.required, Validators.min(0), Validators.max(999999)]);
  secuenciaantes: string = "0";
  estatusantes: string = "I";
  estatus: boolean = true;  
  idParo: string = "";
  prefijo: string = "";
  nombre: string = "";
  referencia: string = "";
  secuencia: string = "";
  colorhexa: string = "";
  imagen: string = "./assets/icons/produccion.svg";
  modificador: string = "";
  creador: string = "";
  fcreacion: string = "";
  fmodificacion: string = "";

  hayError1: boolean = false;
  hayError2: boolean = false;
  hayError3: boolean = false;
  hayError4: boolean = false;

  constructor(public dialogRef: MatDialogRef<DialogoCelulasComponent>, @Inject(MAT_DIALOG_DATA) public datos: any, public dialog: MatDialog, private comunicacion: ComunicacionService, private gestionBD: GestionApisService) {
    this.idParo = '' + datos.id;
    if (datos.id > 0) 
    {
      let consulta1 = "SELECT celulas.*, a.nombre as tcreador, b.nombre as tmodificador FROM celulas LEFT JOIN usuarios AS a ON celulas.creado = a.id LEFT JOIN usuarios AS b ON celulas.modificado = b.id WHERE celulas.id = " + this.idParo;
      let camposcab={accion: 50100, consulta: consulta1};  
      this.gestionBD.consultasBD(camposcab).subscribe((data) =>{
        this.nombre = data.nombre;
        this.prefijo = data.prefijo;
        this.estatus = (data.estatus =="A" ? true : false);
        this.estatusantes = data.estatus;
        this.referencia = data.referencia;
        this.colorhexa = data.colorhexa;
        this.referencia = data.referencia;
        this.secuencia = data.secuencia;
        this.secuenciaantes=this.secuencia;
        this.imagen = data.imagen;
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
    width: '570px', height: '270px', data: { botones: 2, cabecera: 'INACTIVAR CÉLULA', contenido: 'Esta acción inactivará esta célula y no estará disponible en el sistema. ¿Está seguro de esta acción?', boton1: 'Si, la inactivaré', boton2: 'No, lo pensaré mejor', tipoMensaje: 'NORMAL' }
  });
  dialogRef.afterClosed().subscribe(result => {
    if (!result)
    {
    }
    else if (result == 1)
    {
      let consulta1 = "update celulas set estatus = 'I' WHERE id = " + this.idParo;
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
  this.secuencia="0";
  this.modificador="";
  this.creador="";
  this.fcreacion="";
  this.fmodificacion="";
  this.secuenciaantes ="0";
}

validar(){
  this.hayError1=false;
  this.hayError2=false;
  if (this.nombre =="" || !this.nombre)
    {this.hayError1 =true}
  if (this.prefijo =="" || !this.prefijo)
    {this.hayError2 =true;}
  if (!this.hayError1 && !this.hayError2)
  {
    if (!this.colorhexa) {this.colorhexa="white"};
    let consulta0 = "";
    let consulta1 = "SELECT max(secuencia) as maxid from celulas";
      let camposcab={accion: 50100, consulta: consulta1};  
      this.gestionBD.consultasBD(camposcab).subscribe((data) =>{
      let usuario = this.comunicacion.rUsuario().id;

      let fecha = this.comunicacion.convertirFecha(1,"","yyyy/MM/dd HH:mm:ss");
      let tiporeg: boolean = true;
      if (this.idParo=="0") {
        consulta1 = "insert into celulas (secuencia, referencia, nombre, imagen, colorhexa, prefijo, estatus, creacion, modificacion, creado, modificado) VALUES (" + (+data.maxid + 1) + ", '" + this.referencia + "', '" + this.nombre +  "', '" + this.imagen + "', '" + this.colorhexa + "', '" + this.prefijo + "', 'A', '" + fecha + "', '" + fecha + "', " + usuario + ", " + usuario + ");"
      }
      else {
        consulta1 = "update celulas set estatus = '" + (this.estatus ? "A" : "I") + "', nombre = '" + this.nombre + "', prefijo = '" + this.prefijo + "', referencia = '" + this.referencia + "', colorhexa = '" + this.colorhexa + "', imagen = '" + this.imagen + "', modificado = " + usuario + ", modificacion = '" + fecha + "' WHERE id = " + this.idParo;
        tiporeg = false;
      }
      camposcab={accion: 50030, consulta: consulta1};  
      this.gestionBD.escribirBD(camposcab).subscribe((data2: any) =>{
          if (!tiporeg && this.secuencia != this.secuenciaantes && this.secuencia!="0") 
          {
            if (+this.secuencia>+data.maxid) {
              consulta1 = "update celulas set secuencia = " + data.maxid + " WHERE id = " + this.idParo;
              consulta0 = "update celulas set secuencia = secuencia - 1  WHERE secuencia <= " + this.secuencia + " and secuencia > " + this.secuenciaantes + " AND id <> " + this.idParo;  
            }
            else
            {
              if (+this.secuencia > +this.secuenciaantes)
              {
                consulta0 = "update celulas set secuencia = secuencia - 1  WHERE secuencia <= " + this.secuencia + " and secuencia > " + this.secuenciaantes + " AND id <> " + this.idParo;  
              }
              else
              {
                consulta0 = "update celulas set secuencia = secuencia + 1  WHERE secuencia >= " + this.secuencia + " and secuencia < " + this.secuenciaantes  + " AND id <> " + this.idParo;
              }
              consulta1 = "update celulas set secuencia = " + this.secuencia + " WHERE id = " + this.idParo;
            }
            camposcab={accion: 50030, consulta: consulta1};  
              this.gestionBD.escribirBD(camposcab).subscribe((data: any) =>{
                if (consulta0.length>0)
                {
                  camposcab={accion: 50030, consulta: consulta0};  
                  this.gestionBD.escribirBD(camposcab).subscribe((data: any) =>{
                    this.datos.accion = 1;
                    this.dialogRef.close(this.datos);
                  })      
                }
                else {
                  this.datos.accion = 1;
                  this.dialogRef.close(this.datos);      
                }
              })
            
          }
          else
          {
            this.datos.accion = 1;
            this.dialogRef.close(this.datos);
          }
      });
    });
  }
}

ngOnInit() {
}

  prefijos() {
    this.prefijo = this.nombre.substring(0, 30);
  }

}

