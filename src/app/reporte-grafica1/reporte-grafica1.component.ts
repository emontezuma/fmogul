import { Component, AfterContentInit, ViewChild } from '@angular/core';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';
import { Router } from '@angular/router';
import { trigger, animate, style, group, query, transition } from "@angular/animations";
import { ComunicacionService } from '../services/comunicacion.service';
import { DialogoFiltroComponent } from '../dialogo-filtro/dialogo-filtro.component';
import { MatDialog } from '@angular/material';
import { DialogoGraficaComponent } from '../dialogo-grafica/dialogo-grafica.component';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';

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
  selector: 'app-reporte-grafica1',
  templateUrl: './reporte-grafica1.component.html',
  styleUrls: ['./reporte-grafica1.component.css'],
  animations: [ routerTransition2 ]
})

export class ReporteGrafica1Component implements AfterContentInit {


  pantallaModo = {
    xl: 4,
    lg: 4,
    md: 3,
    sm: 2, 
    xs: 1,
  }

  vistaActual: number = 1;
  iconoVista: string = "propioVMapa"
  toolSigTT: string = "Ver gráfico siguiente"
  toolAntTT: string = "Ver gráfico anterior"
  toolDesTT: string = "Guardar el gráfico como una imagen"
  toolFilTT: string = "Filtrar información graficada"
  toolDatTT: string = "Descargar tabla de datos"
  toolEdTT: string = "Editar los parámetros de ésta gráfica"
  graficando: boolean = false;

  puedeEditar: boolean = true;


  toolTipFiltrar: string = "Ver como organización"
  ordenActual: number = 1;
  iconoOrden: string = "propioOrdenarN";
  toolTipOrden: string = "Ordenar por secuencia de operación";
  gridCols: number = 4;
  verBuscar: boolean = false;

  seleccion01: boolean = true;
  seleccion02: boolean = false;
  seleccion03: boolean = false;
  toolTipAnterior: string = "";

  constructor(public snackBar: MatSnackBar, public dialog: MatDialog, private router: Router, private observableMedia: ObservableMedia, private comunicacion: ComunicacionService) 
  {   
    if (this.comunicacion.rUsuario().id==0)
    {this.router.navigateByUrl('/home')} 
    else {
      this.comunicacion.llamadasVistaGrafica.subscribe((data: any)=>{
      this.vistaActual = data; 
      this.inicializarPantalla()});
    }
    //this.comunicacion.graficando.subscribe((estado: any)=>{
    //  this.graficando = estado; 
    //})
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
ngAfterContentInit() {
  if (this.comunicacion.rUsuario().id==0)
    {this.router.navigateByUrl('/home')} 
    else{
    this.observableMedia.asObservable().subscribe((change: MediaChange) => {
      this.gridCols = this.pantallaModo[change.mqAlias];
    });
  }
  }

  opcion10() 
  {
    //this.comunicacion.iniGrafico.emit(1);
    this.seleccion01 = true;
    this.seleccion02 = false;
    this.seleccion03 = false;
    let preferencias = this.comunicacion.recuperarPreferencias();
    this.vistaActual = 1;
    this.router.navigateByUrl('graficas/mttrgeneral');
    ////this.comunicacion.graficando.emit(false);
    
  }

opcion20() 
  {
    //this.comunicacion.iniGrafico.emit(11);
    this.seleccion01 = false;
    this.seleccion02 = true;
    this.seleccion03 = false;
    let preferencias = this.comunicacion.recuperarPreferencias();
    this.vistaActual = 11;
    this.router.navigateByUrl('graficas/mtbfgeneral');
    //this.comunicacion.graficando.emit(false);
    
  }

  opcion30() 
  {
    //this.comunicacion.iniGrafico.emit(21);
    this.seleccion01 = false;
    this.seleccion02 = false;
    this.seleccion03 = true;
    let preferencias = this.comunicacion.recuperarPreferencias();
    this.vistaActual = 21;
    //this.comunicacion.graficando.emit(false);
    this.router.navigateByUrl('graficas/paretos');
    
  }

getState(outlet)
  {
    return outlet.activatedRouteData.state;
  }

vista() 
  {
    if (this.vistaActual == 2) {
      this.vistaActual = 1;
      this.router.navigateByUrl('graficas/mttrgeneral'); 
    }
    else if (this.vistaActual == 1) {
      this.vistaActual = 2;
      this.router.navigateByUrl('graficas/mtbfgeneral'); 
    }
    else if (this.vistaActual == 12
      ) {
      this.vistaActual = 11;
      this.router.navigateByUrl('llamada/fallasgeneral');   
    }
    else if (this.vistaActual == 11
      ) {
      this.vistaActual = 12;
      this.router.navigateByUrl('llamada/responsables');   
    }
    let preferencias: any = {maquinasMapa: this.vistaActual == 1, fallasMapa: this.vistaActual == 11 }
    this.comunicacion.preferencias(preferencias); 
     preferencias = this.comunicacion.recuperarPreferencias();
  }

  buscar() 
  {
    this.verBuscar = !this.verBuscar;
  }


  filtrar() 
  {
    const dialogRef = this.dialog.open(DialogoFiltroComponent, {
      width: '650px', height: '650px', data: { accion: 0 }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.accion == 1) {
        this.comunicacion.aplicarFiltro.emit(this.vistaActual);
        this.toast('custom-class', 'Se empezará a aplicar el filtro en todas las gráficas ', 3000 );
      }
      else if (result.accion == 2) {
        this.comunicacion.aplicarFiltro.emit(this.vistaActual);
        this.toast('custom-class', 'Sólo se estará filtrando por fechas', 3000 );
      }
      else
      {
        this.toast('custom-class-red', 'No se aplicó el filtro ', 3000 );
      }
      this.comunicacion.mostrarNota.emit("");
    });
  }
 
  anterior() {
    this.comunicacion.cambiarGrafica.emit(this.vistaActual * -1);

  }

  siguiente() {
    this.comunicacion.cambiarGrafica.emit(this.vistaActual);

  }

  descargar_imagen() {
    this.comunicacion.guardarGrafica.emit(this.vistaActual);
  }
  descargar_data() {
    this.comunicacion.exportarGrafica.emit(this.vistaActual);
  }

  editar() 
  {
    const dialogRef = this.dialog.open(DialogoGraficaComponent, {
      width: '670px', height: '620px', data: { accion: 0 }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.accion >0) {
        this.comunicacion.aplicarFiltro.emit(this.vistaActual);
        this.toast('custom-class', 'La gráfica fue guardada satisfactoriamente', 3000 );
      }
      else if (result.accion == 0) {
        this.toast('custom-class-red', 'La gráfica no se guardó', 3000 );
      }
      });
      this.comunicacion.mostrarNota.emit("");
  }

  toast(clase: string, mensaje: string, duracion: number) {
    let config = new MatSnackBarConfig();
      config.panelClass = [clase];
      config.duration = duracion;
      config.verticalPosition='bottom';
      this.snackBar.open(mensaje, null, config);
  }

}

