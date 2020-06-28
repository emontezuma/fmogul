import { Component, AfterContentInit, ViewChild, ElementRef } from '@angular/core';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';
import { ComunicacionService } from '../services/comunicacion.service';
import { GestionApisService } from '../services/gestion-apis.service';
import { MatDialog } from '@angular/material';
import { DialogoAreasComponent } from '../dialogo-areas/dialogo-areas.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-areas',
  templateUrl: './areas.component.html',
  styleUrls: ['./areas.component.css']
})
export class AreasComponent implements AfterContentInit {

  @ViewChild("txtBuscar") miEemento: ElementRef;

  constructor( private router: Router, public dialog: MatDialog, private gestionBD: GestionApisService, private comunicacion: ComunicacionService, private observableMedia: ObservableMedia ) { 
    if (this.comunicacion.rUsuario().id==0)
    {this.router.navigateByUrl('/home')} 
    else{
    this.comunicacion.mostrarNota.emit("Áreas registrados en el sistema");
    this.llenarPantalla(this.ordenActual);
    this.comunicacion.refrescarCelulas.subscribe((data: any)=>{this.llenarPantalla(this.ordenActual)});
    setTimeout(() => {
      this.miEemento.nativeElement.focus();
    }, 50);
  }
    
  }

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
      datos.prefijo.toLowerCase().indexOf(this.filtrarPor.toLowerCase()) !== -1
      ||
      datos.nombre.toLowerCase().indexOf(this.filtrarPor.toLowerCase()) !== -1
      ||
      datos.referencia.toLowerCase().indexOf(this.filtrarPor.toLowerCase()) !== -1
      ||
      datos.id.toLowerCase().indexOf(this.filtrarPor.toLowerCase()) !== -1
      ||
      datos.tmaquinas.toLowerCase().indexOf(this.filtrarPor.toLowerCase()) !== -1
      ||
      datos.colorhexa.toLowerCase().indexOf(this.filtrarPor.toLowerCase()) !== -1);
    }
  }
  
  llenarPantalla(orden) {
    this.comunicacion.activarSpinner.emit(true);   
    //Recupera la tabla de celulas

      //Se valida por máquina para traer la célula
      this.arrFiltrado=[];
      this.celulas = [];
      let cadOrden=" c.prefijo"
      if (orden==2) {cadOrden=" c.secuencia"}
      let consulta2 = "SELECT c.*, a.nombre AS tcreador, b.nombre AS tmodificador, 0 AS tmaquinas FROM areas AS c LEFT JOIN usuarios AS a ON c.creado = a.id LEFT JOIN usuarios AS b ON c.modificado = b.id ORDER BY" + cadOrden ;
      let camposcab={accion: 50300, consulta: consulta2};  
      this.gestionBD.consultasBD(camposcab).subscribe((data: any []) =>{
        data.forEach((elemento) => {
          if (!elemento.referencia){elemento.referencia=""};
        })
        this.arrFiltrado = data;
          this.celulas = this.arrFiltrado;
          this.publicarDatos()
        });
  }

  publicarDatos() {
    setTimeout(() => {
      this.comunicacion.activarSpinner.emit(false);   
    }, 100); 
    this.contarRegs();
    if (this.textoBuscar) {
      this.filtrar()
    }
  }

  buscar() {
    setTimeout(() => {
      this.miEemento.nativeElement.focus();
    }, 50);
  }

  contarRegs() {
    let filtrado="";
    if (this.celulas.length != this.arrFiltrado.length){
      filtrado=" (filtrado)";
    }
    
    this.sinRegistros = this.celulas.length == 0;
    if (this.celulas.length == 1) {
      this.comunicacion.mostrarEstado.emit(this.celulas.length + " área" + filtrado);    
    }
    else if (this.celulas.length > 0 ) {
      this.comunicacion.mostrarEstado.emit(this.celulas.length + " áreas" + filtrado);
    }
  else{
    this.comunicacion.mostrarEstado.emit("No hay áreas" + filtrado);
    
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
  iconoOrden: string = "propioOrdenarN";
  toolTipOrden: string = "Ordenar por secuencia de operación";
  toolTipRefrescar: string = "Refrescar la vista"
  toolTipDescargar: string = "Descargar los registros en formato CSV";
  ordenActual: number = 1;

  ngAfterContentInit() {
    if (this.comunicacion.rUsuario().id==0)
    {this.router.navigateByUrl('/home')} 
    else{
    this.observableMedia.asObservable().subscribe((change: MediaChange) => {
      this.gridCols = this.pantallaModo[change.mqAlias];
      this.gridCols2 = this.pantallaModo2[change.mqAlias];
    });
  }
  }

  paro(id: number) {
    const dialogRef = this.dialog.open(DialogoAreasComponent, {
      width: '660px', height: '580px', data: { id: id, accion: 0 }
    });
    dialogRef.afterClosed().subscribe(result => {
    if (result.accion != 0) {
      this.llenarPantalla(this.ordenActual)}
    });
  }

  refrescar()
  {
    this.llenarPantalla(this.ordenActual);
  }

  agregarParo() {
    const dialogRef = this.dialog.open(DialogoAreasComponent, {
      width: '660px', height: '580px', data: { id: 0, accion: 0 }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.accion != 0) {
        this.llenarPantalla(this.ordenActual)}
    });
   }

   descargar() {
    let exportCSV: string = "";

        // Loop the array of objects
        exportCSV = "Listado de areas registradas en el sistema: " + this.comunicacion.convertirFecha(1, '' , "yyyy/MM/dd hh:mm a") + "\r\n";
        exportCSV = exportCSV + '"ID del area (autonumerico)",';
        exportCSV = exportCSV + '"Nombre",';
        exportCSV = exportCSV + '"Referencia",';
        exportCSV = exportCSV + '"Prefijo",';
        exportCSV = exportCSV + '"Color",';
        exportCSV = exportCSV + '"Ruta de la imagen",';
        exportCSV = exportCSV + '"Secuencia",';
        exportCSV = exportCSV + '"Estatus (A=Activo/I=Inactivo)",';
        exportCSV = exportCSV + '"Usuario creador",';
        exportCSV = exportCSV + '"Ultimo modificador",';
        exportCSV = exportCSV + '"Fecha de creacion",';
        exportCSV = exportCSV + '"Fecha de cambio",' + "\r\n";
        let lineas: number = 0;
        this.celulas.forEach((elementos) => {
          lineas=lineas+1
          exportCSV = exportCSV + '"' + elementos.id + '",';
          exportCSV = exportCSV + '"' + elementos.nombre + '",';
          exportCSV = exportCSV + '"' + elementos.referencia + '",';
          exportCSV = exportCSV + '"' + elementos.prefijo + '",';
          exportCSV = exportCSV + '"' + elementos.colorhexa  + '",';
          exportCSV = exportCSV + '"' + elementos.imagen  + '",';
          exportCSV = exportCSV + '"' + elementos.secuencia  + '",';
          exportCSV = exportCSV + '"' + elementos.estatus  + '",';
          exportCSV = exportCSV + '"' + elementos.tcreador  + '",';
          exportCSV = exportCSV + '"' + elementos.tmodificador  + '",';
          exportCSV = exportCSV + '"' + elementos.creacion  + '",';
          exportCSV = exportCSV + '"' + elementos.modificacion + '",' + "\r\n";
        })
        exportCSV = exportCSV + '"Total registro(s): "' + lineas //+ ";;;;" + this.ultimo.mttrytd + ";" + this.ultimo.mtbfytd + ";" + this.ultimo.reportesytd + this.ultimo.mttrmtd + ";" + this.ultimo.mtbfmtd + ";" + this.ultimo.reportesmtd + ";" + this.ultimo.reportesllamada + ";" + this.ultimo.reportesreparacion  
        // Once we are done looping, download the .csv by creating a link
        var blob = new Blob([exportCSV], {type: 'text/csv' }),
        url = window.URL.createObjectURL(blob);
        let link = document.createElement('a')
        link.download = "areas.csv";
        link.href = url
        link.click()
        window.URL.revokeObjectURL(url);
        link.remove();
  }

  ordenar() 
  {
    this.ordenActual = 1;
    if (this.iconoOrden == "propioOrdenar") {
      this.iconoOrden = "propioOrdenarN";
      this.toolTipOrden  = "Ordenar por secuencia";
    }
    else {
      this.ordenActual = 2;
      this.iconoOrden = "propioOrdenar";
      this.toolTipOrden  = "Ordenar alfabéticamente";
    }
    this.llenarPantalla(this.ordenActual);
  }
  
   

}

