import { Component, AfterContentInit, ViewChild, ElementRef } from '@angular/core';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';
import { ComunicacionService } from '../services/comunicacion.service';
import { GestionApisService } from '../services/gestion-apis.service';
import { MatDialog } from '@angular/material';
import { DialogoTurnosComponent } from '../dialogo-turnos/dialogo-turnos.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-turnos',
  templateUrl: './turnos.component.html',
  styleUrls: ['./turnos.component.css']
})

export class TurnosComponent implements AfterContentInit {
  constructor( private router: Router, public dialog: MatDialog, private gestionBD: GestionApisService, private comunicacion: ComunicacionService, private observableMedia: ObservableMedia ) { 
    if (this.comunicacion.rUsuario().id==0)
    {this.router.navigateByUrl('/home')} 
    else{
    this.comunicacion.mostrarNota.emit("Turnos registrados en el sistema");
    this.llenarPantalla();
    this.comunicacion.refrescarCelulas.subscribe((data: any)=>{this.llenarPantalla()});
    setTimeout(() => {
      this.miEemento.nativeElement.focus();
    }, 50);
  }
    
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
      datos.referencia.toLowerCase().indexOf(this.filtrarPor.toLowerCase()) !== -1
      ||
      datos.inicia.toLowerCase().indexOf(this.filtrarPor.toLowerCase()) !== -1
      ||
      datos.termina.toLowerCase().indexOf(this.filtrarPor.toLowerCase()) !== -1);
    }
  }
  
  llenarPantalla() {
    this.comunicacion.activarSpinner.emit(true);   
    //Recupera la tabla de celulas

      //Se valida por máquina para traer la célula
      this.arrFiltrado=[];
      this.celulas = [];
      let consulta2 = "SELECT c.*, b.nombre AS tmodificador, 0 as tmaquinas FROM turnos AS c LEFT JOIN usuarios AS a ON c.creado = a.id LEFT JOIN usuarios AS b ON c.modificado = b.id ORDER BY referencia" ;
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
      this.comunicacion.mostrarEstado.emit(this.celulas.length + " turno" + filtrado);    
    }
    else if (this.celulas.length > 0 ) {
      this.comunicacion.mostrarEstado.emit(this.celulas.length + " turnos" + filtrado);
    }
  else{
    this.comunicacion.mostrarEstado.emit("No hay turnos" + filtrado);
    
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
    const dialogRef = this.dialog.open(DialogoTurnosComponent, {
      width: '660px', height: '510px', data: { id: id, accion: 0 }
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
    const dialogRef = this.dialog.open(DialogoTurnosComponent, {
      width: '660px', height: '510px', data: { id: 0, accion: 0 }
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
        exportCSV = "Listado de turnos registrados en el sistema: " + this.comunicacion.convertirFecha(1, '' , "yyyy/MM/dd hh:mm a") + "\r\n";
        exportCSV = exportCSV + '"ID del turno",';
        exportCSV = exportCSV + '"Referencia del turno",';
        exportCSV = exportCSV + '"Hora de inicio",';
        exportCSV = exportCSV + '"Hora de fin",';
        exportCSV = exportCSV + '"Turno de dos días (S=Si, N=No)",';
        exportCSV = exportCSV + '"Mover dia de reporte (S=Siguiente, A=Anterior, N=Nocambiar)",';
        exportCSV = exportCSV + '"Estatus (A=Activo, I=Inactivo)",';
        exportCSV = exportCSV + '"Usuario creador",';
        exportCSV = exportCSV + '"Ultimo modificador",';
        exportCSV = exportCSV + '"Fecha de creacion",';
        exportCSV = exportCSV + '"Fecha de cambio",' + "\r\n";
       
        let lineas: number = 0;
        this.celulas.forEach((elementos) => {
          lineas=lineas+1
          exportCSV = exportCSV + '"' + elementos.id + '",';
          exportCSV = exportCSV + '"' + elementos.referencia + '",';
          exportCSV = exportCSV + '"' + elementos.inicia + '",';
          exportCSV = exportCSV + '"' + elementos.termina + '",';
          exportCSV = exportCSV + '"' + elementos.cambio + '",';
          exportCSV = exportCSV + '"' + elementos.mover + '",';
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
        link.download = "turnos.csv";
        link.href = url
        link.click()
        window.URL.revokeObjectURL(url);
        link.remove();
  }
  
   

}
