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
  areparacion: string;
  allamadaarea: string;
  areparacionarea: string;
  
  
  ureparacion: string;
  strllamada: string;
  strreparacion: string;
};  


@Component({
  selector: 'app-panel',
  templateUrl: './panel2.component.html',
  styleUrls: ['./panel2.component.css'],
  animations: [
    trigger('flyInOut', [
       
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-30px)' }),
        animate('0.6s ease-in-out', style({ opacity: 1, transform: 'translateY(0px)' }))
      ]),
      transition(':leave', [
        style({ opacity: 1, transform: 'translateY(0px)' }),
        animate('0.6s ease-in-out', style({ opacity: 0, transform: 'translateY(-30px)' }))
      ])
    ])
  ]
})

  
export class Panel2Component implements AfterContentInit {


  constructor( private gestionBD: GestionApisService, private router: Router, private comunicacion: ComunicacionService, private observableMedia: ObservableMedia ) { 
    this.verAlarmados = this.comunicacion.rAlarmaPanel()==2;
    this.llenarPantalla();
    setTimeout(() => {
      this.comunicacion.panelActual(1)
    }, 500);
    this.comunicacion.refrescarCelulasPanel.subscribe((data: any)=>{
      if (data == 1) 
      {this.llenarPantalla()}});
    this.comunicacion.aplicarFiltroCelulaPanel.subscribe((data: string)=>{
      this.filtrarPor = data;
      //Aqui se filtra
      this.celulas = this.filtrarmiArreglo(); 
      this.contarRegs();
    });
    this.comunicacion.verSoloAlarmaPanel.subscribe((data: any)=>{
      if (data == 1) 
      {
        if (this.comunicacion.rAlarmaPanel()==2) {
          this.celulas.forEach((registro, index) =>{
            if (registro.reportesllamada + registro.reportesreparacion==0) 
              {registro.animado="*"}
          })
              this.verAlarmados = true; 
        } 
        else {
          this.celulas.forEach((registro, index) =>{
            if (registro.reportesllamada + registro.reportesreparacion==0) 
              {registro.animado="*"}
          })
              this.verAlarmados = false; 
        }
      }
    });
    this.comunicacion.descargarPanel.subscribe((data: any)=>{
      if (data == 1) 
      {this.descargar()}});
  }

  celulas: datosPantalla [];
  ultimo: datosPantalla;
  arrFiltrado: datosPantalla [];
  totalRegs: string = " células";
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
    let pallamadaarea = "";
    let pareparacion = "";
    let pareparacionarea = "";
    let pureparacion = "";
    let pstrllamada = "";
    let pstrreparacion = "";
    
    let fechaHasta = this.comunicacion.convertirFecha(2, '' + new Date(), "yyyy/MM/dd");
    let fechaTrabajoINI = this.comunicacion.convertirFecha(1, '' , "yyyy/MM/dd");
    let fechaTrabajoINI2 = fechaTrabajoINI.substring(0,4) + "/01/01"
    let fechaDesde = this.comunicacion.convertirFecha(2, '' + new Date(fechaTrabajoINI2), "yyyy/MM/dd");
    let campos={accion: 1801, desde: fechaDesde, hasta: fechaHasta, filtroadicional: "WHERE a.estatus = 'A'"};

    this.gestionBD.consultasBD(campos).subscribe((data: any[])=>{
      data.forEach((registro, index) => {
        //Se llenan los datos MTD
         
        fechaTrabajoINI2 = fechaTrabajoINI.substring(0,7) + "/01"
        fechaDesde = this.comunicacion.convertirFecha(2, '' + new Date(fechaTrabajoINI2), "yyyy/MM/dd");
        campos={accion: 1801, desde: fechaDesde, hasta: fechaHasta, filtroadicional: "WHERE a.id = " + registro.id};
        this.gestionBD.consultasBD(campos).subscribe((masDatos: any )=>{
       
          let campos2={accion: 1802, filtro: "AND celula = " + registro.id};
          this.gestionBD.consultasBD(campos2).subscribe((dataActual: any[])=>{

            campos2 = {accion: 1803, filtro: "SELECT a.*, (SELECT COUNT(*) FROM maquinas WHERE maquinas.celula = a.id) AS thijos FROM celulas AS a WHERE a.id = "  + registro.id};
              this.gestionBD.consultasBD(campos2).subscribe((data2: any)=>{
                pmttrytd = registro.mttrc ==-1 ? "N/A" : '' + registro.mttrc;
                pmtbfytd = registro.mtbfc ==-1 ? "N/A" : '' + registro.mtbfc;
                preportesytd = +registro.totalf; 
               
                if (masDatos.length > 0)
                {
                  pmttrmtd = masDatos[0].mttrc ==-1 ? "N/A" : '' + masDatos[0].mttrc;
                }
                else
                {
                  pmttrmtd = "N/A"
                }
                if (masDatos.length > 0)
                {
                  pmtbfmtd = masDatos[0].mtbfc ==-1 ? "N/A" : '' + masDatos[0].mtbfc;
                }
                else
                {
                  pmtbfmtd = "N/A"
                }
                
                if (masDatos.length > 0)
                {
                  preportesmtd = +masDatos[0].totalf; 
                }
                else
                {
                  preportesmtd = 0;
                }
                
             
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
              phijos = data2.thijos;
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
                allamadaarea: pallamadaarea,
                areparacionarea: pareparacionarea,
                areparacion: pareparacion,
                ureparacion: pureparacion, 
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
                  allamadaarea: pallamadaarea,
                  areparacionarea: pareparacionarea,
                  ureparacion: pureparacion, 
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
    this.celulas.sort(this.compare);
      
    setTimeout(() => {
      this.contarRegs(); 
    }, 500); 
  }

  contarRegs() {
    if (this.comunicacion.rpanelActual()==1)
    {
    let filtrado = "";
    if (this.celulas.length != this.arrFiltrado.length){
      filtrado=" (filtrado)";
    }
    let talarmadas = 0;
    let alarmadas= "";
    this.celulas.forEach((miReporte) => {
      if (miReporte.reportesllamada + miReporte.reportesreparacion > 0) {
        talarmadas = talarmadas + 1;
      }
    })
    if (talarmadas>0) {
      alarmadas = ' / ' + talarmadas + ' alarmada'
      if (talarmadas>1) {
        alarmadas = alarmadas + 's'}  
    }
    if (this.celulas.length != this.arrFiltrado.length){
      filtrado=" (filtrado)";
    }
    this.sinRegistros = this.celulas.length == 0;
    if (this.celulas.length == 1) {
      this.totalRegs = " célula";
      this.comunicacion.mostrarEstado.emit(this.celulas.length + this.totalRegs + alarmadas + filtrado);      
    }
    else if (this.celulas.length > 0 ) {
      this.totalRegs = " células";  
      this.comunicacion.mostrarEstado.emit(this.celulas.length + this.totalRegs + alarmadas + filtrado);
    }
  else{
    this.comunicacion.mostrarEstado.emit("No hay células" + alarmadas + filtrado);
    }
    this.comunicacion.enfocar.emit(true);
    setTimeout(() => {
      let horafecha = this.comunicacion.convertirFecha(1, "", "hh:mm:ss a"); 
      //this.comunicacion.mostrarNota.emit(horafecha + " (de " + this.tAlarmadasAntes + " a " +  talarmadas + ")");
      if (this.tAlarmadasAntes != talarmadas)
      {this.tAlarmadasAntes = talarmadas} 
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
    this.observableMedia.asObservable().subscribe((change: MediaChange) => {
      this.gridCols = this.pantallaModo[change.mqAlias];
    });
    this.comunicacion.llamadasVistaPanel.emit(1);
  }

  
  compare(a, b) {
    let comparison = 0;
    if (a.prefijo  > b.prefijo) {
      comparison = 1;
    } else if (a.prefijo < b.prefijo) {
      comparison = -1;
    }
    return comparison;
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
      let campos2={accion: 1802, filtro: "AND celula = " + miReporte.id};
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
            {accion="*"}
          if (miReporte.reportesllamada+miReporte.reportesreparacion>0 && preportesllamada+preportesreparacion==0)
            {accion="void"}
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
        if  (index==this.celulas.length-1) 
        {this.contarRegs(); this.cronometrando = false}
      })
    });
    
  }

  descargar() {
    let exportCSV: string = "";

        // Loop the array of objects
        exportCSV = "Panel de control por célula al momento: " + this.comunicacion.convertirFecha(1, '' , "yyyy/MM/dd hh:mm a") + "\r\n";
        exportCSV = exportCSV + '"ID de Celula",';
        exportCSV = exportCSV + '"Nombre de la Celula",';
        exportCSV = exportCSV + '"Referencia de la Celula",';
        exportCSV = exportCSV + '"Prefijo de la Celula",';
        exportCSV = exportCSV + '"Maquinas asociadas",';
        exportCSV = exportCSV + '"MTTR (YTD)",';
        exportCSV = exportCSV + '"MTBF (YTD)",';
        exportCSV = exportCSV + '"Reportes (YTD)",';
        exportCSV = exportCSV + '"MTTR (MTD)",';
        exportCSV = exportCSV + '"MTBF (MTD)",';
        exportCSV = exportCSV + '"Reportes (MTD)",';
        exportCSV = exportCSV + '"Llamadas abiertas",';
        exportCSV = exportCSV + '"Reparaciones abiertas",' + "\r\n";
        let lineas: number = 0;
        this.celulas.forEach((elementos: datosPantalla, index) => {
          lineas=lineas+1
          exportCSV = exportCSV + '"' + elementos.id + '",';
          exportCSV = exportCSV + '"' + elementos.nombre + '",';
          exportCSV = exportCSV + '"' + elementos.referencia + '",';
          exportCSV = exportCSV + '"' + elementos.prefijo + '",';
          exportCSV = exportCSV + '"' + elementos.hijos + '",';
          exportCSV = exportCSV + '"' + elementos.mttrytd + '",';
          exportCSV = exportCSV + '"' + elementos.mtbfytd  + '",';
          exportCSV = exportCSV + '"' + elementos.reportesytd + '",';
          exportCSV = exportCSV + '"' + elementos.mttrmtd + '",';
          exportCSV = exportCSV + '"' + elementos.mtbfmtd + '",';
          exportCSV = exportCSV + '"' + elementos.reportesmtd + '",';
          exportCSV = exportCSV + '"' + elementos.reportesllamada + '",';
          exportCSV = exportCSV + '"' + elementos.reportesreparacion + '",' + "\r\n";
        })
        exportCSV = exportCSV + '"Total registro(s): "' + lineas //+ ";;;;" + this.ultimo.mttrytd + ";" + this.ultimo.mtbfytd + ";" + this.ultimo.reportesytd + this.ultimo.mttrmtd + ";" + this.ultimo.mtbfmtd + ";" + this.ultimo.reportesmtd + ";" + this.ultimo.reportesllamada + ";" + this.ultimo.reportesreparacion  
        // Once we are done looping, download the .csv by creating a link
        var blob = new Blob([exportCSV], {type: 'text/csv' }),
        url = window.URL.createObjectURL(blob);
        let link = document.createElement('a')
        link.download = "panel_por_celula.csv";
        link.href = url
        link.click()
        window.URL.revokeObjectURL(url);
        link.remove();
  }

}
