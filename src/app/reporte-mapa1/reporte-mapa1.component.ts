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
  selector: 'app-reporte-mapa1',
  templateUrl: './reporte-mapa1.component.html',
  styleUrls: ['./reporte-mapa1.component.css'],
  animations: [ routerTransition2 ]
})

export class ReporteMapa1Component implements AfterContentInit {

  @ViewChild("txtBuscar") miEemento: ElementRef;

  pantallaModo = {
    xl: 4,
    lg: 4,
    md: 4,
    sm: 2, 
    xs: 1,
  }

  vistaActual: number = 1;
  iconoVista: string = "propioVMapa"
  toolTipVista: string = "Ver como organización"
  toolTipRefrescar = "Actualiza los datos desde la base de datos"
  toolTipBuscar = "Buscar en la lista"
  ordenActual: number = 1;
  iconoOrden: string = "propioOrdenarN";
  toolTipOrden: string = "Ordenar por secuencia de operación";
  gridCols: number = 5;
  verBuscar: boolean = false;

  seleccion01: boolean = true;
  seleccion02: boolean = false;
  textoBuscar: string = "";

  constructor(private router: Router, private observableMedia: ObservableMedia, private comunicacion: ComunicacionService) 
  {   
    if (this.comunicacion.rUsuario().id==0)
    {this.router.navigateByUrl('/home')} 
    else {
    this.comunicacion.mostrarPagina.subscribe((data: any)=>{this.verPagina(data)});
    this.comunicacion.llamadasVistaMapa.subscribe((data: any)=>{this.vistaActual = data;this.verPagina(data)});
  }
}

ngAfterContentInit() {
  if (this.comunicacion.rUsuario().id==0)
    {this.router.navigateByUrl('/home')} 
    else {this.observableMedia.asObservable().subscribe((change: MediaChange) => {
      this.gridCols = this.pantallaModo[change.mqAlias];
    })
  };
  }

  opcion10() 
  {
    this.seleccion01 = true;
    this.seleccion02 = false;
    //this.comunicacion.activarSpinner.emit(true); 
    //Se inicializa la celula'  
    this.comunicacion.mostrar(false);
      this.vistaActual = 1;
      this.router.navigateByUrl('respuesta/fallasporatender');
    this.inicializarPantalla();
  }

opcion20() 
  {
    this.seleccion01 = false;
    this.seleccion02 = true;
    //this.comunicacion.activarSpinner.emit(true); 
    //Se inicializa la celula'  
    let preferencias = this.comunicacion.recuperarPreferencias();
    this.router.navigateByUrl('respuesta/fallasatendidas');
    this.inicializarPantalla();
  }

getState(outlet)
  {
    return outlet.activatedRouteData.state;
  }

vista() 
  {
    this.inicializarPantalla();
    let preferencias: any = {maquinasMapa: this.vistaActual == 1, fallasMapa: this.vistaActual == 11 }
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
  }

  verPagina(miPagina: number) 
  {
    if (miPagina == 1) {
      this.router.navigateByUrl('respuesta/fallasporatender');
      this.vistaActual = 1;
      this.seleccion01 = true;
      this.seleccion02 = false;
      this.inicializarPantalla();
    }
    else if (miPagina == 11) {
      this.router.navigateByUrl('respuesta/fallasatendidas');
      this.vistaActual = 11;
      this.seleccion01 = false;
      this.seleccion02 = true;
      
      this.inicializarPantalla();
    }
  }

  filtrar() {
    if (this.vistaActual==1) {
    this.comunicacion.aplicarFiltroxAtender.emit(this.textoBuscar);
    }
    else if (this.vistaActual==2) {
      this.comunicacion.aplicarFiltroxReparar.emit(this.textoBuscar);
      }
    this.textoBuscar= "";
    
  }

  refrescar() 
  {
    if (this.vistaActual==1) {
      this.comunicacion.refrescarxAtender.emit(1);

  }
  else if (this.vistaActual==2) {
        this.comunicacion.refrescarxReparar.emit(1);

    }
  }

  
}

