import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { ComunicacionService } from '../services/comunicacion.service';
import { GestionApisService } from '../services/gestion-apis.service';
import { DialogoComponent } from '../dialogo/dialogo.component';

@Component({
  selector: 'app-dialogo-cancelar',
  templateUrl: './dialogo-cancelar.component.html',
  styleUrls: ['./dialogo-cancelar.component.css']
})
export class DialogoCancelarComponent implements OnInit {

  @ViewChild("txtBuscar") miEemento: ElementRef;

  miBoton: boolean = true;
  nombre: number = 0; 
  fecha: string = ""; 
  fechaS: string = ""; 
  area: string = "";
  celula: string = "";
  fallaD: string = "";
  fallaC: string = "";
  fallaA: string = "";
  falla: string = ""; 
  maquina: string = ""; 
  tiempo: string = "";
  tiempoR: string = "";
  user1: string = "";
  user2: string = "";
  user3: string = "";
  ultimo: string = "";
  estatus: boolean = false;

  constructor(public dialogRef: MatDialogRef<DialogoCancelarComponent>, @Inject(MAT_DIALOG_DATA) public datos: any, public dialog: MatDialog, private comunicacion: ComunicacionService, private gestionBD: GestionApisService) { }

  ngOnInit() {
  }

  inactivar() 
  {
    this.miBoton=true;
    this.fecha = ""; 
    this.celula = ""; 
    this.area = "";
    this.falla = ""; 
    this.fallaD = "";
    this.fallaC = ""; 
    this.maquina = ""; 
    this.tiempo = "";
    this.tiempoR = "";
    this.user1 = "";
    this.user2 = "";
    this.user3 = "";
    this.miBoton=true;
  }

  cancelar()
  {
    this.datos.accion = 0;
  this.dialogRef.close(this.datos);
  }

  buscar()
  {

    let consulta1 = "SELECT fecha_reporte, fecha, comentarios, tiempototal, tiempoatencion, contabilizar, detalle, areas.prefijo as narea, celulas.prefijo as ncelula, fallas.prefijo as nfalla, fallas2.prefijo as nfalla2, maquinas.prefijo as nmaquina, u1.nombre as user1, u2.nombre as user2, u3.nombre as user3 FROM reportes LEFT JOIN celulas on reportes.celula = celulas.id LEFT JOIN areas on reportes.area = areas.id LEFT JOIN fallas on reportes.falla_ajustada = fallas.id LEFT JOIN fallas as fallas2 on reportes.falla = fallas2.id LEFT JOIN usuarios as u1 on reportes.solicitante = u1.id LEFT JOIN usuarios as u2 on reportes.tecnico = u2.id LEFT JOIN usuarios as u3 on reportes.tecnicoatend = u3.id LEFT JOIN maquinas on reportes.maquina = maquinas.id WHERE reportes.estatus = 1000 and reportes.id = " + this.nombre
     console.log(consulta1);
      let camposcab={accion: 50100, consulta: consulta1};  
      this.gestionBD.consultasBD(camposcab).subscribe((data) =>{
        this.fecha = ""; 
        this.fechaS = ""; 
        this.area = "";
        this.falla = ""; 
        this.fallaD = ""; 
        this.fallaC = ""; 
        this.fallaA = ""; 
        this.maquina = ""; 
        this.celula = ""; 
        this.tiempo = "";
        this.tiempoR = "";
        this.user1 = "";
        this.user2 = "";
        this.user3 = "";
        this.miBoton=true;
        if (!data)
        {
          const dialogRef = this.dialog.open(DialogoComponent, {
            width: '470px', height: '240px', data: { botones: 1, cabecera: 'REPORTE NO ENCONTRADO', contenido: 'El reporte seleccionado no existe o no se ha cerrado', boton1: 'Aceptar', tipoMensaje: 'ALARMA' }
          });
          dialogRef.afterClosed().subscribe(result => {
            setTimeout(() => {
              this.miEemento.nativeElement.focus();
            }, 100);
        });
        }
        else
        {
          this.fecha = this.comunicacion.convertirFecha(2,data.fecha_reporte,"dd-MMM-yyyy");
          this.fechaS = this.comunicacion.convertirFecha(2,data.fecha,"dd-MMM-yyyy HH:mm:ss");
          this.area = data.narea;
          this.falla = data.nfalla2; 
          this.fallaA = data.nfalla; 
          this.fallaD = data.detalle; 
          this.fallaC = data.comentarios; 
          this.estatus = data.contabilizar=="S" ? true : false; 
          this.maquina = data.nmaquina; 
          this.celula = data.ncelula; 
          let horas = Math.floor(+data.tiempototal / 3600);
          let minutos = Math.floor((+data.tiempototal % 3600) / 60);
          let segundos = +data.tiempototal % 60 ; 
          let strhoras="";
          let strminutos="";
          let strsegundos="";
          if (horas > 0)
          {
            strhoras = horas + 'h ';
          }
          if (minutos > 0) 
            { 
              strminutos = minutos + 'm ';
            }
          if (segundos > 0) 
            { 
              strsegundos = segundos + 's ';
            } 
            this.tiempo =  strhoras + strminutos + strsegundos;

            horas = Math.floor(+data.tiempoatencion / 3600);
          minutos = Math.floor((+data.tiempoatencion % 3600) / 60);
          segundos = +data.tiempoatencion % 60 ; 
          strhoras="";
          strminutos="";
          strsegundos="";
          if (horas > 0)
          {
            strhoras = horas + 'h ';
          }
          if (minutos > 0) 
            { 
              strminutos = minutos + 'm ';
            }
          if (segundos > 0) 
            { 
              strsegundos = segundos + 's ';
            } 
          this.tiempoR =  strhoras + strminutos + strsegundos;
          this.miBoton=false;   
          this.user1 = data.user1;
          this.user2 = data.user2;
          this.user3 = data.user3;
          setTimeout(() => {
            this.miEemento.nativeElement.focus();
          }, 100); 
        }
      });
  }

  aceptar()
  {
    let consulta1 = "update reportes set modificador = " + this.comunicacion.rUsuario().id + ", contabilizar = '" + (this.estatus ? "S" : "N") + "' WHERE id = " + this.nombre
    let camposcab={accion: 50030, consulta: consulta1};  
    this.gestionBD.escribirBD(camposcab).subscribe((data: any) =>{
      const dialogRef = this.dialog.open(DialogoComponent, {
        width: '470px', height: '240px', data: { botones: 1, cabecera: 'REPORTE MODIFICADO', contenido: 'El reporte se ha cambiado satisfactoriamente', boton1: 'Aceptar', tipoMensaje: 'NORMAL' }
        });
        dialogRef.afterClosed().subscribe(result => {
          let miNUmero = this.nombre;
          this.ultimo = "Último reporte cambiado: " + miNUmero
          this.nombre=0;
      
        this.fecha = ""; 
        this.fechaS = ""; 
        this.area = "";
        this.celula = "";
        this.falla = ""; 
        this.fallaD = ""; 
        this.fallaC = ""; 
        this.fallaA = ""; 
        this.maquina = ""; 
        this.tiempo = "";
        this.tiempoR = "";
        this.miBoton=true;
        
        setTimeout(() => {
          this.miEemento.nativeElement.focus();
        }, 100);
      });
      
    });
  }
          
}
