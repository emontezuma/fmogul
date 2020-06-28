import { Component, AfterContentInit, ViewChild, ElementRef } from '@angular/core';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';
import { Router } from '@angular/router';
import { trigger, animate, style, group, query, transition } from "@angular/animations";
import { ComunicacionService } from '../services/comunicacion.service';

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
  selector: 'app-panel1',
  templateUrl: './panel1.component.html',
  styleUrls: ['./panel1.component.css'],
  animations: [ routerTransition2 ]
})

export class Panel1Component implements AfterContentInit {

  @ViewChild("txtBuscar") miEemento: ElementRef;

  pantallaModo = {
    xl: 5,
    lg: 5,
    md: 4,
    sm: 2, 
    xs: 1,
  }

  vistaActual: number = 1;
  iconoAlarma: string = "propioAlarma"
  toolTipBuscar: string = "Filtrar la vista"
  
  toolTipFiltrar: string = "Ver sólo elementos alarmados"
  toolTipRefrescar: string = "Actualizar la vista"
  toolTipDescargar: string = "Descargar tabla de datos"
  ordenActual: number = 1;
  gridCols: number = 5;
  verBuscar: boolean = false;
  celulas: any = [];
  textoBuscar: string = "";

  seleccion01: boolean = true;
  seleccion02: boolean = false;
  seleccion03: boolean = false;

  constructor(private router: Router, private observableMedia: ObservableMedia, private comunicacion: ComunicacionService) 
  {   
    if (this.comunicacion.rUsuario().id==0)
    {this.router.navigateByUrl('/home')} 
    else {
    this.comunicacion.mostrarPaginaPanel.subscribe((data: any)=>{this.verPagina(data)});
    this.comunicacion.llamadasVistaPanel.subscribe((data: any)=>{this.vistaActual = data;this.inicializarPantalla()});
    this.comunicacion.enfocar.subscribe((data: any)=>{this.enfocar()});    
    }
  }

  
  enfocar()
  {
    setTimeout(() => {
      this.miEemento.nativeElement.focus();
    }, 1000);
  }

ngAfterContentInit() {
  if (this.comunicacion.rUsuario().id==0)
    {this.router.navigateByUrl('/home')} 
    else {
    this.observableMedia.asObservable().subscribe((change: MediaChange) => {
      this.gridCols = this.pantallaModo[change.mqAlias];
    });
  }
  }

  opcion10() 
  {
    this.seleccion01 = true;
    this.seleccion02 = false;
    this.seleccion03 = false;
    
    this.comunicacion.mostrar(false);
    let preferencias = this.comunicacion.recuperarPreferencias();
      this.vistaActual = 1;
      this.router.navigateByUrl('panel/panelcelula');
      
      this.inicializarPantalla();
  }

opcion20() 
  {
    this.seleccion01 = false;
    this.seleccion02 = true;
    this.seleccion03 = false;
    
    let preferencias = this.comunicacion.recuperarPreferencias();
    this.vistaActual = 11;
    this.router.navigateByUrl('panel/panelmaquina');
    this.inicializarPantalla();
  }

  opcion30() 
  {
    this.seleccion01 = false;
    this.seleccion02 = false;
    this.seleccion03 = true;
    
    //this.comunicacion.activarSpinner.emit(true); 
    //Se inicializa la celula'  
    let preferencias = this.comunicacion.recuperarPreferencias();
    this.vistaActual = 21;
    this.router.navigateByUrl('panel/panelarea');
    this.inicializarPantalla();
  }

  getState(outlet)
  {
    return outlet.activatedRouteData.state;
  }


  buscar() 
  {
    setTimeout(() => {
      this.miEemento.nativeElement.focus();
    }, 50);
  }

inicializarPantalla()
  {
    if (this.vistaActual == 1) {
      this.seleccion01 = true;
      this.seleccion02 = false;    
      this.seleccion03 = false;    
    }
    else if (this.vistaActual == 11) {
      this.seleccion01 = false;
      this.seleccion02 = true;    
      this.seleccion03 = false; 
    }
    else if (this.vistaActual == 21) {
      this.seleccion01 = false;
      this.seleccion02 = false;    
      this.seleccion03 = true; 
    }
  }

  verPagina(miPagina: number) 
  {
    if (miPagina == 1) {
      this.router.navigateByUrl('graficas/mttrgeneral');
      this.vistaActual = 1;
      this.inicializarPantalla();
    }
    else if (miPagina == 11) {
      this.router.navigateByUrl('graficas/mtbfgeneral');
      this.vistaActual = 11;
      this.inicializarPantalla();
    }
  }
  
  filtrar() {
    if (this.vistaActual==1) {
    this.comunicacion.aplicarFiltroCelulaPanel.emit(this.textoBuscar);
    }
    else if (this.vistaActual==11) {
      this.comunicacion.aplicarFiltroMaquinaPanel.emit(this.textoBuscar);
      }
      else if (this.vistaActual==21) {
      this.comunicacion.aplicarFiltroAreaPanel.emit(this.textoBuscar);
      }
    this.textoBuscar= "";
    
  }

  soloAlarmados() {
    if (this.comunicacion.rAlarmaPanel()==1)
    {
      this.toolTipFiltrar = "Ver todos los elementos"
      this.iconoAlarma = "propioVOperaciones"
      this.comunicacion.alarmaPanel(2);
      
    } 
    else {
      this.comunicacion.alarmaPanel(1);
      this.toolTipFiltrar = "Ver sólo elementos alarmados"
      this.iconoAlarma = "propioAlarma"
    }
    this.comunicacion.verSoloAlarmaPanel.emit(this.vistaActual);
  }

  descargar() {
    this.comunicacion.descargarPanel.emit(this.vistaActual);
  }

  refrescar() {
    this.comunicacion.refrescarCelulasPanel.emit(this.vistaActual);
  }
}


