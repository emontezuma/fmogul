import { Component, ViewChild, AfterContentInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MatIconRegistry } from '@angular/material/icon';
import { trigger, animate, style, group, query, transition } from "@angular/animations";
import { MatDialog } from '@angular/material';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { ComunicacionService } from './services/comunicacion.service';
import { DialogoCTComponent } from './dialogo-ct/dialogo-ct.component';
import { GestionApisService } from './services/gestion-apis.service';
import { DialogoCambioComponent } from './dialogo-cambio/dialogo-cambio.component';
import { DialogoConfiguracionComponent } from './dialogo-configuracion/dialogo-configuracion.component';
import { DialogoReproductorComponent } from './dialogo-reproductor/dialogo-reproductor.component';
import { InicioSesionComponent } from './inicio-sesion/inicio-sesion.component';
import { DialogoComponent } from './dialogo/dialogo.component';
import { LlamadasMmcallService } from './services/llamadas-mmcall.service';
import { ScrollDispatcher, CdkScrollable } from '@angular/cdk/scrolling';
import { Subscription } from 'rxjs';
import { DialogoHistoricoComponent } from './dialogo-historico/dialogo-historico.component';
import { CambioClaveComponent } from './cambio-clave/cambio-clave.component';
import { NuevaClaveComponent } from './nueva-clave/nueva-clave.component';
import { DialogoCancelarComponent } from './dialogo-cancelar/dialogo-cancelar.component';



export const routerTransition = trigger('routerTransition', [
  transition('* <=> *', [
    query(':enter, :leave', style({ position: 'absolute', width:'100%' })
      , { optional: true }),
    group([
      query(':enter', [
        style({ opacity: 0, transform: 'translateY(60px)' }),
        animate('0.5s ease-in-out', style({ opacity: 1, transform: 'translateY(0px)' }))
      ], { optional: true }),
      query(':leave', [
        style({ opacity: 1, transform: 'translateY(0px)' }),
        animate('0.5s ease-in-out', style({ opacity: 0, transform: 'translateY(60px)' }))
      ], { optional: true }),
    ])
  ])
])

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [ routerTransition ]
})

export class AppComponent implements AfterContentInit {
  
  constructor( private titleService: Title, public scroll: ScrollDispatcher, private router: Router, public snackBar: MatSnackBar, public dialog: MatDialog, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, private comunicacion: ComunicacionService, private gestionBD: GestionApisService, private llamadaMMCall: LlamadasMmcallService ) {
    
    
    if (this.soyDemo)
    {let diferencia = ((new Date("2019/02/01 23:59:59").getTime() - new Date().getTime()) / (1000 * 24 * 60 * 60)).toFixed(0);
    
    if (+diferencia<=0) {
      this.noUsar=true;
      const dialogRef = this.dialog.open(DialogoComponent, {
        disableClose: true, width: '570px', height: '250px', data: { botones: 1, cabecera: 'APLICACIÓN DEMOSTRATIVA', contenido: "El tiempo de la demostración ha expirado. Contacte al proveedor para su versión oficial", boton1: 'Aceptar', tipoMensaje: 'ALARMA' }
      });
      dialogRef.afterClosed().subscribe(result => {});
      {this.router.navigateByUrl('/home')} 
    }
    else if (+diferencia<10) {
        const dialogRef = this.dialog.open(DialogoComponent, {
          disableClose: true, width: '570px', height: '250px', data: { botones: 1, cabecera: 'APLICACIÓN DEMOSTRATIVA', contenido: "Restan " +  diferencia + " día(s) para culminar el tiempo de la demostración de esta aplicación. Contacte al proveedor para su versión oficial", boton1: 'Aceptar', tipoMensaje: 'ALARMA' }
        });
        dialogRef.afterClosed().subscribe(result => {});
      }

      
    }
    //se inicia con un cambia de turno
    this.titleService.setTitle( 'Gestión de mantenimiento' );
    this.scrollingSubscription = this.scroll
      .scrolled()
      .subscribe((data: CdkScrollable) => {
        this.miScroll(data);
      });

    //this.cTurno();
  router.events.subscribe((val) => {
    //Se valida que exista el usuario
    this.comunicacion.panelActual(0);
  })


    this.comunicacion.aChangeOver.subscribe((data: boolean)=>{this.opcion50()});
    this.comunicacion.activarSpinner.subscribe((data: any)=>{this.verProceso = data});
    this.comunicacion.mostrarNota.subscribe((data: any)=>{this.accion = data});
    this.comunicacion.mostrarEstado.subscribe((data: any)=>{this.estado = data});
    iconRegistry.addSvgIcon('propioVMapa', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/vistamapa.svg'));
    iconRegistry.addSvgIcon('propioVOperaciones', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/vistaoperaciones.svg'));
    iconRegistry.addSvgIcon('propioVobo', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/vobo.svg'));
    iconRegistry.addSvgIcon('propioBuscar', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/buscar.svg'));
    iconRegistry.addSvgIcon('propioOrdenar', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/ordenar.svg'));
    iconRegistry.addSvgIcon('propioOrdenarN', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/ordenarn.svg'));
    iconRegistry.addSvgIcon('propioRefrescar', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/refrescar.svg'));
    iconRegistry.addSvgIcon('propioMenu', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/hamburguesa.svg'));
    iconRegistry.addSvgIcon('propioReporte', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/reporte.svg'));
    iconRegistry.addSvgIcon('propioDemora', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/demora.svg'));
    iconRegistry.addSvgIcon('propioCaptura', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/captura.svg'));
    iconRegistry.addSvgIcon('propioCerrar', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/cerrar.svg'));
    iconRegistry.addSvgIcon('propioConfigurar', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/configurar.svg'));
    iconRegistry.addSvgIcon('propioGrafico', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/grafico.svg'));
    iconRegistry.addSvgIcon('propioPantalla', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/pantalla.svg'));
    iconRegistry.addSvgIcon('propioPlanta', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/planta.svg'));
    iconRegistry.addSvgIcon('propioUsuarios', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/usuarios.svg'));
    iconRegistry.addSvgIcon('propioUsuario', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/usuario.svg'));
    iconRegistry.addSvgIcon('propioPoliticas', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/politicas.svg'));
    iconRegistry.addSvgIcon('propioRoles', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/roles.svg'));
    iconRegistry.addSvgIcon('propioAdmin', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/administrador.svg'));
    iconRegistry.addSvgIcon('propioPies', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/pies.svg'));
    iconRegistry.addSvgIcon('propioLlamadas', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/llamadas.svg'));
    iconRegistry.addSvgIcon('propioAtenciones', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/atenciones.svg'));
    iconRegistry.addSvgIcon('propioCatalogos', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/catalogos.svg'));
    iconRegistry.addSvgIcon('propioOrganigrama', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/organigrama.svg'));
    iconRegistry.addSvgIcon('propioOperaciones', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/operaciones.svg'));
    iconRegistry.addSvgIcon('propioGrupos', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/grupos.svg'));
    iconRegistry.addSvgIcon('propioLineas', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/lineas.svg'));
    iconRegistry.addSvgIcon('propioLineas2', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/lineasapagadas.svg'));
    iconRegistry.addSvgIcon('propioReportes', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/reportes.svg'));
    iconRegistry.addSvgIcon('propioLineas', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/lineas.svg'));
    iconRegistry.addSvgIcon('propioDescargar', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/descargar.svg'));
    iconRegistry.addSvgIcon('propioUsuarios', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/usuarios.svg'));
    iconRegistry.addSvgIcon('propioLicencia', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/licencia.svg'));
    iconRegistry.addSvgIcon('propioLlamada', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/llamada.svg'));
    iconRegistry.addSvgIcon('propioDemo', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/demo.svg'));
    iconRegistry.addSvgIcon('propioCierre', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/cierre.svg'));
    iconRegistry.addSvgIcon('propioSoporte', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/soporte.svg'));
    iconRegistry.addSvgIcon('propioParametros', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/parametros.svg'));
    iconRegistry.addSvgIcon('propioTiposAtencion', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/tiposatencion.svg'));
    iconRegistry.addSvgIcon('propioPantallaConfigurar', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/pantallaconfigurar.svg'));
    iconRegistry.addSvgIcon('propioReporteMantenimiento', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/reportemantenimiento.svg'));
    iconRegistry.addSvgIcon('propioFallas', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/fallas.svg'));
    iconRegistry.addSvgIcon('propioAlarma', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/alarma.svg'));
    iconRegistry.addSvgIcon('propioRegresar', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/regresar.svg'));
    iconRegistry.addSvgIcon('propioIngenieria', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/regresar.svg'));
    iconRegistry.addSvgIcon('propioEnLlamada', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/enllamada.svg'));
    iconRegistry.addSvgIcon('propioConTecnico', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/contecnico.svg'));
    iconRegistry.addSvgIcon('propioConTecnicoAzul', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/contecnico2.svg'));
    iconRegistry.addSvgIcon('propioChange', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/changeover.svg'));
    iconRegistry.addSvgIcon('propioRespFalla', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/falla1.svg'));
    iconRegistry.addSvgIcon('propioReloj', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/reloj.svg'));
    iconRegistry.addSvgIcon('propioImpresora', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/impresora.svg'));
    iconRegistry.addSvgIcon('propioInfo', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/info.svg'));
    iconRegistry.addSvgIcon('propioReloj1', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/reloj1.svg'));
    iconRegistry.addSvgIcon('propioReloj2', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/reloj2.svg'));
    iconRegistry.addSvgIcon('propioLlamadaB', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/telefonoblanco.svg'));
    iconRegistry.addSvgIcon('propioFiltrar', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/filtrar.svg'));
    iconRegistry.addSvgIcon('propioIzq', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/izquierda.svg'));
    iconRegistry.addSvgIcon('propioDer', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/derecha.svg'));
    iconRegistry.addSvgIcon('propioDI', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/descargar_imagen.svg'));
    iconRegistry.addSvgIcon('propioDD', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/descargar_datos.svg'));
    iconRegistry.addSvgIcon('propioMTTR', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/mttr.svg'));
    iconRegistry.addSvgIcon('propioMTBF', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/mtbf.svg'));
    iconRegistry.addSvgIcon('propioTurno', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/id.svg'));
    iconRegistry.addSvgIcon('propioIrArriba', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/publish.svg'));
    iconRegistry.addSvgIcon('propioCelula', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/produccion.svg'));
    iconRegistry.addSvgIcon('propioAgregar', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/agregar.svg'));
    iconRegistry.addSvgIcon('propioQFiltro', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/quitarfiltro.svg'));
    iconRegistry.addSvgIcon('propioEGrafico', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/editargrafico.svg'));
    iconRegistry.addSvgIcon('propioGuardar', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/save.svg'));
    iconRegistry.addSvgIcon('propioCancelar', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/cancel.svg'));
    iconRegistry.addSvgIcon('propioMaquinas', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/maquinas.svg'));
    iconRegistry.addSvgIcon('propioAreas', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/areas.svg'));
    iconRegistry.addSvgIcon('propioTablas', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/tablas.svg'));
    iconRegistry.addSvgIcon('propioEliminar', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/delete.svg'));
    iconRegistry.addSvgIcon('propioNpartes', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/npartes.svg'));
    iconRegistry.addSvgIcon('propioInactivar', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/inactivar.svg'));
    iconRegistry.addSvgIcon('propioCopiar', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/copy.svg'));
    iconRegistry.addSvgIcon('propioiniPass', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/iniclave.svg'));
    iconRegistry.addSvgIcon('propioAbierto', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/candadoabierto.svg'));
    iconRegistry.addSvgIcon('propioCerrado', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/candadocerrado.svg'));
    iconRegistry.addSvgIcon('propioCerrarSesion', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/cerrarsesion.svg'));
    iconRegistry.addSvgIcon('propioVerClave', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/verclave.svg'));
    iconRegistry.addSvgIcon('propioPlay', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/reproductor.svg'));
    iconRegistry.addSvgIcon('propioPlayConfig', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/playConfig.svg'));
    iconRegistry.addSvgIcon('propioCambioUser', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/cambiouser.svg'));
    iconRegistry.addSvgIcon('propioCancelarReporte', sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/selreporte.svg'));
    if (this.comunicacion.rUsuario().id==0)
    {
      this.ventanaInicio();  
    }
}

  @ViewChild('barraIzquierda') sidenav: MatSidenav;
  version = "Versión: e1.65 2019/11/09";
  scrollingSubscription: Subscription
  title = 'Gestión de mantenimiento';
  verMenuSuperior: boolean = true;
  verPie: boolean = true;
  iconoCompania: string = "./assets/logo.jpg";
  iconoCronos: string = "./assets/cronos.png";
  verBarra: boolean = true;
  iconoHamburguesa: string = "propioMenu";
  iconoCandado: string = "propioCerrado";
  menuHamburguesaTT: string  = "Abrir panel de opciones";
  accion: string = "Gestión de mantenimiento ";
  estado: string = "";
  verIrArriba: boolean = false;
  offSet: number;
  irArribaTT: string = "Ir a la parte superior de la página"
  turnoActual: string = "N/A"
  usuarioActual: string = "No se ha iniciado sesión"
  intervalo: any;
  hayUsuario: boolean = false;
  noUsar: boolean = false;
  soyDemo: boolean = false;
  opcion: string = "";

  menuIzquierdo() {
    this.sidenav.mode ="push";
    this.sidenav.toggle();
    this.verBarra = !this.verBarra;
    if (this.verBarra){
      this.iconoHamburguesa="propioMenu";
      this.menuHamburguesaTT = "Abrir panel de opciones";
    }
    else {
      this.iconoHamburguesa="propioCerrar";
      this.menuHamburguesaTT = "Cerrar el panel de opciones";
    }
  }

  verProceso: boolean = false;

  opcion10() {
    this.sidenav.toggle();
    this.validarOpcion('/llamada');
    
  }

  opcion20() {
    this.sidenav.toggle();
    this.validarOpcion('/respuesta');
  }

  opcion30() {
    this.sidenav.toggle();
    this.validarOpcion('/panel');
  }

  opcion40() {
    this.sidenav.toggle();
    this.validarOpcion('/graficas');
  }
  
  getState(outlet){
    return outlet.activatedRouteData.state;
  }

  ngAfterContentInit() {
    this.buscarTurno();
    this.intervalo = setInterval(() => this.cada60Segundos(), 60000);
    this.sidenav.openedChange.subscribe((data)=>{this.opcionMenu(data)});
  }

  opcionMenu(opcion: boolean) {
    this.verBarra = !opcion;
    if (this.verBarra){
      this.iconoHamburguesa="propioMenu";
      this.menuHamburguesaTT = "Abrir panel de opciones";
    }
    else {
      this.iconoHamburguesa="propioCerrar";
      this.menuHamburguesaTT = "Cerrar el panel de opciones";
    }
  }

  irCronos() {
    window.open("http://www.mmcallmexico.mx/  ", "_blank");
  }

  anteTurno() {
    this.comunicacion.aObligar(false);

    //this.cTurno();
  }

  cTurno() {
    let esteTurno = 0;
    let campos={accion: 1006, secuencia: this.comunicacion.rTurno().secuencia};
    this.gestionBD.consultasBD(campos).subscribe((data: any)=>{
      if (data!=null) {
        esteTurno = data.id;
        this.cambiarTurno(esteTurno);  
      }
      else {
        let campos2={accion: 1006, secuencia: 0};
        this.gestionBD.consultasBD(campos2).subscribe((data: any)=>{
          esteTurno = data.id;
          this.cambiarTurno(esteTurno);  
      }) 
      }
    });
  }

  cambiarTurno(esteTurno: number) {
    this.comunicacion.mostrarNota.emit("CAMBIO DE TURNO");
    const dialogRef = this.dialog.open(DialogoCTComponent, {
      disableClose: true, width: '550px', height: '330px', data: { actTurno: esteTurno }
      });
    this.comunicacion.mostrarNota.emit("");
   dialogRef.afterClosed().subscribe(result => {
    this.opcion = "Turno actual: " + this.comunicacion.rTurno().referencia + " (" + this.comunicacion.rTurno().desde + " - " + this.comunicacion.rTurno().hasta + ") cambiado: " + this.comunicacion.convertirFecha(1, "", "dd-MM-yy hh:mm a") + ")"
   });       
  }

  cada60Segundos() {
    this.buscarTurno();
  }

  buscarTurno() {
    //Cada 30 segundos se evaluan algunas cosas
    let hora = this.comunicacion.convertirFecha(1,"","HH:mm:ss");
    let consulta2 = "SELECT * from turnos where estatus = 'A' AND (inicia <= '" + hora + "' or termina >= '" + hora + "') AND id <> " + this.comunicacion.rTurno().id + " ORDER BY secuencia";
    let camposcab={accion: 50300, consulta: consulta2};  
    this.gestionBD.consultasBD(camposcab).subscribe((data2: any []) =>{
      if (data2) {
        let hayUno = false;
        data2.forEach((elemento, index) => {
          if (hora >= elemento.inicia && hora <= elemento.termina)
          {
              hayUno= true;
            let miTurno={id: elemento.id, desde: elemento.inicia, hasta: elemento.termina, mover: elemento.mover, referencia: elemento.referencia, secuencia: elemento.secuencia };
            this.comunicacion.aTurno(miTurno);
            this.turnoActual = elemento.referencia;
            this.toast('custom-class', 'Se ha realizado un cambio de turno', 3000 );
          }
        })
        if (!hayUno)
          data2.forEach((elemento, index) => {
            if ((hora >= elemento.inicia || hora <= elemento.termina) && elemento.termina < elemento.inicia)
            {
              let miTurno={id: elemento.id, desde: elemento.inicia, hasta: elemento.termina, mover: elemento.mover, referencia: elemento.referencia, secuencia: elemento.secuencia };
              this.comunicacion.aTurno(miTurno);
              this.turnoActual = elemento.referencia;
              this.toast('custom-class', 'Se ha realizado un cambio de turno', 3000 );
            }
          })
      }
    });
  }

  opcion50() {

    this.validarOpcion('smed');
      
  }

  cancelarRep() {

    this.validarOpcion('cancelRep');
      
  }

  toast(clase: string, mensaje: string, duracion: number) {
    let config = new MatSnackBarConfig();
      config.panelClass = [clase];
      config.duration = duracion;
      config.verticalPosition='bottom';
      this.snackBar.open(mensaje, null, config);
  }

  SMS(datos: any, numero: number, total: number) {
    if (datos!="success"){
      const dialogRef = this.dialog.open(DialogoComponent, {
        width: '570px', height: '280px', data: { botones: 1, cabecera: 'EL MENSAJE NO SE ENVIÓ', contenido: "El mensaje no fue enviado al Pager seleccionado. El mensaje es el siguiente: '" + datos + "'. Pongase en contacto con el administrador de la aplicación", boton1: 'Aceptar', tipoMensaje: 'ALARMA' }
      });
      dialogRef.afterClosed().subscribe(result => {});
    }
    else
    {
        this.toast('custom-class', 'El mensaje (' + numero + ' de ' + total + ') ha sido enviado satisfactoriamente, por favor espere a la llegada del servicio', 3000 );
    }
  }

  configurar() {
    this.validarOpcion('configurar');
    
  }

  changeOver() {
    this.opcion50();
  }

  irArriba() {
    window.requestAnimationFrame(this.irArriba);
    document.querySelector('[cdkScrollable]').scrollTop = 0;    
  }

  miScroll(data: CdkScrollable) {
    const scrollTop = data.getElementRef().nativeElement.scrollTop || 0;
     if (scrollTop < 5) {
      this.verIrArriba = false
    }
     else {
      this.verIrArriba = true
    }

    this.offSet = scrollTop;
  }

  disponibilidad() {
    this.sidenav.toggle();
    this.validarOpcion('/paros');
  }
  
  pagers() {
    this.sidenav.toggle();
    this.validarOpcion('/pagers');
  }

  celulas() {
    this.sidenav.toggle();
    this.validarOpcion('/celulas');
  }
  partes() {
    this.sidenav.toggle();
    this.validarOpcion('/partes');
  }

  areas() {
    this.sidenav.toggle();
    this.validarOpcion('/areas');
  }

  fallas() {
    this.sidenav.toggle();
    this.validarOpcion('/fallas');
  }

  maquinas() {
    this.sidenav.toggle();
    this.validarOpcion('/maquinas');
  }

  turnos() {
    this.sidenav.toggle();
    this.validarOpcion('/turnos');
  }

  generales() {
    this.sidenav.toggle();
    this.validarOpcion('/tgenerales');
  }

  usuarios() {
    this.sidenav.toggle();
    this.validarOpcion('/usuarios');
  }

  politicas() {
    this.sidenav.toggle();
    this.validarOpcion('/politicas');
  }

  roles() {
    this.sidenav.toggle();
    this.validarOpcion('/roles');
  }

  historico() {
    this.validarOpcion('historico');
    
  }


  validarOpcion(url: string)
  {
    let volverValidar: boolean = false;
    if (this.sidenav.opened) {
      this.sidenav.toggle()
    };
    if (this.noUsar)
    {
      const dialogRef = this.dialog.open(DialogoComponent, {
        disableClose: true, width: '570px', height: '280px', data: { botones: 1, cabecera: 'APLICACIÓN DEMOSTRATIVA', contenido: "El tiempo de la demostración ha expirado. Contacte al proveedor para su versión oficial", boton1: 'Aceptar', tipoMensaje: 'ALARMA' }
      });
      dialogRef.afterClosed().subscribe(result => {});
      {this.router.navigateByUrl('/home')} 
    
    }
    else
    {

    
    if (this.comunicacion.rUsuario().id == 0)
    {
      const dialogRef = this.dialog.open(InicioSesionComponent, {
      disableClose: true, width: '400px', height: '440px', data: { accion: 0, anunciar: 0 }
      });
      this.comunicacion.mostrarNota.emit("Inicio de sesión");
      dialogRef.afterClosed().subscribe(result => {
      
      if (!result) {
        this.toast('custom-class-red', 'La sesión no se inició', 3000 );
        this.router.navigateByUrl('home');
      }
      else if (result.accion ==0) {
        this.toast('custom-class-red', 'La sesión no se inició', 3000 );
        this.router.navigateByUrl('home');
      }
      else if(result.accion == 2)
      {
        const dialogRef = this.dialog.open(NuevaClaveComponent, {
          width: '400px', height: '370px', data: { accion: 0 }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result.accion==0)
          {this.toast('custom-class-red', 'La sesión no se inició', 3000 );
          this.router.navigateByUrl('home');
          }
          else if (result.accion==1)
          {
            this.continuarValidacion(url);
          }
      })
      }
      else if(result.accion == 3)
      {
        this.toast('custom-class', 'Su contraseña ha cadudado, por favor cambiela', 3000 );
        const dialogRef = this.dialog.open(CambioClaveComponent, {
          disableClose: true, width: '400px', height: '460px', data: { accion: 0 }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result.accion==0)
          {this.toast('custom-class-red', 'La contraseña no se cambió', 3000 );
          this.comunicacion.aUsuario({id: 0, nombre: "", rol: 0, politica: 0, admin: "N", tecnico: ""})
          this.router.navigateByUrl('home');
          }
          else if (result.accion==1)
          {
            this.toast('custom-class', 'La contraseña se cambió exitosamente', 3000 )
            this.continuarValidacion(url);
          }
      })
      }
      else
      {
        if(result.anunciar > 0)
        {
          this.toast('custom-class', 'Su contraseña se vencerá en ' + result.anunciar + ' día(s). Vaya por favor a la opción de cambio de contraseña y cambiela', 5000)
        }
        this.hayUsuario = true;
        this.usuarioActual=this.comunicacion.rUsuario().nombre;
        this.iconoCandado = "propioAbierto"
        if (this.comunicacion.rUsuario().admin != "S")
            {
              let consulta2 = "SELECT * from permisos where id = " + this.comunicacion.rUsuario().rol + " limit 1"
              let camposcab={accion: 50100, consulta: consulta2};  
              this.gestionBD.consultasBD(camposcab).subscribe((data2: any) =>{
                let validado: boolean = false;
                let yaError: Boolean = false;
                if (!data2) {
                  this.toast('custom-class-red', 'Este usuario NO está asociado a ningún rol. Contacte al administrador de la aplicación', 3000 );
                  this.router.navigateByUrl('home');
                  yaError=true;
                }
                else 
                {
                  if (data2.llamada== "S" && url=="/llamada") {
                  validado=true;
                  }
                  else if (data2.atencion== "S" && url=="/respuesta") {
                    validado=true;
                  }
                  else if (data2.panel== "S" && url=="/panel") {
                    validado=true;
                  }
                  else if (data2.graficas== "S" && url=="/graficas") {
                    validado=true;
                  }
                  else if (data2.catalogos.substr(0,1)== "S" && url=="/celulas") {
                    validado=true;
                  }
                  else if (data2.catalogos.substr(1,1)== "S" && url=="/maquinas") {
                    validado=true;
                  }
                  else if (data2.catalogos.substr(2,1)== "S" && url=="/areas") {
                    validado=true;
                  }
                  else if (data2.catalogos.substr(3,1)== "S" && url=="/fallas") {
                    validado=true;
                  }
                  else if (data2.catalogos.substr(4,1)== "S" && url=="/tgenerales") {
                    validado=true;
                  }
                  else if (data2.catalogos.substr(5,1)== "S" && url=="/paros") {
                    validado=true;
                  }
                  else if (data2.catalogos.substr(6,1)== "S" && url=="/pagers") {
                    validado=true;
                  }
                  else if (data2.catalogos.substr(7,1)== "S" && url=="/partes") {
                    validado=true;
                  }
                  else if (data2.catalogos.substr(8,1)== "S" && url=="/turnos") {
                    validado=true;
                  }
                  else if (data2.configuracion.substr(0,1)== "S" && url=="/usuarios") {
                    validado=true;
                  }
                  else if (data2.configuracion.substr(1,1)== "S" && url=="/politicas") {
                    validado=true;
                  }
                  else if (data2.configuracion.substr(2,1)== "S" && url=="/roles") {
                    validado=true;
                  }
                  else if (data2.configuracion.substr(5,1)== "S" && url=="configurarPlay") {
                    validado=true;
                  }
                  else if (data2.configuracion.substr(6,1)== "S" && url=="cancelRep") {
                    validado=true;
                  }
                  else if (data2.configuracion.substr(3,1)== "S" && url=="configurar") {
                    validado=true;
                  }
                  else if (data2.reportes.substr(0,1)== "S" && url=="historico") {
                    validado=true;
                  }
                  else if (data2.smed== "S" && url=="smed") {
                    validado=true;
                  }
                }
              
                if (validado) 
                {
                  if (url=="smed")
                  {
                    const dialogRef = this.dialog.open(DialogoCambioComponent, {
                      disableClose: true, width: '570px', height: '600px', data: { accion: 0 }
                    });
                    this.comunicacion.mostrarNota.emit("Especifique los datos para el mensaje de SMED/Changeover");
                    dialogRef.afterClosed().subscribe(result => {
                      
                      if (!result) {
                        this.toast('custom-class-red', 'El mensaje de SMED NO se generó', 3000 );
                      }
                      else if (result.accion ==0) {
                        this.toast('custom-class-red', 'El mensaje de SMED NO se generó', 3000 );
                      }
                      else if (!result.pager) {
                        this.toast('custom-class-red', 'El mensaje de SMED NO se generó', 3000 );
                        }
                        else
                        {
                          if (result.pager.length>0){
                            result.pager.forEach((pager, index) => {
                              let campos : any = {accion: 5, unipager: pager, parte: result.parte, detalle: result.detalle, maquina: result.maquina, solicitante: this.comunicacion.rUsuario().id, modificado: this.comunicacion.convertirFecha(1,'', 'yyyy-MM-dd HH:mm:ss') }; 
                              this.gestionBD.escribirBD(campos).subscribe((data: any)=>{console.log(data);});
                              this.llamadaMMCall.llamadaMMCall(campos).subscribe((data)=>{this.SMS(data, index + 1, result.pager.length)});
                            })
                          //de prueba a producción
                          //this.SMS("success", 1, 1);        
                        }
                        else
                        {
                          this.toast('custom-class-red', 'El mensaje de SMED NO se generó', 3000 );
                        }
                      }
                      this.comunicacion.mostrarNota.emit("");
                    
                    });
                  }
                  else if (url=="configurar")
                  {
                    const dialogRef = this.dialog.open(DialogoConfiguracionComponent, {
                      width: '600px', height: '600px', data: { accion: 0 }
                    });
                    dialogRef.afterClosed().subscribe(result => {
                      if (result.accion == 1) {
                        this.toast('custom-class', 'Los parámetros fueron guardados satisfactoriamente', 3000 );
                      }
                      else if (result.accion == 0) {
                        this.toast('custom-class-red', 'Los parámetros no se modificaron', 3000 );
                      }
                    })
                    }
                    else if (url=="configurarPlay")
                    {
                      const dialogRef = this.dialog.open(DialogoReproductorComponent, {
                        width: '600px', height: '500px', data: { accion: 0 }
                      });
                      dialogRef.afterClosed().subscribe(result => {
                        if (result.accion == 1) {
                          this.toast('custom-class', 'Los parámetros fueron guardados satisfactoriamente', 3000 );
                        }
                        else if (result.accion == 0) {
                          this.toast('custom-class-red', 'Los parámetros no se modificaron', 3000 );
                        }
                      })
                      }
                    else if (url=="historico")
                    {
                      const dialogRef = this.dialog.open(DialogoHistoricoComponent, {
                        width: '600px', height: '280px', data: { accion: 0 }
                      });
                      dialogRef.afterClosed().subscribe(result => {
                        if (result.accion == 1) {
                        }
                        else if (result.accion == 0) {
                        }
                      });
                    }
                    else if (url=="cancelRep")
                    {
                      const dialogRef = this.dialog.open(DialogoCancelarComponent, {
                        width: '600px', height: '600px', data: { accion: 0 }
                      });
                      dialogRef.afterClosed().subscribe(result => {
                        if (result.accion == 1) {
                        }
                        else if (result.accion == 0) {
                        }
                      });
                    }
                  else
                  {
                  this.router.navigateByUrl(url);
                  }
                }
                else if (!yaError) {
                  this.toast('custom-class-red', 'No tiene acceso a esta funcionalidad. Contacte al administrador de la aplicación', 3000 );
                  this.router.navigateByUrl('home');
                }
              });
            }
            else
            {
              if (url=="smed")
              {
                const dialogRef = this.dialog.open(DialogoCambioComponent, {
                  disableClose: true, width: '570px', height: '600px', data: { accion: 0 }
                });
                this.comunicacion.mostrarNota.emit("Especifique los datos para el mensaje de SMED/Changeover");
                dialogRef.afterClosed().subscribe(result => {
                  
                  if (!result) {
                    this.toast('custom-class-red', 'El mensaje de SMED NO se generó', 3000 );
                  }
                  else if (result.accion ==0) {
                    this.toast('custom-class-red', 'El mensaje de SMED NO se generó', 3000 );
                  }
                  else if (!result.pager) {
                    this.toast('custom-class-red', 'El mensaje de SMED NO se generó', 3000 );
                    }
                    else
                    {
                      if (result.pager.length>0){
                        result.pager.forEach((pager, index) => {
                          let campos : any = {accion: 5, unipager: pager, parte: result.parte, detalle: result.detalle, maquina: result.maquina, solicitante: this.comunicacion.rUsuario().id, modificado: this.comunicacion.convertirFecha(1,'', 'yyyy-MM-dd HH:mm:ss') }; 
                          this.gestionBD.escribirBD(campos).subscribe((data: any)=>{console.log(data);});
                          this.llamadaMMCall.llamadaMMCall(campos).subscribe((data)=>{this.SMS(data, index + 1, result.pager.length)});
                        })
                      //de prueba a producción
                      //this.SMS("success", 1, 1);        
                    }
                    else
                    {
                      this.toast('custom-class-red', 'El mensaje de SMED NO se generó', 3000 );
                    }
                  }
                  this.comunicacion.mostrarNota.emit("");
                
                });
              }
              else if (url=="configurar")
              {
                const dialogRef = this.dialog.open(DialogoConfiguracionComponent, {
                  width: '600px', height: '600px', data: { accion: 0 }
                });
                dialogRef.afterClosed().subscribe(result => {
                  if (result.accion == 1) {
                    this.toast('custom-class', 'Los parámetros fueron guardados satisfactoriamente', 3000 );
                  }
                  else if (result.accion == 0) {
                    this.toast('custom-class-red', 'Los parámetros no se modificaron', 3000 );
                  }
                })
                }
                else if (url=="configurarPlay")
                    {
                      const dialogRef = this.dialog.open(DialogoReproductorComponent, {
                        width: '600px', height: '500px', data: { accion: 0 }
                      });
                      dialogRef.afterClosed().subscribe(result => {
                        if (result.accion == 1) {
                          this.toast('custom-class', 'Los parámetros fueron guardados satisfactoriamente', 3000 );
                        }
                        else if (result.accion == 0) {
                          this.toast('custom-class-red', 'Los parámetros no se modificaron', 3000 );
                        }
                      })
                      }
                else if (url=="historico")
                {
                  const dialogRef = this.dialog.open(DialogoHistoricoComponent, {
                    width: '600px', height: '280px', data: { accion: 0 }
                  });
                  dialogRef.afterClosed().subscribe(result => {
                    if (result.accion == 1) {
                    }
                    else if (result.accion == 0) {
                    }
                  });
                }
                else if (url=="cancelRep")
                    {
                      const dialogRef = this.dialog.open(DialogoCancelarComponent, {
                        width: '600px', height: '600px', data: { accion: 0 }
                      });
                      dialogRef.afterClosed().subscribe(result => {
                        if (result.accion == 1) {
                        }
                        else if (result.accion == 0) {
                        }
                      });
                    }
              else
              {
              this.router.navigateByUrl(url);
              }
            }
      }
      });
      
    }
    else 
    {
      this.continuarValidacion(url)
    }
  }
  }
  
  continuarValidacion(url)
      {
        this.hayUsuario = true;
        this.usuarioActual=this.comunicacion.rUsuario().nombre;
        this.iconoCandado = "propioAbierto"
        
        if (this.comunicacion.rUsuario().admin != "S")
            {
              let consulta2 = "SELECT * from permisos where id = " + this.comunicacion.rUsuario().rol + " limit 1"
              let camposcab={accion: 50100, consulta: consulta2};  
              this.gestionBD.consultasBD(camposcab).subscribe((data2: any) =>{
                let validado: boolean = false;
                let yaError: Boolean = false;
                if (!data2) {
                  this.toast('custom-class-red', 'Este usuario NO está asociado a ningún rol. Contacte al administrador de la aplicación', 3000 );
                  this.router.navigateByUrl('home');
                  yaError=true;
                }
                else 
                {
                  if (data2.llamada== "S" && url=="/llamada") {
                  validado=true;
                  }
                  else if (data2.atencion== "S" && url=="/respuesta") {
                    validado=true;
                  }
                  else if (data2.panel== "S" && url=="/panel") {
                    validado=true;
                  }
                  else if (data2.graficas== "S" && url=="/graficas") {
                    validado=true;
                  }
                  else if (data2.catalogos.substr(0,1)== "S" && url=="/celulas") {
                    validado=true;
                  }
                  else if (data2.catalogos.substr(1,1)== "S" && url=="/maquinas") {
                    validado=true;
                  }
                  else if (data2.catalogos.substr(2,1)== "S" && url=="/areas") {
                    validado=true;
                  }
                  else if (data2.catalogos.substr(3,1)== "S" && url=="/fallas") {
                    validado=true;
                  }
                  else if (data2.catalogos.substr(4,1)== "S" && url=="/tgenerales") {
                    validado=true;
                  }
                  else if (data2.catalogos.substr(5,1)== "S" && url=="/paros") {
                    validado=true;
                  }
                  else if (data2.catalogos.substr(6,1)== "S" && url=="/pagers") {
                    validado=true;
                  }
                  else if (data2.catalogos.substr(7,1)== "S" && url=="/partes") {
                    validado=true;
                  }
                  else if (data2.catalogos.substr(8,1)== "S" && url=="/turnos") {
                    validado=true;
                  }
                  else if (data2.configuracion.substr(0,1)== "S" && url=="/usuarios") {
                    validado=true;
                  }
                  else if (data2.configuracion.substr(1,1)== "S" && url=="/politicas") {
                    validado=true;
                  }
                  else if (data2.configuracion.substr(2,1)== "S" && url=="/roles") {
                    validado=true;
                  }
                  else if (data2.configuracion.substr(5,1)== "S" && url=="configurarPlay") {
                    validado=true;
                  }
                  else if (data2.configuracion.substr(6,1)== "S" && url=="cancelRep") {
                    validado=true;
                  }
                  else if (data2.configuracion.substr(3,1)== "S" && url=="configurar") {
                    validado=true;
                  }
                  else if (data2.reportes.substr(0,1)== "S" && url=="historico") {
                    validado=true;
                  }
                  else if (data2.smed== "S" && url=="smed") {
                    validado=true;
                  }
                }
              
                if (validado) 
                {
                  if (url=="smed")
                  {
                    const dialogRef = this.dialog.open(DialogoCambioComponent, {
                      disableClose: true, width: '570px', height: '600px', data: { accion: 0 }
                    });
                    this.comunicacion.mostrarNota.emit("Especifique los datos para el mensaje de SMED/Changeover");
                    dialogRef.afterClosed().subscribe(result => {
                      
                      if (!result) {
                        this.toast('custom-class-red', 'El mensaje de SMED NO se generó', 3000 );
                      }
                      else if (result.accion ==0) {
                        this.toast('custom-class-red', 'El mensaje de SMED NO se generó', 3000 );
                      }
                      else if (!result.pager) {
                        this.toast('custom-class-red', 'El mensaje de SMED NO se generó', 3000 );
                        }
                        else
                        {
                          if (result.pager.length>0){
                            result.pager.forEach((pager, index) => {
                              let campos : any = {accion: 5, unipager: pager, parte: result.parte, detalle: result.detalle, maquina: result.maquina, solicitante: this.comunicacion.rUsuario().id, modificado: this.comunicacion.convertirFecha(1,'', 'yyyy-MM-dd HH:mm:ss') }; 
                              this.gestionBD.escribirBD(campos).subscribe((data: any)=>{console.log(data);});
                              this.llamadaMMCall.llamadaMMCall(campos).subscribe((data)=>{this.SMS(data, index + 1, result.pager.length)});
                            })
                          //de prueba a producción
                          //this.SMS("success", 1, 1);        
                        }
                        else
                        {
                          this.toast('custom-class-red', 'El mensaje de SMED NO se generó', 3000 );
                        }
                      }
                      this.comunicacion.mostrarNota.emit("");
                    
                    });
                  }
                  else if (url=="configurar")
                  {
                    const dialogRef = this.dialog.open(DialogoConfiguracionComponent, {
                      width: '600px', height: '600px', data: { accion: 0 }
                    });
                    dialogRef.afterClosed().subscribe(result => {
                      if (result.accion == 1) {
                        this.toast('custom-class', 'Los parámetros fueron guardados satisfactoriamente', 3000 );
                      }
                      else if (result.accion == 0) {
                        this.toast('custom-class-red', 'Los parámetros no se modificaron', 3000 );
                      }
                    })
                    }
                    else if (url=="configurarPlay")
                    {
                      const dialogRef = this.dialog.open(DialogoReproductorComponent, {
                        width: '600px', height: '500px', data: { accion: 0 }
                      });
                      dialogRef.afterClosed().subscribe(result => {
                        if (result.accion == 1) {
                          this.toast('custom-class', 'Los parámetros fueron guardados satisfactoriamente', 3000 );
                        }
                        else if (result.accion == 0) {
                          this.toast('custom-class-red', 'Los parámetros no se modificaron', 3000 );
                        }
                      })
                      }
                    else if (url=="historico")
                    {
                      const dialogRef = this.dialog.open(DialogoHistoricoComponent, {
                        width: '600px', height: '280px', data: { accion: 0 }
                      });
                      dialogRef.afterClosed().subscribe(result => {
                        if (result.accion == 1) {
                        }
                        else if (result.accion == 0) {
                        }
                      });}
                      else if (url=="cancelRep")
                    {
                      const dialogRef = this.dialog.open(DialogoCancelarComponent, {
                        width: '600px', height: '600px', data: { accion: 0 }
                      });
                      dialogRef.afterClosed().subscribe(result => {
                        if (result.accion == 1) {
                        }
                        else if (result.accion == 0) {
                        }
                      });
                    }
                  else
                  {
                  this.router.navigateByUrl(url);
                  }
                }
                else if (!yaError) {
                  this.toast('custom-class-red', 'No tiene acceso a esta funcionalidad. Contacte al administrador de la aplicación', 3000 );
                  this.router.navigateByUrl('home');
                }
              });
            }
          else {

            if (url=="smed")
            {
              const dialogRef = this.dialog.open(DialogoCambioComponent, {
                disableClose: true, width: '570px', height: '600px', data: { accion: 0 }
              });
              this.comunicacion.mostrarNota.emit("Especifique los datos para el mensaje de SMED/Changeover");
              dialogRef.afterClosed().subscribe(result => {
                
                if (!result) {
                  this.toast('custom-class-red', 'El mensaje de SMED NO se generó', 3000 );
                }
                else if (result.accion ==0) {
                  this.toast('custom-class-red', 'El mensaje de SMED NO se generó', 3000 );
                }
                else if (!result.pager) {
                  this.toast('custom-class-red', 'El mensaje de SMED NO se generó', 3000 );
                  }
                  else
                  {
                    if (result.pager.length>0){
                      result.pager.forEach((pager, index) => {
                        let campos : any = {accion: 5, unipager: pager, parte: result.parte, detalle: result.detalle, maquina: result.maquina, solicitante: this.comunicacion.rUsuario().id, modificado: this.comunicacion.convertirFecha(1,'', 'yyyy-MM-dd HH:mm:ss') }; 
                        this.gestionBD.escribirBD(campos).subscribe((data: any)=>{console.log(data);});
                        this.llamadaMMCall.llamadaMMCall(campos).subscribe((data)=>
                        {this.SMS(data, index + 1, result.pager.length)
                        });
                      })
                    //de prueba a producción
                    //this.SMS("success", 1, 1);        
                  }
                  else
                  {
                    this.toast('custom-class-red', 'El mensaje de SMED NO se generó', 3000 );
                  }
                }
                this.comunicacion.mostrarNota.emit("");
              
              });
            }
            else if (url=="configurar")
            {
              const dialogRef = this.dialog.open(DialogoConfiguracionComponent, {
                width: '600px', height: '600px', data: { accion: 0 }
              });
              dialogRef.afterClosed().subscribe(result => {
                if (result.accion == 1) {
                  this.toast('custom-class', 'Los parámetros fueron guardados satisfactoriamente', 3000 );
                }
                else if (result.accion == 0) {
                  this.toast('custom-class-red', 'Los parámetros no se modificaron', 3000 );
                }
              })
              }
              else if (url=="configurarPlay")
              {
                const dialogRef = this.dialog.open(DialogoReproductorComponent, {
                  width: '600px', height: '500px', data: { accion: 0 }
                });
                dialogRef.afterClosed().subscribe(result => {
                  if (result.accion == 1) {
                    this.toast('custom-class', 'Los parámetros fueron guardados satisfactoriamente', 3000 );
                  }
                  else if (result.accion == 0) {
                    this.toast('custom-class-red', 'Los parámetros no se modificaron', 3000 );
                  }
                })
                }
              else if (url=="historico")
              {
                const dialogRef = this.dialog.open(DialogoHistoricoComponent, {
                  width: '600px', height: '280px', data: { accion: 0 }
                });
                dialogRef.afterClosed().subscribe(result => {
                  if (result.accion == 1) {
                  }
                  else if (result.accion == 0) {
                  }
                });}
                else if (url=="cancelRep")
                    {
                      const dialogRef = this.dialog.open(DialogoCancelarComponent, {
                        width: '600px', height: '600px', data: { accion: 0 }
                      });
                      dialogRef.afterClosed().subscribe(result => {
                        if (result.accion == 1) {
                        }
                        else if (result.accion == 0) {
                        }
                      });
                    }
            else
            {
            this.router.navigateByUrl(url);
            }
          }
      }
   
  cerrarSesion() {
      const dialogRef = this.dialog.open(DialogoComponent, {
        width: '570px', height: '270px', data: { botones: 2, cabecera: 'CERRAR SESION', contenido: 'Esta acción cerrará su sesión en la aplicación. ¿Está seguro de esta acción?', boton1: 'Si, cerraré mi sesión', boton2: 'No, lo pensaré mejor', tipoMensaje: 'ALARMA' }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (!result)
        {
        }
        else if (result == 1)
        {
          let fecha = this.comunicacion.convertirFecha(1,"","yyyy/MM/dd HH:mm:ss");
          let consulta1 = "update usuarios set ultmasalida = '" + fecha + "' WHERE id = " + this.comunicacion.rUsuario().id;
          let camposcab={accion: 50030, consulta: consulta1};  
          this.gestionBD.escribirBD(camposcab).subscribe((data: any) =>{
            dialogRef.close();
            this.hayUsuario=false;
            this.comunicacion.aUsuario({id: 0, nombre: "", rol: 0, politica: 0, admin: "", tecnico: ""});
            this.usuarioActual = "No se ha iniciado sesión"
            this.iconoCandado = "propioCerrado";
            this.toast('custom-class', 'La sesión ha finalizado', 3000 );
            this.router.navigateByUrl('home');
          });
        }
      
    })
    }

    cambioClave()
    {
      const dialogRef = this.dialog.open(CambioClaveComponent, {
        disableClose: true, width: '400px', height: '460px', data: { accion: 0 }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (!result)
          {
          }
          else if (result.accion == 1)
          {
              this.toast('custom-class', 'Se ha cambiado la contraseña satisfactoriamente', 3000 );
          }
        
      })
      }

      reproducir()
      {
        this.sidenav.toggle();
       //alert('Esta opción no está disponible en modo demo')
      this.router.navigateByUrl("/reproductor");

      }

      configurarPlay()

      {
        this.validarOpcion('configurarPlay');
      }

ventanaInicio()
  {
    const dialogRef = this.dialog.open(InicioSesionComponent, {
    disableClose: true, width: '400px', height: '440px', data: { accion: 0, anunciar: 0 }
    });
    this.comunicacion.mostrarNota.emit("Inicio de sesión");
    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        this.toast('custom-class-red', 'La sesión no se inició', 3000 );
        this.router.navigateByUrl('home');
      }
      else if (result.accion ==0) {
        this.toast('custom-class-red', 'La sesión no se inició', 3000 );
        this.router.navigateByUrl('home');
      }
      else if(result.accion == 2)
      {
        const dialogRef = this.dialog.open(NuevaClaveComponent, {
          width: '400px', height: '370px', data: { accion: 0 }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result.accion==0)
          {this.toast('custom-class-red', 'La sesión no se inició', 3000 );
          this.router.navigateByUrl('home');
          }
      })
      }
      else if(result.accion == 3)
      {
        this.toast('custom-class', 'Su contraseña ha cadudado, por favor cambiela', 3000 );
        const dialogRef = this.dialog.open(CambioClaveComponent, {
          disableClose: true, width: '400px', height: '460px', data: { accion: 0 }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result.accion==0)
          {this.toast('custom-class-red', 'La contraseña no se cambió', 3000 );
          this.comunicacion.aUsuario({id: 0, nombre: "", rol: 0, politica: 0, admin: "N", tecnico: ""})
          this.router.navigateByUrl('home');
          }
          else if (result.accion==1)
          {

            this.toast('custom-class', 'La contraseña se cambió exitosamente', 3000 )
            this.hayUsuario = true;
            this.usuarioActual=this.comunicacion.rUsuario().nombre;
            this.iconoCandado = "propioAbierto"
          }
      })
      }
      else
      {
        if(result.anunciar > 0)
        {
          this.toast('custom-class', 'Su contraseña se vencerá en ' + result.anunciar + ' día(s). Vaya por favor a la opción de cambio de contraseña y cambiela', 5000)
        }
        this.hayUsuario = true;
        this.usuarioActual=this.comunicacion.rUsuario().nombre;
        this.iconoCandado = "propioAbierto"
      }
    })
  }   

  cambioUsuario()
  {
    const dialogRef = this.dialog.open(InicioSesionComponent, {
    disableClose: true, width: '400px', height: '440px', data: { accion: 0, anunciar: 0 }
    });
    this.comunicacion.mostrarNota.emit("Inicio de sesión");
    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        this.toast('custom-class-red', 'No se realizó el cambio de usuario', 3000 );
        this.router.navigateByUrl('home');
      }
      else if (result.accion ==0) {
        this.toast('custom-class-red', 'No se realizó el cambio de usuario', 3000 );
        this.router.navigateByUrl('home');
      }
      else if(result.accion == 2)
      {
        const dialogRef = this.dialog.open(NuevaClaveComponent, {
          width: '400px', height: '370px', data: { accion: 0 }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result.accion==0)
          {this.toast('custom-class-red', 'No se realizó el cambio de usuario', 3000 );
          this.router.navigateByUrl('home');
          }
      })
      }
      else if(result.accion == 3)
      {
        this.toast('custom-class', 'Su contraseña ha cadudado, por favor cambiela', 3000 );
        const dialogRef = this.dialog.open(CambioClaveComponent, {
          disableClose: true, width: '400px', height: '460px', data: { accion: 0 }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result.accion==0)
          {this.toast('custom-class-red', 'La contraseña no se cambió', 3000 );
          this.comunicacion.aUsuario({id: 0, nombre: "", rol: 0, politica: 0, admin: "N", tecnico: ""})
          this.router.navigateByUrl('home');
          }
          else if (result.accion==1)
          {
            this.toast('custom-class', 'La contraseña se cambió exitosamente', 3000 )
            this.hayUsuario = true;
            this.usuarioActual=this.comunicacion.rUsuario().nombre;
            this.iconoCandado = "propioAbierto"
            this.router.navigateByUrl('home');
          }
      })
      }
      else
      {
        if(result.anunciar > 0)
        {
          this.toast('custom-class', 'Su contraseña se vencerá en ' + result.anunciar + ' día(s). Vaya por favor a la opción de cambio de contraseña y cambiela', 5000)
        }
        this.hayUsuario = true;
        this.usuarioActual=this.comunicacion.rUsuario().nombre;
        this.iconoCandado = "propioAbierto"
        this.router.navigateByUrl('home');
      }
    })
  }   

}
