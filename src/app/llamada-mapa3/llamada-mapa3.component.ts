import { Component, AfterContentInit, ViewChild } from '@angular/core';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';
import { ComunicacionService } from '../services/comunicacion.service';
import { Router } from '@angular/router';
import { GestionApisService } from '../services/gestion-apis.service';

@Component({
  selector: 'app-llamada-mapa3',
  templateUrl: './llamada-mapa3.component.html',
  styleUrls: ['./llamada-mapa3.component.css']
})

export class LlamadaMapa3Component implements AfterContentInit {

  constructor( private gestionBD: GestionApisService, private router: Router, private comunicacion: ComunicacionService, private observableMedia: ObservableMedia ) {
    this.comunicacion.preMostrarArea(0);
    this.idResponsable = this.comunicacion.recuperarSeleccion(3).id;
    if (this.idResponsable>0) {
      this.comunicacion.mostrarNota.emit("Ya seleccionó a esta área: " + this.comunicacion.recuperarSeleccion(3).nombre);
      
    }
    else {
      this.comunicacion.mostrarNota.emit("Seleccione un área");
    }
    this.idFalla = this.comunicacion.recuperarSeleccion(4).id;
    this.idCelula = this.comunicacion.recuperarSeleccion(1).id;
    
    this.llenarPantalla(1);
    

    this.comunicacion.refrescarAreas.subscribe((data: any)=>{this.llenarPantalla(data)});
    this.comunicacion.aplicarFiltroArea.subscribe((data: string)=>{
      this.filtrarPor = data;
      this.responsables = this.filtrarmiArreglo(); 
      this.contarRegs()});
        
  }

  filtrarmiArreglo() {

    if (!this.filtrarPor ) {
      return this.arrFiltrado;
    }
    else {
    return this.arrFiltrado.filter(datos =>
      datos.prefijo.toLowerCase().indexOf(this.filtrarPor.toLowerCase()) !== -1
      ||
      datos.prefijopadre.toLowerCase().indexOf(this.filtrarPor.toLowerCase()) !== -1);
    }
  }

  llenarPantalla(orden) {
    this.arrFiltrado=[];

    this.comunicacion.activarSpinner.emit(true);   
    //Recupera la tabla de áreas
    let miFiltro = '';
    if (this.idCelula >0){
      miFiltro = ' and fallas.celula = ' + this.idCelula;
    }
    let miOrden: string = " areas.prefijo asc ";
    if (orden == 2) {
      miOrden = " areas.secuencia asc";
    }
    let campos={accion: 10004, filtro: "areas.estatus = 'A'", filtro2: miFiltro, orden: miOrden};
    this.gestionBD.consultasBD(campos).subscribe((data: any[])=>{
      this.responsables = data; 
      this.arrFiltrado=data; 
      this.publicarDatos()
    });
  }

  publicarDatos() {
    setTimeout(() => {
      this.comunicacion.activarSpinner.emit(false);   
    }, 500); 
    this.contarRegs();
  }

  contarRegs() {
    let filtrado="";
    if (this.responsables.length != this.arrFiltrado.length){
      filtrado=" (filtrado)";
    }
    this.sinRegistros = this.responsables.length == 0;
    if (this.responsables.length == 1) {
      this.totalRegs = " área";      
    }
    else if (this.responsables.length > 0 ) {
      this.totalRegs = " áreas";      
      this.comunicacion.mostrarEstado.emit(this.responsables.length + this.totalRegs + filtrado);
    }
  else{
    this.comunicacion.mostrarEstado.emit("No hay áreas" + filtrado);
    
    }
    if (this.idResponsable>0) {
      this.seleccionarItem();
    }
  }

  totalRegs: string = " áreas";
  gridCols: number = 0;
  sinRegistros: boolean = false;
  pantallaModo = {
    xl: 7,
    lg: 6,
    md: 3,
    sm: 2,
    xs: 1,
  }

  idResponsable: number = 0;
  idFalla: number = 0;
  idCelula: number = 0;
  arrFiltrado: any = [];

  ElementoSeleccionado: number = 0;
  itemSeleccionado: boolean[] = [false];
  filtrarPor: string = "";


  ngAfterContentInit() {
    this.observableMedia.asObservable().subscribe((change: MediaChange) => {
      this.gridCols = this.pantallaModo[change.mqAlias];
   });
   this.comunicacion.llamadasVista.emit(12);
  }

  responsables: any = [];

  mostrarFallas(indice: number) 
  {
    let data: any = {id: 0};
      data.id = this.responsables[indice].id;
      //this.comunicacion.seleccionar(1, data);
      this.comunicacion.preMostrarArea(data.id );
      this.comunicacion.mostrarPagina.emit(11);
  }


      
  seleccionarItem()  {
    this.itemSeleccionado[this.ElementoSeleccionado] = false;
    if (this.idFalla>0) {
      this.ElementoSeleccionado = this.responsables.findIndex(c => c.id === this.idResponsable);
      if (this.ElementoSeleccionado > -1) {
        this.itemSeleccionado[this.ElementoSeleccionado] = true;
        this.mostrarResponsableSelecciono();
      }
    }
  }

  mostrarResponsableSelecciono() {
    this.comunicacion.seleccionResponsable.emit(this.responsables[this.ElementoSeleccionado].id);
    
  }
}


