import { Component, AfterContentInit, ViewChild, ElementRef } from '@angular/core';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';
import { ComunicacionService } from '../services/comunicacion.service';
import { GestionApisService } from '../services/gestion-apis.service';
import { MatDialog } from '@angular/material';
import { DialogoParteComponent } from '../dialogo-parte/dialogo-parte.component';
import { Router } from '@angular/router';



@Component({
  selector: 'app-partes',
  templateUrl: './partes.component.html',
  styleUrls: ['./partes.component.css']
})
export class PartesComponent implements AfterContentInit {
  imagen: string = "./assets/icons/npartes.svg";
  constructor( private router: Router, public dialog: MatDialog, private gestionBD: GestionApisService, private comunicacion: ComunicacionService, private observableMedia: ObservableMedia ) { 
    if (this.comunicacion.rUsuario().id==0)
    {this.router.navigateByUrl('/home')} 
    else {
    this.comunicacion.mostrarNota.emit("Números de parte registrados en el sistema");
    this.llenarPantalla();
    this.comunicacion.refrescarCelulas.subscribe((data: any)=>{this.llenarPantalla()});
    setTimeout(() => {
      this.miEemento.nativeElement.focus();
    }, 50);
  }
    
  }

  @ViewChild("txtBuscar") miEemento: ElementRef;

  buscar() {
    setTimeout(() => {
      this.miEemento.nativeElement.focus();
    }, 50);
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
      datos.referencia.toLowerCase().indexOf(this.filtrarPor.toLowerCase()) !== -1);
    }
  }
  
  llenarPantalla() {
    this.comunicacion.activarSpinner.emit(true);   
    //Recupera la tabla de celulas

      //Se valida por máquina para traer la célula
      this.arrFiltrado=[];
      this.celulas = [];
      let consulta2  = "SELECT c.*, (SELECT COUNT(partexmaquina.maquina) FROM partexmaquina WHERE partexmaquina.parte = c.id) AS tmaquinas FROM partes AS c ORDER BY referencia" ;
      let camposcab={accion: 50300, consulta: consulta2};  
      this.gestionBD.consultasBD(camposcab).subscribe((data: any []) =>{
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
  }

  contarRegs() {
    let filtrado="";
    if (this.celulas.length != this.arrFiltrado.length){
      filtrado=" (filtrado)";
    }
    
    this.sinRegistros = this.celulas.length == 0;
    if (this.celulas.length == 1) {
      this.comunicacion.mostrarEstado.emit(this.celulas.length + " números de parte" + filtrado);   

    }
    else if (this.celulas.length > 0 ) {
      this.comunicacion.mostrarEstado.emit(this.celulas.length + " número de parte" + filtrado);  
    }
    
  else{
    this.comunicacion.mostrarEstado.emit("No hay números de parte" + filtrado);
    
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
    const dialogRef = this.dialog.open(DialogoParteComponent, {
      disableClose: false,width: '530px', height: '380px', data: { id: id, accion: 0 }
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
    const dialogRef = this.dialog.open(DialogoParteComponent, {
      disableClose: false, width: '530px', height: '380px', data: { id: 0, accion: 0 }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.accion != 0) {
        this.llenarPantalla()}
    });
   }

   descargar() {
    let exportCSV: string = "";

        // Loop the array of objects
        exportCSV = "Listado de números de parte utilizados para SMED: " + this.comunicacion.convertirFecha(1, '' , "yyyy/MM/dd hh:mm a") + "\r\n";
        exportCSV = exportCSV + '"ID del registro",';
        exportCSV = exportCSV + '"Número de parte",';
        exportCSV = exportCSV + '"Prefijo de la máquina",' + "\r\n";
        let lineas: number = 0;
        this.celulas.forEach((elementos) => {
          lineas=lineas+1
          exportCSV = exportCSV + '"' + elementos.id + '",';
          exportCSV = exportCSV + '"' + elementos.referencia + '",';
          exportCSV = exportCSV + '"' + elementos.nmaquina + '",' + "\r\n";
        })
        exportCSV = exportCSV + '"Total registro(s): "' + lineas //+ ";;;;" + this.ultimo.mttrytd + ";" + this.ultimo.mtbfytd + ";" + this.ultimo.reportesytd + this.ultimo.mttrmtd + ";" + this.ultimo.mtbfmtd + ";" + this.ultimo.reportesmtd + ";" + this.ultimo.reportesllamada + ";" + this.ultimo.reportesreparacion  
        // Once we are done looping, download the .csv by creating a link
        var blob = new Blob([exportCSV], {type: 'text/csv' }),
        url = window.URL.createObjectURL(blob);
        let link = document.createElement('a')
        link.download = "pagers.csv";
        link.href = url
        link.click()
        window.URL.revokeObjectURL(url);
        link.remove();
  }
  
   

}

