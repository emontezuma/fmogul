import { Component, AfterContentInit, ViewChild, OnInit } from '@angular/core';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';
import { ComunicacionService } from '../services/comunicacion.service';
import { GestionApisService } from '../services/gestion-apis.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-llamada-mapa1',
  templateUrl: './llamada-mapa1.component.html',
  styleUrls: ['./llamada-mapa1.component.css']
  })

export class LlamadaMapa1Component implements AfterContentInit {

  pantallaModo = {
    xl: 7,
    lg: 6,
    md: 3,
    sm: 2,
    xs: 1,
  }

  gridCols: number = 0;
  maquinas: any = [];
  arrFiltrado: any = [];
  vieneArbol: boolean = false;
  sinRegistros: boolean = false;
  mensajeMaquinas: string = "No hay máquinas relacionadas"
  totalRegs: string = " máquinas";
  filtrarPor: string = "";
  valorMMCALL: number = 0;

  constructor( private gestionBD: GestionApisService, private comunicacion: ComunicacionService, private observableMedia: ObservableMedia ) { 
    this.idCelula = this.comunicacion.recuperPreMostrar()
    this.vieneArbol = this.idCelula>0;
    this.comunicacion.mostrarNota.emit("Seleccione una máquina");
    this.idMaquina = this.comunicacion.recuperarSeleccion(2).id;
    this.comunicacion.aplicarFiltroMaquina.subscribe((data: string)=>{
      this.filtrarPor = data;
      //Aqui se filtra
      this.maquinas = this.filtrarmiArreglo(); 
      this.contarRegs();
    });
   
    this.llenarPantalla(1);
    this.comunicacion.refrescarMaquinas.subscribe((data: any)=>{this.llenarPantalla(data)});
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
    this.comunicacion.activarSpinner.emit(true);   
    this.arrFiltrado=[];
    //Recupera la tabla de máquinas
    let miFiltro: string = "a.estatus = 'A'";
    if (this.vieneArbol && this.idCelula>0) {
      miFiltro = miFiltro + ' and a.celula = ' +  this.idCelula;
    }
    let miOrden: string = " a.prefijo asc ";
    if (orden == 2) {
      miOrden = " a.secuencia asc";
    }
    let campos={accion: 10003, filtro: miFiltro, orden: miOrden};
    
    this.gestionBD.consultasBD(campos).subscribe((data: any[])=>{
      let campos={accion: 10000};
      this.gestionBD.consultasBD(campos).subscribe((data2: any[])=>{
      data.forEach((eMaq) => {
        let hallado: number = -1;
        hallado=data2.findIndex(c => c.prefijo == eMaq.id)
        if (hallado > -1) {
          this.arrFiltrado.push(eMaq);      
        }
      })
      this.maquinas=this.arrFiltrado;
      this.publicarDatos()
      });
      
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
    if (this.maquinas.length != this.arrFiltrado.length){
      filtrado=" (filtrado)";
    }
    this.sinRegistros = this.maquinas.length == 0;
    if (this.maquinas.length == 1) {
      this.totalRegs = " máquina";
      this.comunicacion.mostrarEstado.emit(this.maquinas.length + this.totalRegs + filtrado);      
    }
    else if (this.maquinas.length > 0 ) {
      this.totalRegs = " máquinas";  
      this.comunicacion.mostrarEstado.emit(this.maquinas.length + this.totalRegs + filtrado);
    }
  else{
    this.comunicacion.mostrarEstado.emit("No hay máquinas" + filtrado);
    }
    this.seleccionarItem();
  }

  ngAfterContentInit() {
    this.observableMedia.asObservable().subscribe((change: MediaChange) => {
         this.gridCols = this.pantallaModo[change.mqAlias];
    });
    this.comunicacion.llamadasVista.emit(1);
    //colocar luego de recuperar los datos...
  }

  idMaquina: number = 0;
  idCelula: number = 0;

  ElementoSeleccionado: number = 0;


  itemSeleccionado: boolean[] = [false];

  arreglar() {
    for (let i = 0; i < this.maquinas.length; i++)
    {
      this.itemSeleccionado[i] = false; 
    }
  }

  preferencias: any[] = [
    {verTope: 'S', verPie: 'N', pieVisible: 'S', menuAbierto: 'N', ultimaOpcion: '1', opcionDefecto: '1', vistaOperaciones: 'D', verCssAlerta: 'S'},
  ];

  seleccionarMaquina(indice: number) {
    this.itemSeleccionado[this.ElementoSeleccionado] = false;
    this.ElementoSeleccionado = indice;
    this.itemSeleccionado[indice] = true;
    this.mostrarMaquinaSelecionada();

  //Se buscan los datos del área seleccionada
  let campos={accion: 10002, filtro: "celulas.id = " + this.maquinas[indice].celula};
    this.gestionBD.consultasBD(campos).subscribe((data: any)=>{
      let datos: any = {id: 0, nombre: '', imagen: '', colorhexa: '', elemento: ''};
      datos.id = this.maquinas[indice].celula;
      datos.nombre = data[0].prefijo;
      datos.imagen = data[0].imagen;
      datos.colorhexa = data[0].colorhexa;
      datos.elemento = 'CELULA';
      this.comunicacion.seleccionar(1, datos);
      //  
      datos = {id: 0, nombre: '', imagen: '', colorhexa: '', elemento: ''}
      datos.id = this.maquinas[indice].id;
      datos.nombre = this.maquinas[indice].prefijo;
      datos.imagen = this.maquinas[indice].imagen;
      datos.colorhexa = this.maquinas[indice].colorhexa;
      datos.elemento = 'MAQUINA';
      this.comunicacion.seleccionar(2, datos);
      this.comunicacion.iraPagina.emit(1);
    });
  }

  seleccionarItem()  {
    this.ElementoSeleccionado = this.maquinas.findIndex(c => c.id === this.idMaquina);
    if (this.ElementoSeleccionado > -1) {
      this.itemSeleccionado[this.ElementoSeleccionado] = true;
      this.mostrarMaquinaSelecionada();
    }
  }

  mostrarMaquinaSelecionada() {
    
    this.comunicacion.seleccionMaquina.emit(this.maquinas[this.ElementoSeleccionado].id);
    this.comunicacion.mostrarNota.emit("Ya seleccionó esta máquina: " + this.maquinas[this.ElementoSeleccionado].prefijo);
    
  }

  regresar() {
    //this.router.navigateByUrl('llamada/celulas'); 
    this.comunicacion.mostrarPagina.emit(2);
  }

}
