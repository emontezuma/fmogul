import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { ComunicacionService } from '../services/comunicacion.service';
import { GestionApisService } from '../services/gestion-apis.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { DialogoComponent } from '../dialogo/dialogo.component';

@Component({
  selector: 'app-dialogo-generales',
  templateUrl: './dialogo-generales.component.html',
  styleUrls: ['./dialogo-generales.component.css']
})
export class DialogoGeneralesComponent implements OnInit {

   
  nparoSel = new FormControl('', [Validators.required]);
  tiempoParo1 =   new FormControl('', [Validators.required, Validators.min(0), Validators.max(999999)]);
  columnas: string[] = [];
  
  
  
  prefijo1 = new FormControl('', [Validators.required]);
  nombre1 = new FormControl('', [Validators.required]);
  referencia1 = new FormControl('', [Validators.required]);
  color1 = new FormControl('', [Validators.required]);
  imagen1 = new FormControl('', [Validators.required]);
  estatusantes: string = "I";
  estatus: boolean = true;  
  idParo: string = "";
  prefijo: string = "";
  nombre: string = "";
  referencia: string = "";
  secuencia: string = "";
  colorhexa: string = "";
  imagen: string = "./assets/icons/tablas.svg";
  modificador: string = "";
  creador: string = "";
  fcreacion: string = "";
  fmodificacion: string = "";

  hayError1: boolean = false;
  hayError2: boolean = false;
  hayError3: boolean = false;
  hayError4: boolean = false;

  
  estaCelula: string = "";
  maquinas: any = [];
  
  constructor(public dialogRef: MatDialogRef<DialogoGeneralesComponent>, @Inject(MAT_DIALOG_DATA) public datos: any, public dialog: MatDialog, private comunicacion: ComunicacionService, private gestionBD: GestionApisService) {
      let consulta2 = "SELECT * FROM tablas order by descripcion";
      let camposcab={accion: 50300, consulta: consulta2};  
      this.gestionBD.consultasBD(camposcab).subscribe((data: any []) =>{
        this.maquinas = data;
      });
      this.idParo = '' + datos.id;
      if (datos.id > 0)
      {
        let consulta1 = "SELECT generales.*, tablas.descripcion, a.nombre AS tcreador, b.nombre AS tmodificador FROM generales LEFT JOIN tablas on generales.tabla = tablas.tabla LEFT JOIN usuarios AS a ON generales.creado = a.id LEFT JOIN usuarios AS b ON generales.modificado = b.id  WHERE generales.id = " + this.idParo;
        let camposcab={accion: 50100, consulta: consulta1};  
        this.gestionBD.consultasBD(camposcab).subscribe((data) =>{
          this.nombre = data.nombre;
          this.prefijo = data.prefijo;
          this.estatus = (data.estatus =="A" ? true : false);
          this.estatusantes = data.estatus;
          this.referencia = data.referencia;
          this.colorhexa = data.colorhexa;
          this.referencia = data.referencia;
          this.imagen = data.imagen;
          this.modificador = data.tmodificador;
          this.creador = data.tcreador;
          this.fcreacion = this.comunicacion.convertirFecha(2,data.creacion,"dd-MM-yyyy hh:mm a");
          this.fmodificacion = this.comunicacion.convertirFecha(2,data.modificacion,"dd-MM-yyyy hh:mm a");
          this.estaCelula = data.tabla;
      });
    }
  }

  cancelar(){
    this.datos.accion = 0;
    this.dialogRef.close(this.datos);
  }
  
  eliminar() {
    const dialogRef = this.dialog.open(DialogoComponent, {
      width: '570px', height: '270px', data: { botones: 2, cabecera: 'INACTIVAR REGISTRO GENERAL', contenido: 'Esta acción inactivará este registro general y no estará disponible en el sistema. ¿Está seguro de esta acción?', boton1: 'Si, la inactivaré', boton2: 'No, lo pensaré mejor', tipoMensaje: 'NORMAL' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result)
      {
      }
      else if (result == 1)
      {
        let consulta1 = "update generales set estatus = 'I' WHERE id = " + this.idParo;
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
  }
  
  validar(){
    this.hayError1=false;
    this.hayError2=false;
    this.hayError3=false;
    this.hayError4=false;
    if (this.nombre =="" || !this.nombre)
      {this.hayError1 =true}
    if (this.prefijo =="" || !this.prefijo)
      {this.hayError2 =true;}
      if (this.estaCelula =="" || !this.estaCelula)
      {this.hayError3 =true;}
    if (!this.hayError1 && !this.hayError2 && !this.hayError3 && !this.hayError4)
    {
      if (!this.colorhexa) {this.colorhexa="white"};
        let usuario = this.comunicacion.rUsuario().id;
        let consulta1 = ""; 
        let fecha = this.comunicacion.convertirFecha(1,"","yyyy/MM/dd HH:mm:ss");
        let tiporeg: boolean = true;
        if (this.idParo=="0") {
          consulta1 = "insert into generales (referencia, nombre, imagen, colorhexa, prefijo, estatus, creacion, modificacion, creado, modificado, tabla) VALUES ('" + this.referencia + "', '" + this.nombre +  "', '" + this.imagen + "', '" + this.colorhexa + "', '" + this.prefijo + "', 'A', '" + fecha + "', '" + fecha + "', " + usuario + ", " + usuario + ", " + this.estaCelula + ");"
        }
        else {
          consulta1 = "update generales set estatus = '" + (this.estatus ? "A" : "I") + "', nombre = '" + this.nombre + "', prefijo = '" + this.prefijo + "', referencia = '" + this.referencia + "', colorhexa = '" + this.colorhexa + "', imagen = '" + this.imagen + "', modificado = " + usuario + ", modificacion = '" + fecha + "', tabla = " + this.estaCelula + " WHERE id = " + this.idParo;
          tiporeg = false;
        }
        let camposcab={accion: 50030, consulta: consulta1};  
        this.gestionBD.escribirBD(camposcab).subscribe((data2: any) =>{
            this.datos.accion = 1;
            this.dialogRef.close(this.datos);
        });
    }
  }
  
  ngOnInit() {
  }
  
    prefijos() {
      this.prefijo = this.nombre.substring(0, 30);
    }
  
  }
  
  