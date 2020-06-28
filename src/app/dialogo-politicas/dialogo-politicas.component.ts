import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, } from '@angular/material';
import { ComunicacionService } from '../services/comunicacion.service';
import { FormControl, Validators } from '@angular/forms';
import { GestionApisService } from '../services/gestion-apis.service';
import { MatDialog } from '@angular/material';
import { DialogoComponent } from '../dialogo/dialogo.component';

@Component({
  selector: 'app-dialogo-politicas',
  templateUrl: './dialogo-politicas.component.html',
  styleUrls: ['./dialogo-politicas.component.css']
})
export class DialogoPoliticasComponent implements OnInit {


  titulo1 = new FormControl('', [Validators.required]);
  color1 = new FormControl('', [Validators.required]);
  imagen1 = new FormControl('', [Validators.required]);
  diasvencimiento1 =   new FormControl('', [Validators.required, Validators.min(0), Validators.max(999999)]);
  caducidad1 =   new FormControl('', [Validators.required, Validators.min(0), Validators.max(999999)]);
  aviso1 =   new FormControl('', [Validators.required, Validators.min(0), Validators.max(999999)]);
  usadas1 =   new FormControl('', [Validators.required, Validators.min(0), Validators.max(999999)]);
  largo1 =   new FormControl('', [Validators.required, Validators.min(0), Validators.max(999999)]);
  
  estatus: boolean = true;  
  estatusantes: string = "";  
  checked1: boolean = true;  
  checked2: boolean = true;  
  checked3: boolean = true;  
  checked4: boolean = true;  
  checked5: boolean = true;  
  checked6: boolean = true;  

  idParo: string = "";
  titulo: string = "";
  diasvencimiento: string = "0";
  caducidad: string = "0";
  aviso: string = "0";
  usadas: string = "0";
  largo: number = 0;
  colorhexa: string = "";
  complejidad: string = "";
  imagen: string = "./assets/icons/politicas.svg";
  modificador: string = "";
  creador: string = "";
  fcreacion: string = "";
  fmodificacion: string = "";

  hayError1: boolean = false;
  hayError2: boolean = false;

  constructor(public dialogRef: MatDialogRef<DialogoPoliticasComponent>, @Inject(MAT_DIALOG_DATA) public datos: any, public dialog: MatDialog, private comunicacion: ComunicacionService, private gestionBD: GestionApisService) { 
    this.idParo = '' + datos.id;
    if (datos.id > 0) 
    {
      let consulta1 = "SELECT politicas.*, a.nombre as tcreador, b.nombre as tmodificador FROM politicas LEFT JOIN usuarios AS a ON politicas.creado = a.id LEFT JOIN usuarios AS b ON politicas.modificado = b.id WHERE politicas.id = " + this.idParo;
      let camposcab={accion: 50100, consulta: consulta1};  
      this.gestionBD.consultasBD(camposcab).subscribe((data) =>{
        this.titulo = data.nombre;
        this.checked1 = data.deunsolouso=="S";
        this.checked2 = data.obligatoria=="S";
        this.checked3 = data.vence=="S";
        this.estatus = (data.estatus =="A" ? true : false);
        this.estatusantes = data.estatus;
        this.diasvencimiento = data.diasvencimiento
        this.caducidad = data.caducidad;
        this.aviso = data.aviso;
        this.complejidad = data.complejidad;
        this.largo = Number(this.complejidad.substr(0,2));
        this.checked4 = this.complejidad.substr(2,1)=="S";
        this.checked5 = this.complejidad.substr(3,1)=="S";
        this.checked6 = this.complejidad.substr(4,1)=="S";
        this.usadas = data.usadas;
        
        this.colorhexa = data.colorhexa;
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
    width: '570px', height: '270px', data: { botones: 2, cabecera: 'INACTIVAR POLÍTICA', contenido: 'Esta acción inactivará esta política y no estará disponible en el sistema. ¿Está seguro de esta acción?', boton1: 'Si, la inactivaré', boton2: 'No, lo pensaré mejor', tipoMensaje: 'NORMAL' }
  });
  dialogRef.afterClosed().subscribe(result => {
    if (!result)
    {
    }
    else if (result == 1)
    {
      let consulta1 = "update politicas set estatus = 'I' WHERE id = " + this.idParo;
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
  this.creador="";
  this.fcreacion="";
  this.fmodificacion="";
}

validar(){
  this.hayError1=false;
  this.hayError2=false;
  if  (!this.largo) {this.largo=0};
  if  (!this.diasvencimiento) {this.diasvencimiento="0"};
  if  (!this.aviso) {this.aviso="0"};
  if  (!this.caducidad) {this.caducidad="0"};
  if  (!this.usadas) {this.usadas="0"};
  if (this.titulo =="" || !this.titulo)
    {this.hayError1 =true}
  {
    if (!this.colorhexa) {this.colorhexa="white"};
    let consulta0 = "";
    let consulta1 = "SELECT max(id) as maxid from politicas";
      let camposcab={accion: 50100, consulta: consulta1};  
      this.gestionBD.consultasBD(camposcab).subscribe((data) =>{
      let usuario = this.comunicacion.rUsuario().id;
      let miLargo = "00";
      if (this.largo < 10) 
      {miLargo = "0" + this.largo}
      else
      {miLargo = "" + this.largo}
      let complejidad = miLargo + (this.checked4 ? "S" : "N") + (this.checked5 ? "S" : "N") + (this.checked6 ? "S" : "N") 
      let fecha = this.comunicacion.convertirFecha(1,"","yyyy/MM/dd HH:mm:ss");
      let tiporeg: boolean = true;
      if (this.idParo=="0") {
        consulta1 = "insert into politicas (nombre, imagen, colorhexa, deunsolouso, obligatoria, vence, diasvencimiento, caducidad, aviso, complejidad, usadas, estatus, creacion, modificacion, creado, modificado) VALUES ('" + this.titulo + "', '" + this.imagen + "', '" + this.colorhexa + "', '" + (this.checked1 ? "S" : "N") + "', '" + (this.checked2 ? "S" : "N") + "', '" + (this.checked3 ? "S" : "N") + "', " + this.diasvencimiento + ", " + this.caducidad + ", " + this.aviso + ", '" + complejidad + "', " + this.usadas + ", 'A', '" + fecha + "', '" + fecha + "', " + usuario + ", " + usuario + ");"
      }
      else {
        consulta1 = "update politicas set estatus = '" + (this.estatus ? "A" : "I") + "', nombre = '" + this.titulo + "', deunsolouso = '" + (this.checked1 ? "S" : "N") + "', obligatoria = '" + (this.checked2 ? "S" : "N") + "', vence = '" + (this.checked3 ? "S" : "N") + "', diasvencimiento = " + this.diasvencimiento + ", caducidad = " + this.caducidad + ", aviso = " + this.aviso + ", complejidad = '" + complejidad + "', usadas = " + this.usadas + ", colorhexa = '" + this.colorhexa + "', imagen = '" + this.imagen + "', modificado = " + usuario + ", modificacion = '" + fecha + "' WHERE id = " + this.idParo;
        tiporeg = false;
      }
      camposcab={accion: 50030, consulta: consulta1};  
      this.gestionBD.escribirBD(camposcab).subscribe((data2: any) =>{
        this.dialogRef.close(this.datos);
      });
    });
  }
}

ngOnInit() {
}

}

