import { Component, AfterContentInit, ViewChild } from '@angular/core';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';
import { ComunicacionService } from '../services/comunicacion.service';
import { GestionApisService } from '../services/gestion-apis.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-llamada-mapa2',
  templateUrl: './llamada-mapa2.component.html',
  styleUrls: ['./llamada-mapa2.component.css']
  })

export class LlamadaMapa2Component implements AfterContentInit {
  constructor( private gestionBD: GestionApisService, private router: Router, private comunicacion: ComunicacionService, private observableMedia: ObservableMedia ) { 
    this.comunicacion.mostrarNota.emit("Seleccione una célula");
    this.comunicacion.preMostrar(0);
    this.idCelula = this.comunicacion.recuperarSeleccion(1).id;
    this.idMaquina = this.comunicacion.recuperarSeleccion(2).id;
    this.llenarPantalla(1);
    this.idCelula = this.comunicacion.recuperarSeleccion(1).id;
    this.comunicacion.refrescarCelulas.subscribe((data: any)=>{this.llenarPantalla(data)});
    this.comunicacion.aplicarFiltroCelula.subscribe((data: string)=>{
      this.filtrarPor = data;
      //Aqui se filtra
      this.celulas = this.filtrarmiArreglo(); 
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
    this.comunicacion.activarSpinner.emit(true);   
    //Recupera la tabla de celulas

      //Se valida por máquina para traer la célula
      this.arrFiltrado=[];
      this.valCelulas=[];
      let camposVal={accion: 10003, filtro: "a.estatus = 'A'", orden: " a.id"};
      
      this.gestionBD.consultasBD(camposVal).subscribe((data: any[])=>{
        let misCampos={accion: 10000};
        this.gestionBD.consultasBD(misCampos).subscribe((data2: any[])=>{
        data.forEach((eMaq) => {
          let hallado: number = -1;
          hallado=data2.findIndex(c => c.prefijo == eMaq.id)
          if (hallado > -1) {
            //Se acumula el número de máquinas
            let hallado2: number = -1;
            let eCantidad = 1;
            hallado2=this.valCelulas.findIndex(c => c.celula == eMaq.celula)
            if (hallado2 > -1) {
              eCantidad = this.valCelulas[hallado2].cantidad + 1;
              this.valCelulas.splice(hallado2, 1);
            }      
            let vCelula= {celula: eMaq.celula, cantidad: eCantidad}
            this.valCelulas.push(vCelula);      
          }
        })
        let miOrden: string = " celulas.prefijo asc ";
        if (orden == 2) {
          miOrden = " celulas.secuencia asc";
        }
        let campos={accion: 10001, filtro: " celulas.estatus = 'A'", orden: miOrden};
        this.gestionBD.consultasBD(campos).subscribe((data: any[])=>{

          data.forEach((eCel) => {
            let hallado: number = -1;
            hallado=this.valCelulas.findIndex(c => c.celula == eCel.id)
            if (hallado > -1) {
              eCel.tmaquinas = this.valCelulas[hallado].cantidad;
              this.arrFiltrado.push(eCel);      
            }
          })
          this.celulas = this.arrFiltrado;
          this.publicarDatos()
        });
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
    if (this.celulas.length != this.arrFiltrado.length){
      filtrado=" (filtrado)";
    }
    
    this.sinRegistros = this.celulas.length == 0;
    if (this.celulas.length == 1) {
      this.totalRegs = " célula";      
    }
    else if (this.celulas.length > 0 ) {
      this.totalRegs = " células";      
      this.comunicacion.mostrarEstado.emit(this.celulas.length + this.totalRegs + filtrado);
    }
  else{
    this.comunicacion.mostrarEstado.emit("No hay células" + filtrado);
    
    }
    if (this.idCelula>0) {
      this.seleccionarItem();
    }
  }

  totalRegs: string = " celulas";
  gridCols: number = 0;
  celulas: any = [];    

  pantallaModo = {
    xl: 7,
    lg: 6,
    md: 3,
    sm: 2,
    xs: 1,
  }

  idCelula: number = 0;
  arrFiltrado: any = [];
  valCelulas: any = [];
  idMaquina: number = 0;

  ElementoSeleccionado: number = 0;
  itemSeleccionado: boolean[] = [false];
  sinRegistros: boolean = false;
  filtrarPor: string = "";

  ngAfterContentInit() {
    this.observableMedia.asObservable().subscribe((change: MediaChange) => {
      this.gridCols = this.pantallaModo[change.mqAlias];
    });
    this.comunicacion.llamadasVista.emit(2);
  }

  
  mostrarMaquinas(indice: number) 
  {
    let data: any = {id: 0};
    data.id = this.celulas[indice].id;
    //this.comunicacion.seleccionar(1, data);
    this.comunicacion.preMostrar(data.id );
    this.comunicacion.mostrarPagina.emit(1);
  }

  seleccionarItem()  {
    this.itemSeleccionado[this.ElementoSeleccionado] = false;
    if (this.idMaquina>0) {
      this.ElementoSeleccionado = this.celulas.findIndex(c => c.id == this.idCelula);
      if (this.ElementoSeleccionado > -1) {
        this.itemSeleccionado[this.ElementoSeleccionado] = true;
        this.mostrarCelulaSelecciona();
      }
    }
  }

  mostrarCelulaSelecciona() {
    this.comunicacion.seleccionCelula.emit(this.celulas[this.ElementoSeleccionado].id);
    this.comunicacion.mostrarNota.emit("Ya seleccionó a esta célula: " + this.celulas[this.ElementoSeleccionado].nombre);
    
  }
}
