import { Component, AfterContentInit, ViewChild } from '@angular/core';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';
import { ComunicacionService } from '../services/comunicacion.service';
import { Router } from '@angular/router';
import { GestionApisService } from '../services/gestion-apis.service';
import { trigger, animate, style, transition } from "@angular/animations";

export class datosPantalla {
  animado: string;
  id: string;
  prefijo: string;
  color: string;
  imagen: string
  nombre: string
  referencia: string;
  hijos: number;
  mttrytd: string;
  mtbfytd: string;
  reportesytd: number;
  mttrmtd: string;
  mtbfmtd: string;
  reportesmtd: number;
  reportesllamada: number;
  reportesreparacion: number;
  allamada: string;
  allamadaarea: string;
  areparacionarea: string;
  areparacion: string;
  ureparacion: string;
  strllamada: string;
  strreparacion: string;
};  

@Component({
  selector: 'app-reproductor-areas',
  templateUrl: './reproductor-areas.component.html',
  styleUrls: ['./reproductor-areas.component.css'],
  animations: [
    trigger('flyInOut', [
       
      transition('void => *', [
        style({ opacity: 0, transform: 'translateY(-30px)' }),
        animate('0.6s ease-in-out', style({ opacity: 1, transform: 'translateY(0px)' }))
      ]),
      transition('* => void', [
        style({ opacity: 1, transform: 'translateY(0px)' }),
        animate('0.6s ease-in-out', style({ opacity: 0, transform: 'translateY(30px)' }))
      ])
    ])
  ]
})

export class ReproductorAreasComponent implements AfterContentInit {

  constructor( private gestionBD: GestionApisService, private router: Router, private comunicacion: ComunicacionService, private observableMedia: ObservableMedia ) { 
    this.verAlarmados = true;
    this.llenarPantalla();
  }

  celulas: datosPantalla [];
  ultimo: datosPantalla;
  arrFiltrado: datosPantalla [];
  totalRegs: string = " áreas";
  gridCols: number = 0;
  sinRegistros: boolean = true;
  filtrarPor: string = "";
  mttrstd: number = 0;
  mtbfstd: number = 0;
  tiempoLlamada: string = "";
  tiempoReparacion: string = "";
  cronometrando: boolean = false;
  verAlarmados: boolean = false;
  tAlarmadasAntes: number = 0;

  pantallaModo = {
    xl: 6,
    lg: 5,
    md: 4,
    sm: 2,
    xs: 1,
  }

  ElementoSeleccionado: number = 0;
  itemSeleccionado: boolean[] = [false];
  
  llenarPantalla() {
    
    this.comunicacion.activarSpinner.emit(true);   
    //Recupera la tabla de máquinas
    let camposP={accion: 900};
    
    this.gestionBD.consultasBD(camposP).subscribe((data: any)=>{
      if (data.mttr) {
        this.mttrstd  = +data.mttr / 3600;
        this.mtbfstd  = +data.mtbf / 3600;
        
      }
      if (!this.mttrstd) {this.mttrstd=0}
      if (!this.mtbfstd) {this.mtbfstd=0}
      this.continuarLlenado();
    });
  }

  continuarLlenado() {
    this.celulas = [];
    this.arrFiltrado = [];
    this.itemSeleccionado[0] = true;
    let pid = "";
    let pprefijo = "";
    let pcolor = "";
    let pimagen = "";
    let pnombre = "";
    let preferencia = "";
    let phijos = 0;
    let pmttrytd = ""
    let pmtbfytd = ""
    let preportesytd = 0
    let pmttrmtd = "";
    let pmtbfmtd = "";
    let preportesmtd = 0;
    let preportesllamada = 0;
    let preportesreparacion = 0;
    let pallamada = "";
    let pareparacion = "";
    let pureparacion = "";
    let pstrllamada = "";
    let pstrreparacion = "";
    let pallamadaarea = "";
    let pareparacionarea = "";
    let fechaHasta = this.comunicacion.convertirFecha(2, '' + new Date(), "yyyy/MM/dd");
    let fechaTrabajoINI = this.comunicacion.convertirFecha(1, '' , "yyyy/MM/dd");
    let fechaTrabajoINI2 = fechaTrabajoINI.substring(0,4) + "/01/01"
    let fechaDesde = this.comunicacion.convertirFecha(2, '' + new Date(fechaTrabajoINI2), "yyyy/MM/dd");
    let campos={accion: 1821, desde: fechaDesde, hasta: fechaHasta, filtroadicional: "WHERE a.estatus = 'A'"};

    this.gestionBD.consultasBD(campos).subscribe((data: any[])=>{
      data.forEach((registro, index) => {
        //Se llenan los datos MTD
        
         
        fechaTrabajoINI2 = fechaTrabajoINI.substring(0,7) + "/01"
        fechaDesde = this.comunicacion.convertirFecha(2, '' + new Date(fechaTrabajoINI2), "yyyy/MM/dd");
        campos={accion: 1821, desde: fechaDesde, hasta: fechaHasta, filtroadicional: "WHERE a.id = " + registro.id};
        this.gestionBD.consultasBD(campos).subscribe((masDatos: any )=>{
       
          let campos2={accion: 1802, filtro: "AND area = " + registro.id};
          this.gestionBD.consultasBD(campos2).subscribe((dataActual: any[])=>{

            campos2 = {accion: 1803, filtro: "SELECT * FROM areas WHERE id = "  + registro.id};
              this.gestionBD.consultasBD(campos2).subscribe((data2: any)=>{
                pmttrytd = registro.mttrc ==-1 ? "N/A" : '' + registro.mttrc;
                pmtbfytd = registro.mtbfc ==-1 ? "N/A" : '' + registro.mtbfc;
                preportesytd = +registro.totalf; 
               
                pmttrmtd = masDatos[0].mttrc ==-1 ? "N/A" : '' + masDatos[0].mttrc;
                pmtbfmtd = masDatos[0].mtbfc ==-1 ? "N/A" : '' + masDatos[0].mtbfc;
                preportesmtd = +masDatos[0].totalf; 
             
                preportesllamada = +dataActual[0].totalr;
                preportesreparacion = +dataActual[1].totalr;
                pallamada = dataActual[0].desde;
                pallamadaarea = dataActual[0].uarea;
                pareparacionarea = dataActual[1].uarea;
                
                pareparacion = dataActual[1].desde;
                pureparacion = dataActual[2].desde;
                if (!preportesllamada) {preportesllamada=0};
                if (!preportesreparacion) {preportesreparacion=0}
                if (!pallamada) 
                {pallamada="N/A"}
                if (!pareparacion) {pareparacion="N/A"}
                if (!pureparacion) {pureparacion="N/A"}

                if (preportesllamada>0) {
                  let fechaIni = new Date(pallamada);
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
                  segundos = segundos % 60;
                  strhoras=''+horas;
                  if (minutos<10) {strminutos='0'+minutos} else {strminutos=''+minutos}
                  if (segundos<10) {strsegundos='0'+segundos} else {strsegundos=''+segundos}
                    pstrllamada = strhoras + ':' + strminutos + ':' + strsegundos;
                }
                else {
                  pstrllamada = ""
                }
                if (preportesreparacion>0) {
                  let fechaIni = new Date(pareparacion);
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
                  segundos = segundos % 60;
                  strhoras=''+horas;
                  if (minutos<10) {strminutos='0'+minutos} else {strminutos=''+minutos}
                  if (segundos<10) {strsegundos='0'+segundos} else {strsegundos=''+segundos}
                    pstrreparacion = strhoras + ':' + strminutos + ':' + strsegundos;
                }
                else {
                  pstrreparacion = ""
                }

            
                pid = registro.id;
                pprefijo = data2.prefijo;
                pcolor = data2.colorhexa;
                pimagen = data2.imagen;
                phijos = 0;
                pnombre = data2.nombre;
                preferencia = data2.referencia;
              
              if (index < data.length - 1)
              {
              this.celulas.push(
                {animado: "",
                  id: pid, 
                prefijo: pprefijo,
                nombre: pnombre,
                referencia: preferencia,
                color: pcolor,
                imagen: pimagen,
                hijos: phijos,
                mttrytd: pmttrytd,
                mtbfytd: pmtbfytd,
                reportesytd: preportesytd,
                mttrmtd: pmttrmtd,
                mtbfmtd: pmtbfmtd,
                reportesmtd: preportesmtd,
                reportesllamada: preportesllamada,
                reportesreparacion: preportesreparacion,
                allamada: pallamada,
                areparacion: pareparacion,
                ureparacion: pureparacion, 
                allamadaarea: pallamadaarea,
                areparacionarea: pareparacionarea,
                
                strllamada: pstrllamada,
                strreparacion: pstrreparacion});
              }

                if (index==data.length-1) {
                  this.ultimo=
                    {animado: "",
                      id: pid, 
                    prefijo: pprefijo,
                    nombre: pnombre,
                    referencia: preferencia,
                    color: pcolor,
                    imagen: pimagen,
                    hijos: phijos,
                    mttrytd: pmttrytd,
                    mtbfytd: pmtbfytd,
                    reportesytd: preportesytd,
                    mttrmtd: pmttrmtd,
                    mtbfmtd: pmtbfmtd,
                    reportesmtd: preportesmtd,
                    reportesllamada: preportesllamada,
                    reportesreparacion: preportesreparacion,
                    allamada: pallamada,
                    areparacion: pareparacion,
                    ureparacion: pureparacion, 
                    allamadaarea: pallamadaarea,
                    areparacionarea: pareparacionarea,
                    
                    strllamada: "",
                    strreparacion: ""};
                
                    this.arrFiltrado = this.celulas;                  
                    this.publicarDatos()};
            });
          });
        });
      });
    });
  }

  publicarDatos() {
    this.comunicacion.activarSpinner.emit(false);
    setTimeout(() => {
      this.contarRegs();   
    }, 500); 
  }

  contarRegs() {
    if (this.comunicacion.rpanelActual()==100)
    {
    setTimeout(() => {
      let horafecha = this.comunicacion.convertirFecha(1, "", "hh:mm:ss a"); 
      //this.comunicacion.mostrarNota.emit(horafecha + " (de " + this.tAlarmadasAntes + " a " +  talarmadas + ")");
      this.cronometro()
  }, 5000);
  }
}

  filtrarmiArreglo() {

    if (!this.filtrarPor ) {
      return this.arrFiltrado;
    }
    else {
    return this.arrFiltrado.filter(datos =>
      datos.prefijo.toLowerCase().indexOf(this.filtrarPor.toLowerCase()) !== -1);
    }
  }

  ngAfterContentInit() {
    this.comunicacion.panelActual(100);
    this.observableMedia.asObservable().subscribe((change: MediaChange) => {
      this.gridCols = this.pantallaModo[change.mqAlias];
    });
  }

  cronometro() {
    //this.cronometrando = true;
    let preportesmtd = 0;
    let preportesllamada = 0;
    let preportesreparacion = 0;
    let pallamada = "";
    let pareparacion = "";
    let pureparacion = "";
    
    this.celulas.forEach((miReporte, index) => {
      let campos2={accion: 1802, filtro: "AND area = " + miReporte.id};
      this.gestionBD.consultasBD(campos2).subscribe((data: any[])=>{
        preportesllamada = +data[0].totalr;
        preportesreparacion = +data[1].totalr;
        pallamada = data[0].desde;
        pareparacion = data[1].desde;
        pureparacion = data[2].desde;
        if (!preportesllamada) {preportesllamada=0};
        if (!preportesreparacion) {preportesreparacion=0}
        if (!pallamada) 
        {pallamada="N/A"}
        if (!pareparacion) {pareparacion="N/A"}
        if (!pureparacion) {pureparacion="N/A"}
        miReporte.allamadaarea = data[0].uarea;
        miReporte.areparacionarea = data[1].uarea;
        let accion: string;  
        if (this.verAlarmados)
        {
          if (miReporte.reportesllamada+miReporte.reportesreparacion==0 && preportesllamada+preportesreparacion>0)
            {this.playLlamada()}
        }
        miReporte.animado = accion; 
        miReporte.reportesllamada = preportesllamada;
        miReporte.reportesreparacion = preportesreparacion;
        miReporte.allamada = pallamada;
        miReporte.areparacion = pareparacion;
        miReporte.ureparacion = pureparacion; 
        if (preportesllamada>0) {
          let fechaIni = new Date(pallamada);
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
          segundos = segundos % 60;
          strhoras=''+horas;
          if (minutos<10) {strminutos='0'+minutos} else {strminutos=''+minutos}
          if (segundos<10) {strsegundos='0'+segundos} else {strsegundos=''+segundos}
            miReporte.strllamada = strhoras + ':' + strminutos + ':' + strsegundos;
          }
        else {
          miReporte.strllamada = ""
        }
        if (preportesreparacion>0) {
          let fechaIni = new Date(pareparacion);
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
          segundos = segundos % 60;
          strhoras=''+horas;
          if (minutos<10) {strminutos='0'+minutos} else {strminutos=''+minutos}
          if (segundos<10) {strsegundos='0'+segundos} else {strsegundos=''+segundos}
            miReporte.strreparacion = strhoras + ':' + strminutos + ':' + strsegundos;
        }
        else {
          miReporte.strreparacion = ""
        }
        if  (index==this.celulas.length-1) {this.contarRegs(); this.cronometrando = false}
      })
    });
  }

  playLlamada() {
    let audio = new Audio();
    audio.src = "./assets/llamada.wav";
    audio.load();
    audio.play();
  }

  
}
