import { Injectable, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common'
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ComunicacionService {


private miGrafica = new Subject<string>();
reproduccion$ = this.miGrafica.asObservable();

private miImagenes = new Subject<string>();
reproduccionImagen$ = this.miImagenes.asObservable();

private celulaSeleccion: any = {id: 0};
private maquinaSeleccion: any = {id: 0};
private areaSeleccion: any = {id: 0};
private fallaSeleccion: any = {id: 0};
private mostrarTodos: boolean = false;
private preMostrarTodos: number = 0;
private preMostrarTodosArea: number = 0;
private obligarCT: boolean = true;
private verMarquesina: boolean = true;
private tablaF: number = 0;
private consulta: number = 0;
private preferenciasUsuario: any = {maquinasMapa: true, fallasMapa: true}
private iconoD: string = "propioVobo";
private filtroDesde: Date;
private filtroHasta: Date;
private gActual: number = 0;
private filtroAdic: string = "";
private usuarioActual: any = {id: 0, nombre: "", rol: 0, politica: 0, admin: "", tecnico: ""};
private tecnicoActual: any = {id: 0, nombre: ""};
private turnoActual: any = {id: 0, desde: "", hasta: "", mover: "I", referencia: "", secuencia: 0 };
private AlarmaPanel: number = 1;
private panelSeleccionado: number = 1;
private laImagen: string = "";
private edoImagen: string = "in";
private verImagen01: boolean = false;

  constructor(public datepipe: DatePipe ) { }
    activarSpinner = new EventEmitter<boolean>();
    irAlTop = new EventEmitter<boolean>();
    enfocar = new EventEmitter<boolean>();
    llamadasVista = new EventEmitter<number>();
    llamadasVistaMapa = new EventEmitter<number>();
    llamadasVistaGrafica = new EventEmitter<number>();
    llamadasVistaPanel = new EventEmitter<number>();
    mostrarPagina = new EventEmitter<number>();
    mostrarPaginaPanel = new EventEmitter<number>();
    mostrarNota = new EventEmitter<string>();
    mostrarEstado = new EventEmitter<string>();
    aplicarFiltroCelula = new EventEmitter<string>();
    aplicarFiltroCelulaPanel = new EventEmitter<string>();
    cambiarEstadoImagen = new EventEmitter<string>();
    aplicarFiltroMaquinaPanel = new EventEmitter<string>();
    aplicarFiltroAreaPanel = new EventEmitter<string>();
    aplicarFiltroMaquina = new EventEmitter<string>();
    aplicarFiltroArea = new EventEmitter<string>();
    aplicarFiltroFalla = new EventEmitter<string>();
    aplicarFiltroxAtender = new EventEmitter<string>();
    aplicarFiltroxReparar = new EventEmitter<string>();
    seleccionMaquina = new EventEmitter<number>();
    verSoloAlarmaPanel = new EventEmitter<number>();
    seleccionCelula = new EventEmitter<number>();
    seleccionResponsable = new EventEmitter<number>();
    seleccionFalla = new EventEmitter<number>();
    iraPagina = new EventEmitter<number>();
    actualizarOpciones = new EventEmitter<any>();
    aChangeOver = new EventEmitter<boolean>();
    refrescarCelulas = new EventEmitter<any>();
    refrescarAreas = new EventEmitter<any>();
    refrescarMaquinas = new EventEmitter<any>();
    refrescarCelulasPanel = new EventEmitter<number>();
    refrescarxAtender = new EventEmitter<any>();
    refrescarxReparar = new EventEmitter<any>();
    refrescarFallas = new EventEmitter<any>();
    cambiarGrafica = new EventEmitter<number>();
    cambiarImagen = new EventEmitter<string>();
    graficando = new EventEmitter<boolean>();
    guardarGrafica = new EventEmitter<number>();
    reproduccionMTTR = new EventEmitter<boolean>();
    reproduccionMTBF = new EventEmitter<boolean>();
    reproduccionPareto = new EventEmitter<boolean>();
    descargarPanel = new EventEmitter<number>();
    exportarGrafica = new EventEmitter<number>();
    editarGrafica = new EventEmitter<number>();
    aplicarFiltro = new EventEmitter<number>();
    iniGrafico = new EventEmitter<number>();
    reproducir: number = 0;
    celulaMadreNombre = new EventEmitter<string>();

    reproducirGrafica(estaGrafica: string) {
      this.miGrafica.next(estaGrafica);
    }

    reproducirImagenes(imagenMostrar: string) {
      this.miImagenes.next(imagenMostrar);
    }

    preferencias(valor: any) {
      this.preferenciasUsuario = valor;
    }

    rReproducir() {
      return this.reproducir;
    }

    aReproducir(valor: number) {
      this.reproducir = valor;
    }

    rImagen01() {
      return this.verImagen01;
    }

    Imagen01(valor: boolean) {
      this.verImagen01 = valor;
    }

    rConMarquesina() {
      return this.verMarquesina;
    }

    conMarquesina(valor: boolean) {
      this.verMarquesina = valor;
    }

    recuperarPreferencias() {
      return this.preferenciasUsuario;
    }

   
    seleccionar(opcion: number, valor: any) {
      if (opcion == 1) {
        this.celulaSeleccion = valor;
      }
      else if (opcion == 2) {
        this.maquinaSeleccion = valor;
      }
      else if (opcion == 3) {
        this.areaSeleccion = valor;
      }
      else if (opcion == 4) {
        this.fallaSeleccion = valor;
      }
    }
    
    recuperarSeleccion(opcion: number) {
      if (opcion==1) {
      return this.celulaSeleccion;
      }
      else if (opcion==2) {
        return this.maquinaSeleccion;
      }
      else if (opcion==3) {
        return this.areaSeleccion;
      }
      else if (opcion==4) {
        return this.fallaSeleccion;
      }
      
    }

    mostrar(valor: boolean) {
      this.mostrarTodos = valor;
    }

    recuperMostrar() {
      return this.mostrarTodos ;
    }

    preMostrar(valor: number) {
      this.preMostrarTodos = valor;
    }

    recuperPreMostrar() {
      return this.preMostrarTodos ;
    }

    preMostrarArea(valor: number) {
      this.preMostrarTodosArea = valor;
    }

    recuperPreMostrarArea() {
      return this.preMostrarTodosArea ;
    }

    aObligar(valor: boolean) {
      this.obligarCT = valor;
    }

    rObligar() {
      return this.obligarCT ;
    }

    aGrafica(valor: number) {
      this.gActual = valor;
    }

    rGrafica() {
      return this.gActual ;
    }

    aTurno(valor: any) {
      this.turnoActual = valor;
    }

    rTurno() {
      return this.turnoActual ;
    }


    aUsuario(valor: any) {
      this.usuarioActual = valor;
    }

    rUsuario() {
      return this.usuarioActual ;
    }

    aTecnico(valor: any) {
      this.tecnicoActual = valor;
    }

    rTecnico() {
      return this.tecnicoActual ;
    }

    iconoDialogo(valor: string) {
      this.iconoD = valor;
    }

    recuperIconoDialogo() {
      return this.iconoD ;
    }

    tablaFiltro(valor: number) {
      this.tablaF = valor;
    }

    recuperTablaFiltro() {
      return this.tablaF ;
    }

    alarmaPanel(valor: number) {
      this.AlarmaPanel = valor;
    }

    rAlarmaPanel() {
      return this.AlarmaPanel ;
    }

    imagenActual(valor: string) {
      this.laImagen = valor;
    }

    rImagenActual() {
      return this.laImagen ;
    }

    panelActual(valor: number) {
      this.panelSeleccionado = valor;
    }

    rpanelActual() {
      return this.panelSeleccionado ;
    }

    consultaActual(valor: number) {
      this.consulta = valor;
    }

    recuperConsultaActual() {
      return this.consulta ;
    }

    rFiltroDesde() {
      return this.filtroDesde ;
    }

    rFiltroHasta() {
      return this.filtroHasta ;
    }

    rFiltroAdic() {
      return this.filtroAdic;
    }

    rEstadoImagen() {
      return this.edoImagen ;
    }

    estadoImagen(valor: string) {
      this.edoImagen = valor;
    }

    

    convertirFecha(tipo: number, miFecha: string, formato: string): string {
      if (tipo==1) {
        return this.datepipe.transform(new Date(), formato);
        }
      else if (tipo==2) {
        return this.datepipe.transform(new Date(miFecha), formato);
        }
      }
    
      
}

