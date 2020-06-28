import { Component, AfterContentInit, HostListener, OnDestroy  } from '@angular/core';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';
import { ComunicacionService } from '../services/comunicacion.service';
import { GestionApisService } from '../services/gestion-apis.service';

import { Router } from '@angular/router';


@Component({
  selector: 'app-llamada-mapa4',
  templateUrl: './llamada-mapa4.component.html',
  styleUrls: ['./llamada-mapa4.component.css']
})
export class LlamadaMapa4Component implements AfterContentInit {

  pantallaModo = {
    xl: 7,
    lg: 6,
    md: 3,
    sm: 2,
    xs: 1,
  }

  gridCols: number = 0;
  fallas: any = [];
  idFalla: number = 0;
  idResponsable: number = 0;
  idCelula: number = 0;
  arrFiltrado: any = [];

  vieneArbol: boolean = false;
  responsableMadre: string = "";
  sinRegistros: boolean = false;
  mensajeFallas: string = "No hay fallas relacionadas"
  totalRegs: string = " fallas";
    
  ElementoSeleccionado: number = 0;
  filtrarPor: string = "";
  verIrArriba: boolean = true;
  showScrollHeight = 300;
    hideScrollHeight = 10;

  constructor( private gestionBD: GestionApisService, private router: Router, private comunicacion: ComunicacionService, private observableMedia: ObservableMedia ) { 
    this.idCelula = this.comunicacion.recuperarSeleccion(1).id;
    
    this.idResponsable = this.comunicacion.recuperPreMostrarArea()
    this.vieneArbol = this.idResponsable>0;
    this.comunicacion.mostrarNota.emit("Seleccione una falla");
    this.idFalla = this.comunicacion.recuperarSeleccion(4).id;
    if (this.idFalla>0) {
      this.comunicacion.mostrarNota.emit("Ya seleccionó a esta falla: " + this.comunicacion.recuperarSeleccion(4).nombre)
    }
    this.llenarPantalla(1);
    this.comunicacion.refrescarFallas.subscribe((data: any)=>{this.llenarPantalla(data)});
    this.comunicacion.aplicarFiltroFalla.subscribe((data: string)=>{
      this.filtrarPor = data;
      this.fallas = this.filtrarmiArreglo(); 
    this.contarRegs()});
    this.comunicacion.irAlTop.subscribe((data: boolean)=>{
        //this.irAlTope();
    });
    
  }

  @HostListener('window:scroll', ['$event'])
  revisar() 
  {
    if (( window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop) > this.showScrollHeight) 
    {
      alert('elvis');
        this.verIrArriba = true;
    } 
    else if ( this.verIrArriba && (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop) < this.hideScrollHeight) 
    { 
      alert('elvis');
      this.verIrArriba = false; 
    }
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
    //Recupera la tabla de máquinas
    let miFiltro: string = "fallas.estatus = 'A'";
    if (this.vieneArbol && this.idResponsable>0) {
      miFiltro = miFiltro + ' and fallas.area = ' +  this.idResponsable; 
    }
    if (this.idCelula>0) {
      miFiltro = miFiltro + ' and fallas.celula = ' +  this.idCelula;
    }
    let miOrden: string = " fallas.prefijo asc ";
    if (orden == 2) {
      miOrden = " fallas.secuencia asc";
    }
    let campos={accion: 1003, filtro: miFiltro, orden: miOrden};
    this.gestionBD.consultasBD(campos).subscribe((data: any[])=>{
      this.fallas = data; 
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
    if (this.fallas.length != this.arrFiltrado.length){
      filtrado=" (filtrado)";
    }
    this.sinRegistros = this.fallas.length == 0;
    if (this.fallas.length == 1) {
      this.totalRegs = " falla";      
    }
    else if (this.fallas.length > 0 ) { 
    this.totalRegs = " fallas";      
      this.comunicacion.mostrarEstado.emit(this.fallas.length + this.totalRegs + filtrado);
    }
  else{
    this.comunicacion.mostrarEstado.emit("No hay fallas" + filtrado);
    }
    this.seleccionarItem();
  }

  
  ngAfterContentInit() {
    this.observableMedia.asObservable().subscribe((change: MediaChange) => {
         this.gridCols = this.pantallaModo[change.mqAlias];
    });
    this.comunicacion.llamadasVista.emit(11);
    //colocar luego de recuperar los datos...
  }


  enScroll() {
    alert('Hola');
  }
  
  itemSeleccionado: boolean[] = [false];

  arreglar() {
    for (let i = 0; i < this.fallas.length; i++)
    {
      this.itemSeleccionado[i] = false; 
    }
  }


  preferencias: any[] = [
    {verTope: 'S', verPie: 'N', pieVisible: 'S', menuAbierto: 'N', ultimaOpcion: '1', opcionDefecto: '1', vistaOperaciones: 'D', verCssAlerta: 'S'},
  ];

  seleccionarFalla(indice: number) {
    this.itemSeleccionado[this.ElementoSeleccionado] = false;
    this.ElementoSeleccionado = indice;
    this.itemSeleccionado[indice] = true;
    
    this.mostrarFalla();
    this.comunicacion.actualizarOpciones.emit(true);
    

    let campos={accion: 1002, filtro: "areas.id = " + this.fallas[indice].area};
    this.gestionBD.consultasBD(campos).subscribe((data: any)=>{
      let datos: any = {id: 0, nombre: '', imagen: '', colorhexa: '', elemento: ''};
      datos.id = this.fallas[indice].area;
      datos.nombre = data[0].prefijo;
      datos.imagen = data[0].imagen;
      datos.colorhexa = data[0].colorhexa;
      datos.elemento = 'ÁREA';
      this.comunicacion.seleccionar(3, datos);
      //  
      datos = {id: 0, nombre: '', imagen: '', colorhexa: '', elemento: ''}
      datos.id = this.fallas[indice].id;
      datos.nombre = this.fallas[indice].prefijo;
      datos.imagen = this.fallas[indice].imagen;
      datos.colorhexa = this.fallas[indice].colorhexa;
      datos.elemento = 'FALLA';
      this.comunicacion.seleccionar(4, datos);
      this.comunicacion.iraPagina.emit(2);

    });
  }

  seleccionarItem()  {
    this.ElementoSeleccionado = this.fallas.findIndex(c => c.id === this.idFalla);
    if (this.ElementoSeleccionado > -1) {
      this.itemSeleccionado[this.ElementoSeleccionado] = true;
      this.mostrarFalla();
    }
  }

  mostrarFalla() {
    this.comunicacion.seleccionFalla.emit(this.fallas[this.ElementoSeleccionado].id);
  }

  regresar() {
    this.router.navigateByUrl('llamada/responsables'); 
  }

  
}
