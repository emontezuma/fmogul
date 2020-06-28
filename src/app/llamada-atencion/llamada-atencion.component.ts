import { Component, AfterContentInit, ViewChild, ElementRef } from '@angular/core';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';
import { Router } from '@angular/router';
import { trigger, animate, style, group, query, transition } from "@angular/animations";
import { ComunicacionService } from '../services/comunicacion.service';
import { GestionApisService } from '../services/gestion-apis.service';



export const routerTransition2 = trigger('routerTransition2', [
  transition('* <=> *', [
    query(':enter, :leave', style({ position: 'absolute', width:'100%' })
      , { optional: true }),
    group([
      query(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('0.5s ease-in-out', style({ opacity: 1, transform: 'translateY(0px)' }))
      ], { optional: true }),
      query(':leave', [
        style({ opacity: 1, transform: 'translateY(0px)' }),
        animate('0.5s ease-in-out', style({ opacity: 0, transform: 'translateY(30px)' }))
      ], { optional: true }),
    ])
  ])
])



@Component({
  selector: 'app-llamada-atencion',
  templateUrl: './llamada-atencion.component.html',
  styleUrls: ['./llamada-atencion.component.css'],
  animations: [ routerTransition2 ]
})

export class LlamadaAtencionComponent implements AfterContentInit {

  @ViewChild("txtBuscar") miEemento: ElementRef;

  vistaActual: number = 2;
  iconoVista = "propioVOperaciones"
  toolTipVista = "Ver como detalle"
  toolTipRefrescar = "Actualiza los datos desde la base de datos"
  toolTipBuscar = "Buscar en la lista"
  ordenActual: number = 1;
  iconoOrden: string = "propioOrdenarN";
  toolTipOrden: string = "Ordenar por secuencia de operación";
  gridCols: number = 5;
  verBuscar: boolean = false;
  textoBuscar: string = "";

  seleccion01: boolean = true;
  seleccion02: boolean = false;
  seleccion03: boolean = false;

  completo01: boolean = false;
  completo02: boolean = false;
  completo03: boolean = false;

  habilitar03: boolean = false;
  habilitar02: boolean = false;
  
pantallaModo = {
  xl: 5,
  lg: 5,
  md: 3,
  sm: 2, 
  xs: 1,
}

  constructor( private gestionBD: GestionApisService, private router: Router, private observableMedia: ObservableMedia, private comunicacion: ComunicacionService) { 
    if (this.comunicacion.rUsuario().id==0)
    {this.router.navigateByUrl('/home')}    
    else {
    this.comunicacion.mostrarPagina.subscribe((data: any)=>{this.verPagina(data)});
    this.comunicacion.llamadasVista.subscribe((data: any)=>{this.vistaActual = data;this.inicializarPantalla()});
    this.comunicacion.seleccionMaquina.subscribe((data: number)=>{this.completo01 = data > 0});
    this.comunicacion.seleccionFalla.subscribe((data: number)=>{this.completo02 = data > 0});
    this.completo01 = this.comunicacion.recuperarSeleccion(2).id > 0;
    this.completo02 = this.comunicacion.recuperarSeleccion(4).id > 0;
    this.habilitar03 = this.completo01 && this.completo02;
    this.habilitar02 = this.completo01;
    this.comunicacion.iraPagina.subscribe((data: any)=>{
      this.completo01 = this.comunicacion.recuperarSeleccion(2).id > 0;
      this.completo02 = this.comunicacion.recuperarSeleccion(4).id > 0;
      this.habilitar03 = this.completo01 && this.completo02;
      this.habilitar02 = this.completo01;
      if (data == 1 && this.habilitar02) {
        this.opcion20()
      }
      else if (this.completo01==true)
      {
        this.habilitar03=true;
        this.opcion30();
      }
      else {
          this.opcion10();
      }
    });

    if (!this.habilitar03) {
      if (this.completo01) {
        this.opcion20();
      }
      else {
        this.opcion10();
      }
    }
  }
  }
  
  ngAfterContentInit() {
    this.comunicacion.panelActual(0);
    if (this.comunicacion.rUsuario().id==0)
      {
        this.router.navigateByUrl('/home')
      }    
    else
      {
        this.observableMedia.asObservable().subscribe((change: MediaChange) => {
        this.gridCols = this.pantallaModo[change.mqAlias];
        this.inicializarPantalla();
        });
      }
  }

opcion10() 
  {
    this.seleccion01 = true;
    this.seleccion02 = false;
    this.seleccion03 = false;
    //this.comunicacion.activarSpinner.emit(true); 
    //Se inicializa la celula'  
    this.comunicacion.mostrar(false);
    let preferencias = this.comunicacion.recuperarPreferencias();
    
    let consulta1 = "SELECT vermaquina, verfalla from usuarios where id = " + this.comunicacion.rUsuario().id;
      let camposcab={accion: 50100, consulta: consulta1};  
      this.gestionBD.consultasBD(camposcab).subscribe((data) =>{
        preferencias.maquinasMapa = (data.vermaquina=="S" ? true : false);
        preferencias.fallasMapa = (data.verfalla=="S" ? true : false);
        if (preferencias.maquinasMapa) {
          this.vistaActual = 1;
          this.router.navigateByUrl('llamada/maquinasgeneral');
        }
        else {
          this.vistaActual = 2;
          this.router.navigateByUrl('llamada/celulas');
        }
        this.inicializarPantalla();
      })
  }

opcion20() 
  {
    this.seleccion01 = false;
    this.seleccion02 = true;
    this.seleccion03 = false;
    this.comunicacion.mostrar(false);
    
    let preferencias = this.comunicacion.recuperarPreferencias();
    let consulta1 = "SELECT vermaquina, verfalla from usuarios where id = " + this.comunicacion.rUsuario().id;
      let camposcab={accion: 50100, consulta: consulta1};  
      this.gestionBD.consultasBD(camposcab).subscribe((data) =>{
        preferencias.maquinasMapa = (data.vermaquina=="S" ? true : false);
        preferencias.fallasMapa = (data.verfalla=="S" ? true : false);
        if (preferencias.fallasMapa) {
          this.vistaActual = 11;
          this.router.navigateByUrl('llamada/fallasgeneral');
        }
        else {
          this.vistaActual = 12;
          this.router.navigateByUrl('llamada/responsables');
        }
        this.inicializarPantalla();
      })
  }

opcion30() 
  {
    this.vistaActual = 21;
    this.seleccion01 = false;
    this.seleccion02 = false;
    this.seleccion03 = true;
    this.router.navigateByUrl('llamada/reporte');
    this.comunicacion.mostrarNota.emit("Revise los parámetros y genere la solicitud"); 
  }

getState(outlet)
  {
    return outlet.activatedRouteData.state;
  }

vista() 
  {
    this.inicializarPantalla();
    if (this.vistaActual == 2) {
      let data  = {id: 0, nombre: '', imagen: '', color: '', elemento: ''}
      this.comunicacion.preMostrar(0);
      this.comunicacion.mostrar(false);
      this.vistaActual = 1;
      this.router.navigateByUrl('llamada/maquinasgeneral');   
      this.comunicacion.mostrarNota.emit("Seleccione la máquina");      
    }
    else if (this.vistaActual == 1) {
      this.vistaActual = 2;
      this.router.navigateByUrl('llamada/celulas'); 
      this.comunicacion.mostrarNota.emit("Seleccones la célula");   
    }
    else if (this.vistaActual == 12) {
      this.vistaActual = 11;
      this.router.navigateByUrl('llamada/fallasgeneral');   
      this.comunicacion.mostrarNota.emit("Seleccione la falla"); 
    }
    else if (this.vistaActual == 11) {
      this.vistaActual = 12;
      this.router.navigateByUrl('llamada/responsables');   
      this.comunicacion.mostrarNota.emit("Seleccione el área responsable"); 
    }
    let preferencias: any = {maquinasMapa: this.vistaActual == 1, fallasMapa: this.vistaActual == 11 }
    let consulta1="";
    if (this.vistaActual == 1 || this.vistaActual == 2)
      {
        consulta1 = "update usuarios set vermaquina = '" + (this.vistaActual == 1 ? "S" : "N") + "' WHERE id = " + this.comunicacion.rUsuario().id;
      }
    else
      {
        consulta1 = "update usuarios set verfalla = '" + (this.vistaActual == 11 ? "S" : "N") + "' WHERE id = " + this.comunicacion.rUsuario().id;
      }
    let camposcab={accion: 50030, consulta: consulta1};  
      this.gestionBD.escribirBD(camposcab).subscribe((data: any) =>{
    });
    this.comunicacion.preferencias(preferencias); 
     preferencias = this.comunicacion.recuperarPreferencias();
  }

  buscar() 
  {
    this.verBuscar = !this.verBuscar;
    if (this.verBuscar)
    {
      setTimeout(() => {
        this.miEemento.nativeElement.focus();
      }, 50);
    }

  }

inicializarPantalla()
  {
    if (this.vistaActual == 1) {
      this.iconoVista = "propioVMapa"
      this.toolTipVista = "Ver como organización"      
    }
    else if (this.vistaActual == 2) {
      this.iconoVista = "propioVOperaciones"
      this.toolTipVista = "Ver como detalle"
    }
    else if (this.vistaActual == 11) {
      this.iconoVista = "propioVMapa"
      this.toolTipVista = "Ver como organización"      
    }
    else if (this.vistaActual == 12) {
      this.iconoVista = "propioVOperaciones"
      this.toolTipVista = "Ver como detalle"
    }
  }

ordenar() 
  {
    let ordenar: number = 1;
    if (this.iconoOrden == "propioOrdenar") {
      this.iconoOrden = "propioOrdenarN";
      this.toolTipOrden  = "Ordenar por secuencia de operación";
    }
    else {
      ordenar = 2;
      this.iconoOrden = "propioOrdenar";
      this.toolTipOrden  = "Ordenar alfabéticamente";
    }
    if (this.vistaActual==2) {
      this.comunicacion.refrescarCelulas.emit(ordenar);
    }
    else if (this.vistaActual==1) {
      this.comunicacion.refrescarMaquinas.emit(ordenar);
    }
    else if (this.vistaActual==12) {
      this.comunicacion.refrescarAreas.emit(ordenar);
    }
    else if (this.vistaActual==11) {
      this.comunicacion.refrescarFallas.emit(ordenar);
    }
  }


  refrescar() 
  {
    if (this.vistaActual==2) {
      this.comunicacion.refrescarCelulas.emit(1);

  }
  else if (this.vistaActual==1) {
        this.comunicacion.refrescarMaquinas.emit(1);

    }
    else if (this.vistaActual==12) {
      this.comunicacion.refrescarAreas.emit(1);

  }
  else if (this.vistaActual==11) {
    this.comunicacion.refrescarFallas.emit(1);

}
  }
  
  verPagina(miPagina: number) 
  {
    if (miPagina == 1) {
      this.router.navigateByUrl('llamada/maquinas');
      this.comunicacion.mostrarNota.emit("Seleccione la máquina");
      this.vistaActual = 1;
      this.inicializarPantalla();
    }
    else if (miPagina == 11) {
      this.router.navigateByUrl('llamada/fallas');
      this.comunicacion.mostrarNota.emit("Seleccione la falla");
      this.vistaActual = 11;
      this.inicializarPantalla();
    }
    else if (miPagina == 2) {
      this.router.navigateByUrl('llamada/celulas');
      this.comunicacion.mostrarNota.emit("Seleccione la célula");
      this.vistaActual = 2;
      this.inicializarPantalla();
    }
    else if (miPagina == 12) {
      this.router.navigateByUrl('llamada/responsables');
      this.comunicacion.mostrarNota.emit("Seleccione el área responsable");
      this.vistaActual = 12;
      this.inicializarPantalla();
    }
  }

  changeOver() {
    this.comunicacion.aChangeOver.emit(true);
  }

  filtrar() {
    if (this.vistaActual==1) {
    this.comunicacion.aplicarFiltroMaquina.emit(this.textoBuscar);
    }
    else if (this.vistaActual==2) {
      this.comunicacion.aplicarFiltroCelula.emit(this.textoBuscar);
      }
      else if (this.vistaActual==11) {
      this.comunicacion.aplicarFiltroFalla.emit(this.textoBuscar);
      }
      else if (this.vistaActual==12) {
        this.comunicacion.aplicarFiltroArea.emit(this.textoBuscar);
        }
    this.textoBuscar= "";
    
  }
}
