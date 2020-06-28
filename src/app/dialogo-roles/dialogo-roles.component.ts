import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, } from '@angular/material';
import { ComunicacionService } from '../services/comunicacion.service';
import { FormControl, Validators } from '@angular/forms';
import { GestionApisService } from '../services/gestion-apis.service';
import { MatDialog } from '@angular/material';
import { DialogoComponent } from '../dialogo/dialogo.component';

@Component({
  selector: 'app-dialogo-roles',
  templateUrl: './dialogo-roles.component.html',
  styleUrls: ['./dialogo-roles.component.css']
})
export class DialogoRolesComponent implements OnInit {

  titulo1 = new FormControl('', [Validators.required]);
  
  estatus: boolean = true;  
  checked1: boolean = true;  
  checked2: boolean = true;  
  checked3: boolean = true;  
  checked4: boolean = true;  
  checked5: boolean = true;  
  checked6: boolean = true;  
  checked7: boolean = true;  
  checked8: boolean = true;  
  checked9: boolean = true;  
  checked10: boolean = true;  
  checked11: boolean = true;  
  checked12: boolean = true;  
  checked13: boolean = true;  
  checked14: boolean = true;  
  checked15: boolean = true;  
  checked16: boolean = true;  
  checked17: boolean = true;  
  checked18: boolean = true;  
  checked19: boolean = true;  
  checked20: boolean = true;  
  checked21: boolean = true;  
  checked22: boolean = true;  
  checked23: boolean = true;  
  checked24: boolean = true;  
  checked25: boolean = true;  
  checked26: boolean = true;  
  checked27: boolean = true;  
  checked28: boolean = true;  
  checked29: boolean = true;  
  checked30: boolean = true;  

  idParo: string = "";
  titulo: string = "";
  modificador: string = "";
  creador: string = "";
  fcreacion: string = "";
  fmodificacion: string = "";
  estatusantes: string = "I";
  hayError1: boolean = false;
  hayError2: boolean = false;

  constructor(public dialogRef: MatDialogRef<DialogoRolesComponent>, @Inject(MAT_DIALOG_DATA) public datos: any, public dialog: MatDialog, private comunicacion: ComunicacionService, private gestionBD: GestionApisService) { 
    this.idParo = '' + datos.id;
    if (datos.id > 0) 
    {
      let consulta1 = "SELECT permisos.*, a.nombre as tcreador, b.nombre as tmodificador FROM permisos LEFT JOIN usuarios AS a ON permisos.creado = a.id LEFT JOIN usuarios AS b ON permisos.modificado = b.id WHERE permisos.id = " + this.idParo;
      let camposcab={accion: 50100, consulta: consulta1};  
      this.gestionBD.consultasBD(camposcab).subscribe((data) =>{
        if (!data.catalogos){data.catalogos="NNNNNNNNNNNN"}
        if (!data.reportes){data.reportes="NNNNNNNNNNNN"}
        if (!data.configuracion){data.configuracion="NNNNNNNNNNNN"}
        this.titulo = data.nombre;
        this.estatus = (data.estatus =="A" ? true : false);
        this.estatusantes = data.estatus;
        this.checked1 = data.administrador=="S";
        this.checked2 = data.llamada=="S";
        this.checked3 = data.atencion=="S";
        this.checked4 = data.smed=="S";
        this.checked5 = data.panel=="S";
        this.checked6 = data.graficas=="S";
        this.checked7 = data.catalogos.substr(0,1)=="S";
        this.checked8 = data.catalogos.substr(1,1)=="S";
        this.checked9 = data.catalogos.substr(2,1)=="S";
        this.checked10 = data.catalogos.substr(3,1)=="S";
        this.checked11 = data.catalogos.substr(4,1)=="S";
        this.checked12 = data.catalogos.substr(5,1)=="S";
        this.checked13 = data.catalogos.substr(6,1)=="S";
        this.checked14 = data.catalogos.substr(7,1)=="S";
        this.checked15 = data.catalogos.substr(8,1)=="S";
        this.checked16 = data.configuracion.substr(0,1)=="S";
        this.checked17 = data.configuracion.substr(1,1)=="S";
        this.checked18 = data.configuracion.substr(2,1)=="S";
        this.checked19 = data.configuracion.substr(3,1)=="S";
        this.checked20 = data.configuracion.substr(4,1)=="S";
        this.checked21 = data.reportes.substr(0,1)=="S";
        this.checked22 = data.configuracion.substr(5,1)=="S";
        this.checked23 = data.configuracion.substr(6,1)=="S";
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
    width: '570px', height: '270px', data: { botones: 2, cabecera: 'INACTIVAR ROL', contenido: 'Esta acción inactivará este rol y no estará disponible en el sistema. ¿Está seguro de esta acción?', boton1: 'Si, la inactivaré', boton2: 'No, lo pensaré mejor', tipoMensaje: 'NORMAL' }
  });
  dialogRef.afterClosed().subscribe(result => {
    if (!result)
    {
    }
    else if (result == 1)
    {
      let consulta1 = "update permisos set estatus = 'I' WHERE id = " + this.idParo;
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
  if (!this.titulo)  
  {this.hayError1 =true}
  else
  {
    let consulta0 = "";
    let consulta1 = "SELECT max(id) as maxid from permisos";
      let camposcab={accion: 50100, consulta: consulta1};  
      this.gestionBD.consultasBD(camposcab).subscribe((data) =>{
      let usuario = this.comunicacion.rUsuario().id;
      let fecha = this.comunicacion.convertirFecha(1,"","yyyy/MM/dd HH:mm:ss");
      let cadCatalogos: string = "";
      let cadReportes: string = "";
      let cadConfiguracion: string = "";
      cadCatalogos = (this.checked7 ? "S" : "N") + (this.checked8 ? "S" : "N") + (this.checked9 ? "S" : "N") + (this.checked10 ? "S" : "N") + (this.checked11 ? "S" : "N") + (this.checked12 ? "S" : "N") + (this.checked13 ? "S" : "N") + (this.checked14 ? "S" : "N") + (this.checked15 ? "S" : "N") 
      cadConfiguracion = (this.checked16 ? "S" : "N") + (this.checked17 ? "S" : "N") + (this.checked18 ? "S" : "N") + (this.checked19 ? "S" : "N") + (this.checked20 ? "S" : "N") + (this.checked22 ? "S" : "N") + (this.checked23 ? "S" : "N")
      cadReportes = (this.checked21 ? "S" : "N")
      
      if (this.idParo=="0") {
        consulta1 = "insert into permisos (nombre, llamada, atencion, smed, panel, graficas, catalogos, reportes, configuracion, estatus, creacion, modificacion, creado, modificado) VALUES ('" + this.titulo + "', '" +  (this.checked2 ? "S" : "N") + "', '" + (this.checked3 ? "S" : "N") + "', '" + (this.checked4 ? "S" : "N") + "', '" + (this.checked5 ? "S" : "N") + "', '" + (this.checked6 ? "S" : "N") + "', '" +  cadCatalogos + "', '" + cadReportes + "', '" + cadConfiguracion + "', 'A', '" + fecha + "', '" + fecha + "', " + usuario + ", " + usuario + ");"
      }
      else {
        consulta1 = "update permisos set estatus = '" + (this.estatus ? "A" : "I") + "', nombre = '" + this.titulo + "', llamada = '" + (this.checked2 ? "S" : "N") + "', atencion = '" + (this.checked3 ? "S" : "N") + "', smed = '" + (this.checked4 ? "S" : "N") + "', panel = '" + (this.checked5 ? "S" : "N") + "', graficas = '" + (this.checked6 ? "S" : "N") + "', catalogos = '" + cadCatalogos + "', reportes = '" + cadReportes + "', configuracion = '" + cadConfiguracion + "', modificado = " + usuario + ", modificacion = '" + fecha + "' WHERE id = " + this.idParo;
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

