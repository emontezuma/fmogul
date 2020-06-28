import { Component, AfterContentInit, ViewChild, ElementRef } from '@angular/core';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';
import { ComunicacionService } from '../services/comunicacion.service';
import { GestionApisService } from '../services/gestion-apis.service';
import { DialogoParosComponent } from '../dialogo-paros/dialogo-paros.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-detalle-paros',
  templateUrl: './detalle-paros.component.html',
  styleUrls: ['./detalle-paros.component.css']
})


export class DetalleParosComponent implements AfterContentInit {
  constructor( public dialog: MatDialog, private gestionBD: GestionApisService, private comunicacion: ComunicacionService, private observableMedia: ObservableMedia ) { 
    this.comunicacion.mostrarNota.emit("Paros registrados en el sistema");
    this.llenarPantalla();
    this.comunicacion.refrescarCelulas.subscribe((data: any)=>{this.llenarPantalla()});
    
  }

  @ViewChild("txtBuscar") miEemento: ElementRef;

  filtrar() {
    this.filtrarPor = this.textoBuscar;
    //Aqui se filtra
    this.celulas = this.filtrarmiArreglo(); 
    this.contarRegs()
  };
  

  filtrarmiArreglo() {
    if (!this.filtrarPor ) {
      return this.arrFiltrado;
    }
    else {
    return this.arrFiltrado.filter(datos =>
      datos.tiempo.toLowerCase().indexOf(this.filtrarPor.toLowerCase()) !== -1
      ||
      datos.tipoparo.toLowerCase().indexOf(this.filtrarPor.toLowerCase()) !== -1
      ||
      datos.textgen.toLowerCase().indexOf(this.filtrarPor.toLowerCase()) !== -1
      ||
      datos.textmaq.toLowerCase().indexOf(this.filtrarPor.toLowerCase()) !== -1
      ||
      datos.fecha.toLowerCase().indexOf(this.filtrarPor.toLowerCase()) !== -1
      ||
      datos.cad1.toLowerCase().indexOf(this.filtrarPor.toLowerCase()) !== -1);
    }
  }
  
  llenarPantalla() {
    this.comunicacion.activarSpinner.emit(true);   
    //Recupera la tabla de celulas

      //Se valida por máquina para traer la célula
      this.arrFiltrado=[];
      this.celulas = [];
      let consulta2 = "SELECT detalleparos.*, '' AS cad1, ROUND(tiempo / 3600, 2) AS tiempohr, IF(detalleparos.tipo = 0, 'PLANEADO', 'NO PLANEADO') AS tipoparo, maquinas.prefijo AS textmaq, generales.prefijo AS textgen FROM detalleparos LEFT JOIN maquinas ON detalleparos.maquina = maquinas.id LEFT JOIN generales ON detalleparos.paro = generales.id ORDER BY fecha DESC" ;
      let camposcab={accion: 50300, consulta: consulta2};  
      this.gestionBD.consultasBD(camposcab).subscribe((data: any []) =>{
        this.arrFiltrado = data;
        data.forEach((arreglo, index) => {
          arreglo.cad1 = 'Fecha: ' + arreglo.fecha;
        });
          this.celulas = this.arrFiltrado;
          this.publicarDatos()
        });
  }

  publicarDatos() {
    setTimeout(() => {
      this.comunicacion.activarSpinner.emit(false);   
    }, 100); 
    this.contarRegs();
  }

  contarRegs() {
    let filtrado="";
    if (this.celulas.length != this.arrFiltrado.length){
      filtrado=" (filtrado)";
    }
    
    this.sinRegistros = this.celulas.length == 0;
    if (this.celulas.length == 1) {
      this.comunicacion.mostrarEstado.emit(this.celulas.length + " paro" + filtrado);    
    }
    else if (this.celulas.length > 0 ) {
      this.comunicacion.mostrarEstado.emit(this.celulas.length + " paros" + filtrado);
    }
  else{
    this.comunicacion.mostrarEstado.emit("No hay paros" + filtrado);
    
    }
  }

  gridCols: number = 0;
  gridCols2: number = 0;
  celulas: any = [];    

  pantallaModo = {
    xl: 6,
    lg: 5,
    md: 4,
    sm: 2,
    xs: 1,
  }

  pantallaModo2 = {
    xl: 3,
    lg: 3,
    md: 2,
    sm: 2,
    xs: 1,
  }
  arrFiltrado: any = [];

  sinRegistros: boolean = false;
  filtrarPor: string = "";
  textoBuscar: string = "";
  toolTipBuscar: string = "Filtrar en los registros"
  toolTipRefrescar: string = "Refrescar la vista"
  toolTipDescargar: string = "Descargar los registros en formato CSV"

  ngAfterContentInit() {
    this.observableMedia.asObservable().subscribe((change: MediaChange) => {
      this.gridCols = this.pantallaModo[change.mqAlias];
      this.gridCols2 = this.pantallaModo2[change.mqAlias];
    });
  }

  paro(id: number) {
    const dialogRef = this.dialog.open(DialogoParosComponent, {
      width: '560px', height: '510px', data: { id: id, accion: 0 }
    });
    dialogRef.afterClosed().subscribe(result => {
    if (result.accion != 0) {
      this.llenarPantalla()}
    });
  }

  refrescar()
  {
    this.llenarPantalla();
  }

  agregarParo() {
    const dialogRef = this.dialog.open(DialogoParosComponent, {
      width: '560px', height: '510px', data: { id: 0, accion: 0 }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.accion != 0) {
        this.llenarPantalla()}
    });
   }

   buscar() {
    setTimeout(() => {
      this.miEemento.nativeElement.focus();
    }, 50);
  }

   descargar() {
    let exportCSV: string = "";

        // Loop the array of objects
        exportCSV = "Listado de paros registrados en el sistema: " + this.comunicacion.convertirFecha(1, '' , "yyyy/MM/dd hh:mm a") + "\r\n";
        exportCSV = exportCSV + '"ID del paro",';
        exportCSV = exportCSV + '"Nombre del paro",';
        exportCSV = exportCSV + '"Prefijo de la máquina asociada",';
        exportCSV = exportCSV + '"Tipo de paro",';
        exportCSV = exportCSV + '"Tiempo total en segundos",';
        exportCSV = exportCSV + '"Tiempo total en horas",';
        exportCSV = exportCSV + '"¿Se contabiliza?",' + "\r\n";
        let lineas: number = 0;
        this.celulas.forEach((elementos) => {
          lineas=lineas+1
          exportCSV = exportCSV + '"' + elementos.id + '",';
          exportCSV = exportCSV + '"' + elementos.textgen + '",';
          exportCSV = exportCSV + '"' + elementos.textmaq + '",';
          exportCSV = exportCSV + '"' + elementos.tipoparo + '",';
          exportCSV = exportCSV + '"' + elementos.tiempo + '",';
          exportCSV = exportCSV + '"' + elementos.tiempohr  + '",';
          exportCSV = exportCSV + '"' + elementos.contabilizar + '",' + "\r\n";
        })
        exportCSV = exportCSV + '"Total registro(s): "' + lineas //+ ";;;;" + this.ultimo.mttrytd + ";" + this.ultimo.mtbfytd + ";" + this.ultimo.reportesytd + this.ultimo.mttrmtd + ";" + this.ultimo.mtbfmtd + ";" + this.ultimo.reportesmtd + ";" + this.ultimo.reportesllamada + ";" + this.ultimo.reportesreparacion  
        // Once we are done looping, download the .csv by creating a link
        var blob = new Blob([exportCSV], {type: 'text/csv' }),
        url = window.URL.createObjectURL(blob);
        let link = document.createElement('a')
        link.download = "paros.csv";
        link.href = url
        link.click()
        window.URL.revokeObjectURL(url);
        link.remove();
  }
  
   

}
