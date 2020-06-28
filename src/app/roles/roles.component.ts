import { Component, AfterContentInit, ViewChild, ElementRef } from '@angular/core';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';
import { ComunicacionService } from '../services/comunicacion.service';
import { GestionApisService } from '../services/gestion-apis.service';
import { MatDialog } from '@angular/material';
import { DialogoRolesComponent } from '../dialogo-roles/dialogo-roles.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements AfterContentInit {

  
  @ViewChild("txtBuscar") miEemento: ElementRef;

  constructor( private router: Router, public dialog: MatDialog, private gestionBD: GestionApisService, private comunicacion: ComunicacionService, private observableMedia: ObservableMedia ) { 
    if (this.comunicacion.rUsuario().id==0)
    {this.router.navigateByUrl('/home')} 
    else{
    this.comunicacion.mostrarNota.emit("Roles registrados en el sistema");
    this.llenarPantalla();
    this.comunicacion.refrescarCelulas.subscribe((data: any)=>{this.llenarPantalla()});
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
      datos.nombre.toLowerCase().indexOf(this.filtrarPor.toLowerCase()) !== -1
      ||
      datos.id.toLowerCase().indexOf(this.filtrarPor.toLowerCase()) !== -1
      ||
      datos.colorhexa.toLowerCase().indexOf(this.filtrarPor.toLowerCase()) !== -1);
    }
  }
  
  llenarPantalla() {
    this.comunicacion.activarSpinner.emit(true);   
    //Recupera la tabla de celulas

      //Se valida por máquina para traer la célula
      this.arrFiltrado=[];
      this.celulas = [];
      let cadOrden=" c.nombre"
        let consulta2 = "SELECT c.*, a.nombre AS tcreador, b.nombre AS tmodificador, 0 as tmaquinas FROM permisos AS c LEFT JOIN usuarios AS a ON c.creado = a.id LEFT JOIN usuarios AS b ON c.modificado = b.id ORDER BY" + cadOrden ;
      let camposcab={accion: 50300, consulta: consulta2};  
      this.gestionBD.consultasBD(camposcab).subscribe((data: any []) =>{
        this.arrFiltrado = data;
          this.celulas = this.arrFiltrado;
          this.publicarDatos()
        });
  }

  publicarDatos() {
    if (this.textoBuscar) {
      this.filtrar()
    }
    setTimeout(() => {
      this.comunicacion.activarSpinner.emit(false);   
    }, 100); 
    this.contarRegs();
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
      this.comunicacion.mostrarEstado.emit(this.celulas.length + " política" + filtrado);    
    }
    else if (this.celulas.length > 0 ) {
      this.comunicacion.mostrarEstado.emit(this.celulas.length + " políticas" + filtrado);
    }
  else{
    this.comunicacion.mostrarEstado.emit("No hay políticas" + filtrado);
    
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
  toolTipDescargar: string = "Descargar los registros en formato CSV";
  estaImagen: string = "./assets/icons/roles.svg";

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
    const dialogRef = this.dialog.open(DialogoRolesComponent, {
      width: '660px', height: '580px', data: { id: id, accion: 0 }
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
    const dialogRef = this.dialog.open(DialogoRolesComponent, {
      width: '660px', height: '580px', data: { id: 0, accion: 0 }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.accion != 0) {
        this.llenarPantalla()}
    });
   }

   descargar() {
    let exportCSV: string = "";

        // Loop the array of objects
        exportCSV = "Listado de roles de usuario registradas en el sistema: " + this.comunicacion.convertirFecha(1, '' , "yyyy/MM/dd hh:mm a") + "\r\n";
        exportCSV = exportCSV + '"ID del rol (autonumerico)",';
        exportCSV = exportCSV + '"Nombre",';
        exportCSV = exportCSV + '"Genera solicitud? (S/N)",';
        exportCSV = exportCSV + '"Responde solicitud? (S/N)",';
        exportCSV = exportCSV + '"Genera SMED? (S/N)",';
        exportCSV = exportCSV + '"Panel de alarmas? (S/N) ",';
        exportCSV = exportCSV + '"Graficas? (S/N) ",';
        exportCSV = exportCSV + '"Exportar movimientos? (S/N) ",';
        exportCSV = exportCSV + '"Catalogo de Celulas? (S/N)",';
        exportCSV = exportCSV + '"Catalogo de Maquinas? (S/N)",';
        exportCSV = exportCSV + '"Catalogo de Areas? (S/N)",';
        exportCSV = exportCSV + '"Catalogo de Fallas? (S/N)",';
        exportCSV = exportCSV + '"Catalogo de Tablas generales? (S/N)",';
        exportCSV = exportCSV + '"Catalogo de Paros? (S/N)",';
        exportCSV = exportCSV + '"Catalogo de Pagers para SMED? (S/N)",';
        exportCSV = exportCSV + '"Catalogo de # de parte para SMED? (S/N)",';
        exportCSV = exportCSV + '"Catalogo de turnos? (S/N)",';
        exportCSV = exportCSV + '"Permisologia Usuarios? (S/N)",';
        exportCSV = exportCSV + '"Permisologia Politicas? (S/N)",';
        exportCSV = exportCSV + '"Permisologia Roles? (S/N)",';
        exportCSV = exportCSV + '"Configuracion de la aplicacion (S/N) ",';
        exportCSV = exportCSV + '"Licenciamiento (S/N) ",';
        exportCSV = exportCSV + '"Estatus (A=Activo/I=Inactivo)",';
        exportCSV = exportCSV + '"Usuario creador",';
        exportCSV = exportCSV + '"Ultimo modificador",';
        exportCSV = exportCSV + '"Fecha de creacion",';
        exportCSV = exportCSV + '"Fecha de cambio",' + "\r\n";
        let lineas: number = 0;
        this.celulas.forEach((elementos) => {
          lineas=lineas+1
          if (!elementos.reportes) {elementos.reportes = "NNNNNNNNNNNN"}
          if (!elementos.catalogos) {elementos.catalogos = "NNNNNNNNNNNN"}
          if (!elementos.configuracion) {elementos.configuracion = "NNNNNNNNNNNN"}
          exportCSV = exportCSV + '"' + elementos.id + '",';
          exportCSV = exportCSV + '"' + elementos.nombre + '",';
          exportCSV = exportCSV + '"' + elementos.llamada  + '",';
          exportCSV = exportCSV + '"' + elementos.atencion  + '",';
          exportCSV = exportCSV + '"' + elementos.smed  + '",';
          exportCSV = exportCSV + '"' + elementos.panel  + '",';
          exportCSV = exportCSV + '"' + elementos.graficas  + '",';
          exportCSV = exportCSV + '"' + elementos.reportes.substr(0,1)  + '",';
          exportCSV = exportCSV + '"' + elementos.catalogos.substr(0,1)  + '",';
          exportCSV = exportCSV + '"' + elementos.catalogos.substr(1,1)  + '",';
          exportCSV = exportCSV + '"' + elementos.catalogos.substr(2,1)  + '",';
          exportCSV = exportCSV + '"' + elementos.catalogos.substr(3,1)  + '",';
          exportCSV = exportCSV + '"' + elementos.catalogos.substr(4,1)  + '",';
          exportCSV = exportCSV + '"' + elementos.catalogos.substr(5,1)  + '",';
          exportCSV = exportCSV + '"' + elementos.catalogos.substr(6,1)  + '",';
          exportCSV = exportCSV + '"' + elementos.catalogos.substr(7,1)  + '",';
          exportCSV = exportCSV + '"' + elementos.catalogos.substr(8,1)  + '",';
          exportCSV = exportCSV + '"' + elementos.configuracion.substr(0,1)  + '",';
          exportCSV = exportCSV + '"' + elementos.configuracion.substr(1,1)  + '",';
          exportCSV = exportCSV + '"' + elementos.configuracion.substr(2,1)  + '",';
          exportCSV = exportCSV + '"' + elementos.configuracion.substr(3,1)  + '",';
          exportCSV = exportCSV + '"' + elementos.configuracion.substr(4,1)  + '",';
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
        link.download = "roles.csv";
        link.href = url
        link.click()
        window.URL.revokeObjectURL(url);
        link.remove();
  }


}

