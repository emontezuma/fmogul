import { Component, AfterContentInit, ViewChild, OnInit } from '@angular/core';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';
import { ComunicacionService } from '../services/comunicacion.service';
import { Router } from '@angular/router';
import { LlamadasMmcallService } from '../services/llamadas-mmcall.service';
import { GestionApisService } from '../services/gestion-apis.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { DialogoComponent } from '../dialogo/dialogo.component';
import { DialogoCierreComponent } from '../dialogo-cierre/dialogo-cierre.component';
import { trigger, animate, style, transition } from "@angular/animations";
import { SolicitarTecnicoComponent } from '../solicitar-tecnico/solicitar-tecnico.component';
import { NuevaClaveComponent } from '../nueva-clave/nueva-clave.component';
import * as jsPDF from 'jspdf';

export interface updateReporte {
  accion: number;
  id: number,
  tecnico: number;
  fecha: string;
}

export interface reporte {
  animado: boolean,
  numero: number,
  alarmado: number,
  area: string,
  areanombre: string,
  areaprefijo: string,
  celula: number
  celulanombre: string,
  celulaprefijo: string,
  cierre_reporte: Date,
  comentarios: string,
  contabilizar: string,
  detalle: string,
  estatus: number;
  estatusPalabra: string;
  falla: number;
  falla_ajustada: number;
  fallanombre: string,
  fallaprefijo: string,
  fecha: string,
  fechaAtencion: string;
  id: number,
  requester: number,
  inicio_reporte: string,
  maquina: number,
  maquinanombre: string,
  modificado: string,
  modificador: string,
  record_id: number,
  solicitante: number,
  tecnico: number,
  tiempo: number,
  username: string,
  tecniconombre: string,
  tiempoLlamada: string,
  fallaprefijotecnico: string,
  fallanombretecnico: string,
  inicio_atencion: string,
  tipo: number,
}

@Component({
  selector: 'app-reporte-mapa2',
  templateUrl: './reporte-mapa2.component.html',
  styleUrls: ['./reporte-mapa2.component.css'],
  animations: [
    trigger('flyInOut', [
       transition('* => void', [
        style({ opacity: 1, transform: 'translateY(0px)' }),
        animate('0.6s ease-in-out', style({ opacity: 0, transform: 'translateY(30px)' }))
      ])
    ])
  ]
})
export class ReporteMapa2Component implements AfterContentInit {

  pantallaModo = {
    xl: 4,
    lg: 3,
    md: 2,
    sm: 1,
    xs: 1,
  }

  arrFiltrado: any = [];
  tecnico: number = 1;
  reporteSeleccionado: number = 0;
  reporteIndice: number = 0;
  gridCols: number = 0;
  reportes: reporte[];
  actualizacionReporte: updateReporte;
  updateReporte: reporte[];
  vieneArbol: boolean = false;
  sinRegistros: boolean = false;
  mensajeMaquinas: string = "No hay máquinas relacionadas"
  totalRegs: string = " llamadas";
  verLate: boolean = false;
  largoLate: string = "480px";
  requesterBuscado: string = "";
  fallaSeleccionada: number = 0;
  filtrarPor: string = "";
  constructor( private httpClient: HttpClient, public snackBar: MatSnackBar, public dialog: MatDialog, private router: Router, private comunicacion: ComunicacionService, private llamadaMMCall: LlamadasMmcallService, private gestionBD: GestionApisService, private observableMedia: ObservableMedia ) { 
    this.idCelula = this.comunicacion.recuperarSeleccion(1).id;
    this.idMaquina = this.comunicacion.recuperarSeleccion(2).id;
     this.comunicacion.mostrarNota.emit("Solicitudes por atender");
    this.llenarPantalla();
    this.comunicacion.aplicarFiltroxAtender.subscribe((data: string)=>{
      this.filtrarPor = data;
      //Aqui se filtra
      this.reportes = this.filtrarmiArreglo(); 
      this.contarRegs()});
      this.comunicacion.refrescarxAtender.subscribe((data: any)=>{this.llenarPantalla()});
    
  }

  filtrarmiArreglo() {

    if (!this.filtrarPor ) {
      return this.arrFiltrado;
    }
    else {
      return this.arrFiltrado.filter(datos =>
        datos.id.toLowerCase().indexOf(this.filtrarPor.toLowerCase()) !== -1
        ||
        datos.celulanombre.toLowerCase().indexOf(this.filtrarPor.toLowerCase()) !== -1
        ||
        datos.maquinanombre.toLowerCase().indexOf(this.filtrarPor.toLowerCase()) !== -1
        ||
        datos.areanombre.toLowerCase().indexOf(this.filtrarPor.toLowerCase()) !== -1
        ||
        datos.fallanombre.toLowerCase().indexOf(this.filtrarPor.toLowerCase()) !== -1
        ||
        datos.celulaprefijo.toLowerCase().indexOf(this.filtrarPor.toLowerCase()) !== -1
        ||
        datos.maquinaprefijo.toLowerCase().indexOf(this.filtrarPor.toLowerCase()) !== -1
        ||
        datos.areaprefijo.toLowerCase().indexOf(this.filtrarPor.toLowerCase()) !== -1
        ||
        datos.fallaprefijo.toLowerCase().indexOf(this.filtrarPor.toLowerCase()) !== -1
        ||
        
        datos.fallanombretecnico.toLowerCase().indexOf(this.filtrarPor.toLowerCase()) !== -1
        ||
        datos.fallaprefijotecnico.toLowerCase().indexOf(this.filtrarPor.toLowerCase()) !== -1
        ||
        datos.detalle.toLowerCase().indexOf(this.filtrarPor.toLowerCase()) !== -1);
        
}
  }

  
  llenarPantalla() {
    this.arrFiltrado=[];

    let campos={accion: 101, filtro: 'reportes.estatus = 0'};
    this.comunicacion.activarSpinner.emit(true);   
    this.gestionBD.consultasBD(campos).subscribe((data: reporte[])=>{
      let campos2={accion: 10000};
      this.gestionBD.consultasBD(campos2).subscribe((data2: any[])=>{
        data.forEach((eMaq) => {
          let hallado: number = -1;
          hallado=data2.findIndex(c => c.prefijo == eMaq.maquina)
          if (hallado > -1) {
            this.arrFiltrado.push(eMaq);      
          }
        })        
        this.reportes = this.arrFiltrado;
        this.publicarDatos()
      });
    });
  }

  ngAfterContentInit() {
    this.observableMedia.asObservable().subscribe((change: MediaChange) => {
         this.gridCols = this.pantallaModo[change.mqAlias];
    });
    this.comunicacion.llamadasVistaMapa.emit(1);
    //colocar luego de recuperar los datos...
  }

  idMaquina: number = 0;
  idCelula: number = 0;

  ElementoSeleccionado: number = 0;


  
  preferencias: any[] = [
    {verTope: 'S', verPie: 'N', pieVisible: 'S', menuAbierto: 'N', ultimaOpcion: '1', opcionDefecto: '1', vistaOperaciones: 'D', verCssAlerta: 'S'},
  ];

  botonLate(indice: number) {
    this.reporteSeleccionado = this.reportes[indice].id;
    this.reporteIndice = indice;
    this.comunicacion.iconoDialogo("propioConTecnicoAzul");
    const dialogRef = this.dialog.open(DialogoComponent, {
      width: '570px', height: '270px', data: { botones: 2, cabecera: 'ATENDER LA SOLICITUD', contenido: 'Esta acción cambiará el estatus de la solicitud seleccionada e iniciará el tiempo de atención/reparación. ¿Está seguro de atender esta llamada?.', boton1: 'Si, la atenderé', boton2: 'No, lo pensaré mejor', tipoMensaje: 'NORMAL' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result)
      {
        this.toast('custom-class-red', 'La solicitud no se atendió', 3000);
      }
      else if (result == 0)
      {
        this.toast('custom-class-red', 'La solicitud no se atendió', 3000);
      }
      else 
      {
        //Primero se busca el requester
        let campos={accion: 201, requester: this.reportes[indice].requester};
        this.requesterBuscado = '' + this.reportes[indice].requester;
        this.gestionBD.consultasBD(campos).subscribe((data: any)=>{
          this.paso1(data)});
      }
    });
  }

  paso1(datos: any) {
    //Se valida si se halla el requster en MMCall
    if (!datos)
    {
      this.comunicacion.iconoDialogo("propioConTecnicoAzul");
      const dialogRef = this.dialog.open(DialogoComponent, {
        width: '570px', height: '270px', data: { botones: 1, cabecera: 'ATENDER LA SOLICITUD', contenido: "No se pudo iniciar la atención de la solicitud '" + this.reporteSeleccionado + "' porque no se encontró el requester: '" + this.requesterBuscado + "'. Por favor informe de esta situación al administrador del sistema", boton1: 'Aceptar', tipoMensaje: 'ALARMA' }
      });
    dialogRef.afterClosed().subscribe(result => {});
    }
    else
    {
      //Se solicita el técnico
      this.validar(datos);
      

    }
  }

paso2(data: any) {
  //Se valida la respuesta de MMCall, sucess o no
  this.comunicacion.iconoDialogo("propioConTecnicoAzul");
    if (data!="success"){
      const dialogRef = this.dialog.open(DialogoComponent, {
        width: '570px', height: '270px', data: { botones: 1, cabecera: 'ATENDER LA SOLICITUD', contenido: "No se pudo iniciar la atención de la solicitud '" + this.reporteSeleccionado + "' porque MMCall envió un mensaje: '" + data + "'. Por favor informe de esta situación al administrador del sistema", boton1: 'Aceptar', tipoMensaje: 'ALARMA' }
      });
      dialogRef.afterClosed().subscribe(result => {});
    }
    else
    {
      this.paso3();
    }
}

paso3() {
  //Se modifica la llamada en fmogul
  this.tecnico = this.comunicacion.rTecnico().id;
  let campos: updateReporte = {accion: 3, id: this.reporteSeleccionado, tecnico: this.tecnico, fecha: this.comunicacion.convertirFecha(1,'', 'yyyy-MM-dd HH:mm:ss') };
  this.gestionBD.escribirBD(campos).subscribe((data: any)=>{this.paso4(2, data, 'La solicitud se ha cambiado al estatus de Atendida satisfactoriamente, iniciará el tiempo de atención/reparación')});
  }
 
  paso4(indice: number, data: any, mensaje: string) {
    //Finaliza el proceso y se quita la llamada de la pantalla
    if (indice == 1) {
      this.crearPDF();
    }
    this.toast('custom-class', mensaje, 3000);
    this.reportes[this.reporteIndice].animado = true;
    setTimeout(() => {
      this.reportes.splice(this.reporteIndice, 1);
      this.contarRegs()
    }, 500);
  }
  
  
  publicarDatos() {
    setTimeout(() => {
      this.comunicacion.activarSpinner.emit(false);   
    }, 500); 
    
    this.reportes.forEach(miReporte => {
      if (miReporte.estatus == 0)
      {
        miReporte.estatusPalabra = 'POR ATENDER';
      }
      else if (miReporte.estatus == 10)
      {
        miReporte.estatusPalabra = 'EN ATENCIÓN';
      }
      else if (miReporte.estatus == 100)
      {
        miReporte.estatusPalabra = 'CERRADA SIN REPORTE';
      }
      else if (miReporte.estatus == 1000)
      {
        miReporte.estatusPalabra = 'CERRADA CON REPORTE';
      }
      miReporte.fechaAtencion = this.comunicacion.convertirFecha(2, miReporte.fecha, 'dd/MMM/yyyy hh:mm:ss a')
    });
    this.cronometro();
    this.contarRegs();
    
  }


  cronometro() {
    this.reportes.forEach(miReporte => {
      let fechaIni = new Date(miReporte.fecha);
      let fechaFin = new Date();
      let diferencia = fechaFin.getTime() - fechaIni.getTime() 
      let minutos = 0;    
      let horas = 0;
      let segundos = Math.floor(diferencia / (1000));
      let strhoras = '';
      let strminutos = '';
      let strsegundos = '';
      horas = Math.floor(segundos / 3600);
      minutos = Math.floor((segundos % 3600) / 60);
      if (horas > 0)
      {
        strhoras = horas + ' hr ';
      }
      if (minutos > 0) 
        { strminutos = minutos + ' min ';
      }
      segundos = segundos % 60;
      if (segundos > 0) 
        { strsegundos = segundos + ' seg ';
      } 
      miReporte.tiempoLlamada = strhoras + strminutos + strsegundos;
      })
      setTimeout(() => {this.cronometro()}, 1000);
    }

    contarRegs() 
    {
      let filtrado="";
    if (this.reportes.length != this.arrFiltrado.length){
      filtrado=" (filtrado)";
    }
      this.sinRegistros = this.reportes.length == 0;
      if (this.reportes.length == 1) {
        this.totalRegs = " solicitud";      
        this.comunicacion.mostrarEstado.emit(this.reportes.length + this.totalRegs+filtrado);
      }
      else if (this.reportes.length > 0 ) {
        this.totalRegs = " solicitudes";      
        this.comunicacion.mostrarEstado.emit(this.reportes.length + this.totalRegs+filtrado);
      }
    else{
      this.comunicacion.mostrarEstado.emit("No hay solicitudes"+filtrado);
      }
      this.comunicacion.mostrarNota.emit("Solicitudes por atender");
    }

    botonCancel(indice: number) {
      this.reporteSeleccionado = this.reportes[indice].id;
      this.reporteIndice = indice;
      this.comunicacion.iconoDialogo("propioVobo");
      const dialogRef = this.dialog.open(DialogoComponent, {
        width: '570px', height: '270px', data: { botones: 2, cabecera: 'CERRAR REPORTE DE MANTENIMIENTO', contenido: 'Esta acción cerrará esta solicitud y reqerirá el llenado del reporte de manteimiento. ¿Está seguro de cerrar esta solicitud?.', boton1: 'Si, la cerraré', boton2: 'No, lo pensaré mejor', tipoMensaje: 'NORMAL' }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (!result)
        {
          this.toast('custom-class-red', 'La solicitud no se cerró', 3000);
        }
        else if (result == 0)
        {
          this.toast('custom-class-red', 'La solicitud no se cerró', 3000);
        }
        else 
        {
          //Primero se busca el requester
          let campos={accion: 201, requester: this.reportes[indice].requester};
          this.requesterBuscado = '' + this.reportes[indice].requester;
          this.gestionBD.consultasBD(campos).subscribe((data: any)=>{this.cpaso1(data)});
        }
      });
    }

    cpaso1(datos: any) {
      //Se valida que exista el requester
      if (!datos)
      {
        this.comunicacion.iconoDialogo("propioVobo");
        const dialogRef = this.dialog.open(DialogoComponent, {
          width: '570px', height: '270px', data: { botones: 1, cabecera: 'ATENDER LA SOLICITUD', contenido: "No se pudo cerrar la solicitud '" + this.reporteSeleccionado + "' porque no se encontró el requester: '" + this.requesterBuscado + "'. Por favor informe de esta situación al administrador del sistema", boton1: 'Aceptar', tipoMensaje: 'ALARMA' }
        });
      dialogRef.afterClosed().subscribe(result => {});
      }
      else
      {
        let campos={accion: 3, requester: datos.code};
          this.llamadaMMCall.llamadaMMCall(campos).subscribe((data: any)=>{this.cpaso2(data)});
          //de prueba a producción
          //this.cpaso2("success")
  
      }
    }

    cpaso2(data: any) {
      //Se valida la respuesta de MMCall
      this.comunicacion.iconoDialogo("propioVobo");
      if (data!="success"){
        const dialogRef = this.dialog.open(DialogoComponent, {
          width: '570px', height: '270px', data: { botones: 1, cabecera: 'ATENDER LA SOLICITUD', contenido: "No se pudo cerrar la solicitud '" + this.reporteSeleccionado + "' porque MMCall envió un mensaje: '" + data + "'. Por favor informe de esta situación al administrador del sistema", boton1: 'Aceptar', tipoMensaje: 'ALARMA' }
        });
        dialogRef.afterClosed().subscribe(result => {});
      }
      else
      {
        //Se cierra la atención y se inicia el tiempo del reporte
        this.toast('custom-class', 'La solicitud ha sido cerrada en MMCall, se presentará el respectivo reporte de mantenimiento', 3000);
        let fechaIni = new Date(this.reportes[this.reporteIndice].fecha);
        let fechaAte = new Date(this.reportes[this.reporteIndice].fecha);
        if (this.reportes[this.reporteIndice].inicio_atencion)
        {
          fechaAte = new Date(this.reportes[this.reporteIndice].inicio_atencion);
        }
        let fechaFin = new Date();
        let diferencia = fechaFin.getTime() - fechaIni.getTime() 
        let diferenciaAte = fechaFin.getTime() - fechaAte.getTime() 
        let tiempo1 = Math.floor(diferencia / (1000));
        let tiempo2 = Math.floor(diferenciaAte / (1000));
        let campos = {accion: 6, tiempo1: tiempo1, tiempo2: tiempo2, id: this.reporteSeleccionado, fecha: this.comunicacion.convertirFecha(1,'', 'yyyy-MM-dd HH:mm:ss')};
        this.gestionBD.escribirBD(campos).subscribe((data: any)=>{
          setTimeout(() => {
            this.cpaso3(data)
          }, 1000)});
          
      }
  }

  cpaso3(data: any) {
      //Se muestra la pantalla del reporte de mantto
      const dialogRef = this.dialog.open(DialogoCierreComponent, {
         disableClose: true, width: '620px', height: '530px', data: { accion: 0, tiempo: 0, maquina: this.reportes[this.reporteIndice].maquina, celula: this.reportes[this.reporteIndice].celula, area: this.reportes[this.reporteIndice].area, falla: this.reportes[this.reporteIndice].falla, detalle: '', tipo: 0, tecnico: 0}
      });
      this.comunicacion.mostrarNota.emit("Ingrese el detalle para el cierre de la solicitud");
      dialogRef.afterClosed().subscribe(result => {
        if (!result) {
          this.toast('custom-class-red', 'El reporte no se generó, reporte al Administrador del sistema', 3000);
        }
        else if (result.accion == 1) {
          let sePaso: string = 'N';
          if (result.tiempo <0) {
            sePaso = 'S';
          }
          let campos = {accion: 4, alarmado: sePaso, tipo: result.tipo, falla: result.
            falla, comentarios: result.detalle, tiempo: result.tiempo, id: this.reporteSeleccionado, cierre: this.comunicacion.convertirFecha(1,'', 'yyyy-MM-dd HH:mm:ss'), tecnico: result.tecnico };
          this.gestionBD.escribirBD(campos).subscribe((data: any)=>{this.paso4(1, data, 'El reporte se ha cerrado satisfactoriamente')});
          this.comunicacion.aTecnico({id: 0, nombre: ""});
        }
      });
    }
  
    crearPDF()
    {
      //Se busca el reporte en el sistema
      let campos={accion: 101, filtro: 'reportes.id = ' + this.reporteSeleccionado};
      this.gestionBD.consultasBD(campos).subscribe((data: reporte)=>{
        //this.llenarPDF(data)
      });
    }

    llenarPDF(miReporte: reporte) {
      let imagen : string = "./assets/logo.png";
  
      const doc = new jsPDF();
      doc.setFillColor(248,248,248);
      doc.rect(10, 10, 190, 13, 'F');
      doc.setDrawColor(169,169,169);  
      doc.rect(10, 10, 190, 13, 'S');
   
      doc.addImage(imagen, 'PNG', 130, 12, 70, 8);
      
      doc.setFont("helvetica");
      doc.setFontType("bold");
      doc.setFontSize(14);

      doc.rect(10, 28, 190, 30, 'S');      
      doc.rect(10, 28, 190, 5, 'F');
      doc.rect(10, 28, 190, 5, 'S');

      doc.rect(10, 60, 190, 30, 'S');      
      doc.rect(10, 60, 190, 5, 'F');
      doc.rect(10, 60, 190, 5, 'S');


      doc.text('REPORTE DE MANTENIMIENTO: ' + miReporte[0].id, 15, 15);
      doc.setFontType("normal");
      doc.setFontSize(12);
      doc.text('Fecha/hora: ' + this.comunicacion.convertirFecha(1,'', 'dd/MM/yyyy hh:mm a'), 15, 20);
      doc.setFontType("bold");
      doc.setFontSize(8);
      doc.text('PRODUCCION', 15, 32);
      doc.text('MANTENIMIENTO', 15, 64);

      doc.setFontType("normal");
      doc.text('LINEA/CELULA: ' + miReporte[0].celulanombre, 15, 38);
      doc.text('MAQUINA/EQUIPO: ' + miReporte[0].maquinanombre, 80, 38);
      doc.text('AREA: '  + miReporte[0].areanombre, 135, 38);
      doc.text('SOLICITANTE: '  + miReporte[0].username, 15, 43);
      doc.text('FECHA REPORTADA: '  + this.comunicacion.convertirFecha(1,miReporte[0].fecha, 'dd/MM/yyyy hh:mm a'), 135, 43);
      doc.text('DETALLE DE LA FALLA SOLICITADA: '  + miReporte[0].detalle, 15, 48);
   
      doc.text('TÉCNICO: ' + miReporte[0].tecniconombre, 15, 70);
      doc.text('FALLA REAL: ' + miReporte[0].fallanombretecnico, 80, 70);
      doc.text('INICIO DE TRABAJO: '  + this.comunicacion.convertirFecha(1, miReporte[0].inicio_atencion, 'dd/MM/yyyy hh:mm a'), 15, 75);
      doc.text('FIN DE TRABAJO: '  + this.comunicacion.convertirFecha(1, miReporte[0].inicio_reporte, 'dd/MM/yyyy hh:mm a'), 80, 75);
      let manttoTipo: string = ""
      if (miReporte[0].tipo == 0)
      {
        manttoTipo = "CORRECTIVO";
      }
      else if (miReporte[0].tipo == 2)
      {
        manttoTipo = "MEJORA";
      }
      else if (miReporte[0].tipo == 3)
      {
        manttoTipo = "APOYO";
      }
      else if (miReporte[0].tipo == 4)
      {
        manttoTipo = "PREVENTIVO";
      }
      else if (miReporte[0].tipo == 5)
      {
        manttoTipo = "PREDICTIVO";
      }
      else if (miReporte[0].tipo == 6)
      {
        manttoTipo = "OTRO";
      }
      doc.text('TIPO DE MANTENIMENTO: '  + manttoTipo, 140, 75);
      doc.text('TRABAJO REALIZADO: '  + miReporte[0].comentarios, 15, 80);
      doc.save('Reporte de mantenimiento ' + this.reporteSeleccionado );
    }

    toast(clase: string, mensaje: string, duracion: number) {
      let config = new MatSnackBarConfig();
        config.panelClass = [clase];
        config.duration = duracion;
        config.verticalPosition='bottom';
        this.snackBar.open(mensaje, null, config);
    }  

    validar(datos) {
        if (this.comunicacion.rUsuario().tecnico!="S")
          {
          const dialogRef = this.dialog.open(SolicitarTecnicoComponent, {
          disableClose: true, width: '400px', height: '440px', data: { accion: 0 }
          });
          this.comunicacion.mostrarNota.emit("Solicitud de técnico");
          dialogRef.afterClosed().subscribe(result => {
          
          if (!result) {
            this.toast('custom-class-red', 'La solicitud no se atendió', 3000);
          }
          else if (result.accion ==0) {
            this.toast('custom-class-red', 'La solicitud no se atendió', 3000);
          }
          else if(result.accion == 1)
          {
            let campos={accion: 2, requester: datos.code};
            this.llamadaMMCall.llamadaMMCall(campos).subscribe((data: any)=>{console.log("entro en mmcall" + data);this.paso2(data)});
            //de prueba a producción
            //this.paso2("success")
          }
          else if(result.accion == 2)
              {
                const dialogRef = this.dialog.open(NuevaClaveComponent, {
                  width: '400px', height: '370px', data: { accion: 0 }
                });
                dialogRef.afterClosed().subscribe(result => {
                  if (result.accion==0)
                  {this.toast('custom-class-red', 'No se realizó el cambio de usuario', 3000 );
                  }
                  else if(result.accion == 1)
                  {
                    let campos={accion: 2, requester: datos.code};
                    this.llamadaMMCall.llamadaMMCall(campos).subscribe((data: any)=>{console.log("entro en mmcall" + data);this.paso2(data)});
                    //de prueba a producción
                    //this.paso2("success")
                  }
              })
          }
          })
        }
        else
        {
          this.comunicacion.aTecnico({id: this.comunicacion.rUsuario().id, nombre: this.comunicacion.rUsuario().nombre})
          let campos={accion: 2, requester: datos.code};
            this.llamadaMMCall.llamadaMMCall(campos).subscribe((data: any)=>{console.log("entro en mmcall" + data);this.paso2(data)});
            //de prueba a producción
            //this.paso2("success")
        }
  }
}
