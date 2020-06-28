import { Component, AfterContentInit } from '@angular/core';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';
import { ComunicacionService } from '../services/comunicacion.service';
import { LlamadasMmcallService } from '../services/llamadas-mmcall.service';
import { GestionApisService } from '../services/gestion-apis.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { DialogoLlamadaComponent } from '../dialogo-llamada/dialogo-llamada.component';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { DialogoCambioComponent } from '../dialogo-cambio/dialogo-cambio.component';
import { DialogoComponent } from '../dialogo/dialogo.component';

export interface reporte {
  accion: number;
  celula: number;
  maquina: number;
  area: number;
  falla: number;
  detalle: string;
  solicitante: number;
  modificado: string;
  requester: number;
  reporte: number;
  turno: number;
}

@Component({
  selector: 'app-llamada-reporte',
  templateUrl: './llamada-reporte.component.html',
  styleUrls: ['./llamada-reporte.component.css']
})


export class LlamadaReporteComponent implements AfterContentInit {

  pantallaModo = {
    xl: 7,
    lg: 6,
    md: 3,
    sm: 2,
    xs: 1,
  }

  botonChange: boolean = false;  

  data: any;
  reporte: reporte;   


  gridCols: number = 0;
  celula: any= {id: 0, nombre: '', imagen: '', color: '', elemento: 'CÉLULA'};
  maquina: any= {id: 0, nombre: '', imagen: '', color: '', elemento: 'MÁQUINA'};
  area: any= {id: 0, nombre: '', imagen: '', color: '', elemento: 'ÁREA'};
  falla: any= {id: 0, nombre: '', imagen: '', color: '', elemento: 'FALLA'};
  resultadoVal1: any;
  resultadoVal2: any;
  resultadoVal3: any = {accion: 0, parte: '', pager: '', detalle: ''};
  detalleCall: string = "";
  nombreMaquina: string = "";
  resultadoMMCall: string = "";

  constructor( private httpClient: HttpClient, public snackBar: MatSnackBar, public dialog: MatDialog, private router: Router, private comunicacion: ComunicacionService, private llamadaMMCall: LlamadasMmcallService, private gestionBD: GestionApisService, private observableMedia: ObservableMedia ) {
      let data: any = comunicacion.recuperarSeleccion(1);
      this.celula = {id: data.id, nombre: data.nombre, imagen: data.imagen, colorhexa: data.colorhexa, elemento: data.elemento};;
      data = comunicacion.recuperarSeleccion(2);
      this.maquina = {id: data.id, nombre: data.nombre, imagen: data.imagen, colorhexa: data.colorhexa, elemento: data.elemento};;
      data = comunicacion.recuperarSeleccion(3);
      this.area = {id: data.id, nombre: data.nombre, imagen: data.imagen, colorhexa: data.colorhexa, elemento: data.elemento};;
      data = comunicacion.recuperarSeleccion(4);
      this.falla = {id: data.id, nombre: data.nombre, imagen: data.imagen, colorhexa: data.colorhexa, elemento: data.elemento};;
      this.comunicacion.mostrarNota.emit("Revise los parámetros e inicie la solicitud");
      this.comunicacion.mostrarEstado.emit("");
  }

  ngAfterContentInit() {
    this.observableMedia.asObservable().subscribe((change: MediaChange) => {
      this.gridCols = this.pantallaModo[change.mqAlias];});

  }

  validarRelacionCall() {
    //Se valida que exista el requester asciado
    let consulta1 = "SELECT count(*) as trec from fallas where id = " + this.comunicacion.recuperarSeleccion(4).id + " and celula = " + this.comunicacion.recuperarSeleccion(1).id + " and area = " + this.comunicacion.recuperarSeleccion(3).id
    let camposcab={accion: 50100, consulta: consulta1};  
    this.gestionBD.consultasBD(camposcab).subscribe((data) =>{
    if (data.trec>0)
      {
        let campos: any = {accion: 1, maquina: this.maquina.id, area: this.area.id};
        this.gestionBD.consultasBD(campos).subscribe((data: any)=>{
        this.validarRequester(data)
        });
      }
      else
      {
        this.comunicacion.iconoDialogo("propioLlamadas");
        const dialogRef = this.dialog.open(DialogoComponent, {
          width: '570px', height: '270px', data: { botones: 1, cabecera: 'FALLA NO VÁLIDA', contenido: "La falla que intenta reportar no se corresponde con la Célula y el Área seleccionada. Por favor vuelva a seleccionar Célula y Área", boton1: 'Aceptar', tipoMensaje: 'ALARMA' }
        });
        dialogRef.afterClosed().subscribe(result => {});  
      }
    })
  }

enviarSMS() {
  const dialogRef = this.dialog.open(DialogoCambioComponent, {
    width: '570px', height: '570px', data: { accion: 0, parte: this.resultadoVal3.parte, detalle: this.resultadoVal3.detalle, pager: this.resultadoVal3.pager, maquina: this.maquina.id }
  });
  this.comunicacion.mostrarNota.emit("Especifique los datos del mensaje de SMED");
  dialogRef.afterClosed().subscribe(result => {
    
    if (!result) {
      this.toast('custom-class-red', 'El mensaje de SMED NO se generó', 3000 );
    }
    else if (result.accion ==0) {
      this.toast('custom-class-red', 'El mensaje de SMED NO se generó', 3000 );
    }
    else if (!result.pager) {
      this.toast('custom-class-red', 'El mensaje de SMED NO se generó', 3000 );
      }
      else
      {
        if (result.pager.length>0){
          result.pager.forEach(pager => {
            let campos : any = {accion: 5, unipager: pager, parte: result.parte, detalle: result.detalle, celula: this.celula.id, maquina: this.maquina.id, area: this.area.id, falla: this.falla.id, solicitante: 1, modificado: this.comunicacion.convertirFecha(1,'', 'yyyy-MM-dd HH:mm:ss') }; 
            this.gestionBD.escribirBD(campos).subscribe((data: any)=>{console.log(data);});
            this.llamadaMMCall.llamadaMMCall(campos).subscribe((data)=>{this.SMS(data)});
          })
        //de prueba a producción
        //this.SMS("success");        
      }
      else
      {
        this.toast('custom-class-red', 'El mensaje de SMED NO se generó', 3000 );
      }
      
     
    }
    this.comunicacion.mostrarNota.emit("");
  });
}  

  validarRequester(midata: any) {
    if (midata==null){
      this.comunicacion.iconoDialogo("propioLlamadas");
      const dialogRef = this.dialog.open(DialogoComponent, {
        width: '570px', height: '300px', data: { botones: 1, cabecera: 'MAQUINA Y ÁREA NO RELACIONADAS', contenido: 'La máquina y el área seleccionadas no tienen un requester (reloj) asignado para enviarle una solicitud. Por favor informe de este incidente al administrador de la aplicación. Id de la máquina: ' + this.maquina.id + ' Id del área: ' + this.area.id, boton1: 'Aceptar', tipoMensaje: 'ALARMA' }
      });
      dialogRef.afterClosed().subscribe(result => {});
    }
    else {
      let campos: any = {accion: 2, requester: midata.code};
      this.gestionBD.consultasBD(campos).subscribe((data: any)=>{
        this.mostrarLlamada(data, {code: midata.code, name: midata.name})});
    }
  }

  mostrarLlamada(midata: any, miRequester: any){
    
    if (midata!=null){

      const dialogRef = this.dialog.open(DialogoComponent, {
        width: '570px', height: '280px', data: { botones: 1, cabecera: 'REQUESTER OCUPADO', contenido: "La máquina y el área seleccionadas (Requester de MMCall: " + miRequester.code + '-' + miRequester.name + ") tienen una solicitud en curso que no ha finalizado. El mensaje en curso es: '" + midata.message + "' y esta pendiente desde: " + midata.start_time, boton1: 'Aceptar', tipoMensaje: 'ALARMA' }
      });
      dialogRef.afterClosed().subscribe(result => {});
    }
    else {
      const dialogRef = this.dialog.open(DialogoLlamadaComponent, {
        disableClose: true, width: '570px', height: '420px', data: { accion: 0, detalle: this.detalleCall, requester: miRequester.code + ' ' + miRequester.name }
      });
      this.comunicacion.mostrarNota.emit("Detalle la falla que presenta y genera la solicitud");
      dialogRef.afterClosed().subscribe(result => {
        
        if (!result) {
          this.toast('custom-class-red', 'La solicitud NO se generó', 3000 );
        }
        else if (result.accion==0) {
          this.toast('custom-class-red', 'La solicitud NO se generó', 3000 );
          
        }
        else {
          this.detalleCall = result.detalle
          let campos: any = {accion: 1, requester: miRequester.code};
          this.llamadaMMCall.llamadaMMCall(campos). subscribe((data: any)=>{
            this.llamar(data, miRequester)});
          //de prueba a producción
          //this.llamar("success", miRequester)
        }
      });
    }
  }

  llamar(data: any, miRequester: any) {
    if (data!="success"){
      const dialogRef = this.dialog.open(DialogoComponent, {
        width: '570px', height: '280px', data: { botones: 1, cabecera: 'La solicitud NO se generó', contenido: "La solicitud no se pudo generar en MMCall, el mensaje obtenido de esta aplicación es: '" + data + "'. Pongase en contacto con el administrador de la aplicación", boton1: 'Aceptar', tipoMensaje: 'ALARMA' }
      });
      dialogRef.afterClosed().subscribe(result => {});
    }
    else
    {
      this.toast('custom-class', 'La solicitud se generó satisfactoriamente, por favor espere a la llegada del servicio', 3000 );
      //Se graba la llamada en el sistema
      //Se calcula la fecha, segun el turno
      let estaFecha = this.comunicacion.convertirFecha(1,'', 'yyyy-MM-dd')
      if (this.comunicacion.rTurno().mover =="S")
      {
        let date = new Date();
        date.setDate(date.getDate() + 1);

        estaFecha = this.comunicacion.convertirFecha(2, '' + new Date(date) , 'yyyy-MM-dd')
      }
      else if (this.comunicacion.rTurno().mover =="A")
      {
        let date = new Date();
        date.setDate(date.getDate() - 1);

        estaFecha = this.comunicacion.convertirFecha(2, '' + new Date(date) , 'yyyy-MM-dd')
      }
      
      let campos =  {accion: 1, celula: this.celula.id, maquina: this.maquina.id, area: this.area.id, falla: this.falla.id, detalle: this.detalleCall, solicitante: 1, requester: miRequester.code, modificado: this.comunicacion.convertirFecha(1,'', 'yyyy-MM-dd HH:mm:ss'), turno: this.comunicacion.rTurno().id, fecha_reporte: estaFecha };
      this.gestionBD.escribirBD(campos).subscribe((data: any)=>{
        this.regresar()});
    }
  }

  SMS(datos: any) {
    if (datos!="success"){
      const dialogRef = this.dialog.open(DialogoComponent, {
        width: '570px', height: '280px', data: { botones: 1, cabecera: 'EL MENSAJE NO SE ENVIÓ', contenido: "El mensaje no fue enviado al Pager seleccionado. El mensaje es el siguiente: '" + datos + "'. Pongase en contacto con el administrador de la aplicación", boton1: 'Aceptar', tipoMensaje: 'ALARMA' }
      });
      dialogRef.afterClosed().subscribe(result => {});
    }
    else
    {
      this.toast('custom-class', 'El mensaje fue enviado  satisfactoriamente, por favor espere a la llegada del servicio', 3000 );
      this.regresar();
    }
  }
 
  regresar() {
    let data  = {id: 0, nombre: '', imagen: '', color: '', elemento: ''}
    this.comunicacion.seleccionar(1, data);
    this.comunicacion.seleccionar(2, data);
    this.comunicacion.seleccionar(3, data);
    this.comunicacion.seleccionar(4, data);
    this.comunicacion.iraPagina.emit(0);
  }

  noFuncion() {
      
  }

  toast(clase: string, mensaje: string, duracion: number) {
    let config = new MatSnackBarConfig();
      config.panelClass = [clase];
      config.duration = duracion;
      config.verticalPosition='bottom';
      this.snackBar.open(mensaje, null, config);
  }  

}
