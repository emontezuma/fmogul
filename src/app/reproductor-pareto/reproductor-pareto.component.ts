import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { ComunicacionService } from '../services/comunicacion.service';
import { GestionApisService } from '../services/gestion-apis.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { MatDialog } from '@angular/material';
import { DxChartComponent } from "devextreme-angular";
import { Subscription }   from 'rxjs';

export interface Data {
  dia: string;
  turno: string;
  mttr: number;
}

export class graficacion {
  nFrecuencia: number;
  nPCT: number;
  nEtiqueta: string;
}

export interface GraficaMTTR {
  pref: string,
  totalf: number,
  totalr: number,
  tdias: number,
}

@Component({
  selector: 'app-reproductor-pareto',
  templateUrl: './reproductor-pareto.component.html',
  styleUrls: ['./reproductor-pareto.component.css']
})
export class ReproductorParetoComponent implements OnInit {

  
 
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.pantallaAncho = window.innerWidth;
    this.pantallaAlto = window.innerHeight;
  }
 
@ViewChild(DxChartComponent) chart: DxChartComponent;

subscription: Subscription;
agrupador = ["Celula", "Maquina", "area", "Falla", "Tipo de maquina", "Maquina (agrupador 1)", "Maquina (agrupador 2)", "Falla (agrupador 1)", "Falla (agrupador 2)", "Dia", "Semana", "Mes"]
graficaActual: number = 0;
estaFiltrado: string = "";
graficaActualNombre: string = "";
graficamttr: GraficaMTTR [];
filtroAdicional: string = "";
fechaDesde: string = "";
fechaHasta: string = "";
diasAtras: number = 30;
agrupar: string = "S";
maximoBarras: number = 2;
maximoPCT: number = 80;
totalMTTR: number = 0;
marginTop: number = 10;
marginLeft: number = 10;
marginRight: number = 10;
marginBottom: number = 10;
titulo: string = "GRAFICA TEXTO";
textoX: string = "EJE DE LAS X";
textoY: string = "EJA DE LAS Y";
textoZ: string = "EJA DE LAS Z";
valor80: number = 0;
texto80: string = "EJA DE LAS Y";
textoMTTResperado: string = "EJA DE LAS Y";
textoMTBFesperado: string = "EJA DE LAS Y";
verMesAnterior: string = "S";
verAnyoAnterior: string = "S";
verMesAnteriorComp: string = "S";
verYTD: string = "S";
verMTD: string = "S";
f1: number = 10;
f2: number = 10;
f3: number = 10;
f4: number = 10;
ancho: number = 0;
alto: number = 0;
ultimo: GraficaMTTR;
grados: number = 90
hayGrafico: boolean  = false;
mttrmensual: number = 0;
mttrmensualstd: number = 0;
mesAnterior: string = ""

pantallaAlto: number = 400;
pantallaAncho: number = 600;


mttranual: number = 0;
mttranualstd: number = 0;
anyoAnterior: string = ""

mttrmescomp: number = 0;
mttrmescompstd: number = 0;
mesAnteriorcomp: string = ""
estandar: number = 0;
mttrytd: number = 0;
mttrytdstd: number = 0;
ytd: string = ""

mttrmtd: number = 0;
mttrmtdstd: number = 0;
mtd: string = ""

valores: graficacion [];

constructor( public snackBar: MatSnackBar, public dialog: MatDialog, private gestionBD: GestionApisService, private comunicacion: ComunicacionService ) { 
  this.hayGrafico =false;
  this.subscription = this.comunicacion.reproduccion$.subscribe((data: string) => {
    if (data=="PARETO") 
    {
      
      this.graficar(this.comunicacion.rReproducir());
    }
    })
    
}

  ngOnInit() {   
    this.comunicacion.panelActual(100);  
      this.hayGrafico =false;
      this.graficar(this.comunicacion.rReproducir());
      this.graficar(0);
      this.graficar(this.comunicacion.rReproducir());
      this.pantallaAncho = window.innerWidth;
      this.pantallaAlto = window.innerHeight;

    };

    compare(a, b) {
      let comparison = 0;
      if (+a.totalf  < +b.totalf) {
        comparison = 1;
      } else if (+a.totalf > +b.totalf) {
        comparison = -1;
      }
      return comparison;
    }

    comparedesc(a, b) {
      let comparison = 0;
      if (+a.totalf  > +b.totalf) {
        comparison = 1;
      } else if (+a.totalf < +b.totalf) {
        comparison = -1;
      }
      return comparison;
    }

    graficar(avance: number)
    {

      this.graficaActual = avance;
      this.comunicacion.aGrafica(this.graficaActual);
      
      //this.comunicacion.activarSpinner.emit(true);  
      //Se calcula la fecha
      let campos = {accion: 3, usuario: this.comunicacion.rUsuario().id};
      this.gestionBD.consultasBD(campos).subscribe((data: any)=>{
        let campos2 = {accion: 4, usuario: this.comunicacion.rUsuario().id, grafica: this.graficaActual};
        this.gestionBD.consultasBD(campos2).subscribe((data: any)=>{
          if (!data) {
            let campos3 = {accion: 4, usuario: 0, grafica: this.graficaActual};
            this.gestionBD.consultasBD(campos3).subscribe((data2: any)=>{
              this.llenarDatos(data2);
            })
         }
         else
         {
          this.llenarDatos(data);
         }
        })
      })
      }

      llenarDatos(data: any) {
          this.graficaActualNombre=data.texto;
          this.diasAtras = data.dias;
          if (this.diasAtras==0) {
            this.diasAtras=7;
          }
          this.agrupar = data.agrupar;
          this.agrupar.toUpperCase;
          this.textoX = data.textox;
          this.textoY = data.textoy;
          this.textoZ = data.textoz;
          this.titulo = data.texto;
          this.marginBottom = +data.margenbot;
          this.grados = +data.rotar;
          if (!this.grados) {this.grados=90};
          this.marginLeft = +data.margenizq;
          this.marginRight = +data.margender;
          this.marginTop = +data.margentop;
          this.maximoBarras = +data.maximo;
          this.maximoPCT = +data.maximopct;
          this.f1 = +data.font1;
          this.f2 = +data.font2;
          this.f3 = +data.font3;
          this.f4 = +data.font4;
          if (data.ancho==0)
          {
            this.ancho = this.pantallaAncho * 0.9;
          }
          else
          {
            this.ancho = +data.ancho;
          }
          if (data.alto==0)
          {
            this.alto = this.pantallaAlto * 0.85;
          }
          else
          {
            this.alto = +data.alto;
          }
          
          if (this.graficaActual<214) {
            let campos={accion: 900};
            this.gestionBD.consultasBD(campos).subscribe((data)=>{
              this.valor80 = data.valorpareto
              this.texto80 = data.textopareto;
              this.textoMTTResperado = data.textomttr;
              this.textoMTBFesperado = data.textomtbf;
              this.grafico();
            });
          }
      }
    
    grafico()
    {
      if (this.comunicacion.recuperConsultaActual()==0) {
        let consulta = "SELECT id from consultas_cab WHERE usuario = " + this.comunicacion.rUsuario().id + " and defecto = '1'";
        let camposcab={accion: 50100, consulta: consulta};  
          this.gestionBD.consultasBD(camposcab).subscribe((data: any) =>{
            if (!data) {
              this.comunicacion.consultaActual(0);
              let fechaTrabajoINI = this.comunicacion.convertirFecha(1, '' , "yyyy/MM/dd");
              let fechaTrabajoINI2 = fechaTrabajoINI.substring(0,7) + "/01"
              this.fechaDesde = this.comunicacion.convertirFecha(2, '' + new Date(fechaTrabajoINI2), "yyyy/MM/dd");
              this.fechaHasta = this.comunicacion.convertirFecha(2, '' + new Date(), "yyyy/MM/dd");
              this.filtroAdicional = "";
              this.estaFiltrado= ""
              this.buscarGrafica();
              
            }
            else
            {
              this.comunicacion.consultaActual(data.id);
              this.construirFiltro();
            }
          });
        }
        else
        {
          this.construirFiltro();
        }
    }      

      construirFiltro()
      {
        if (this.comunicacion.recuperConsultaActual()==-1) {
          let fechaTrabajoINI = this.comunicacion.convertirFecha(1, '' , "yyyy/MM/dd");
          let fechaTrabajoINI2 = fechaTrabajoINI.substring(0,7) + "/01"
          this.fechaDesde = this.comunicacion.convertirFecha(2, '' + new Date(fechaTrabajoINI2), "yyyy/MM/dd");
          this.fechaHasta = this.comunicacion.convertirFecha(2, '' + new Date(), "yyyy/MM/dd");
          this.filtroAdicional = "";
          this.buscarGrafica();
          this.estaFiltrado= ""
        }
      else {
      let consultaSQL = "SELECT * from consultas_cab WHERE id = " + this.comunicacion.recuperConsultaActual()  ;
        let camposcab={accion: 50100, consulta: consultaSQL};  
          this.gestionBD.consultasBD(camposcab).subscribe((data: any) =>{
            this.estaFiltrado= " (se está aplicando una consulta)"
            if (data.fecha == 7) {
              this.fechaDesde = this.comunicacion.convertirFecha(2, '' + new Date(data.desde), "yyyy/MM/dd");
              this.fechaHasta = this.comunicacion.convertirFecha(2, '' + new Date(data.hasta), "yyyy/MM/dd");
            }
            else
            {
              this.fechaHasta = this.comunicacion.convertirFecha(2, '' + new Date(), "yyyy/MM/dd");
              if (data.fecha==1){
                this.fechaDesde = this.comunicacion.convertirFecha(2, '' + new Date(), "yyyy/MM/dd");
              }
              else if (data.fecha==2)
              {
                let date = new Date();
                if (date.getDay()==0) {
                  //domingo
                  date.setDate(date.getDate() - 6);
                }
                else {
                  date.setDate(date.getDate() - (date.getDay() - 1));
                }
                this.fechaDesde = this.comunicacion.convertirFecha(2, '' + new Date(date), "yyyy/MM/dd");
              }
              else if (data.fecha==3)
              {
                let date = new Date();
                if (date.getDay()==0) 
                {
                  //domingo
                  let date3 = new Date();
                  date3.setDate(date3.getDate() - 13);
                  let date4 = new Date();
                  date4.setDate(date4.getDate() - 7);
                  this.fechaHasta = this.comunicacion.convertirFecha(2, '' + new Date(date4), "yyyy/MM/dd");
                  this.fechaDesde = this.comunicacion.convertirFecha(2, '' + new Date(date3), "yyyy/MM/dd");
                }
                else 
                {
                  let date2 = new Date();
                  date2.setDate(date2.getDate() - (date2.getDay()));
                  date.setDate(date.getDate() - (date.getDay() - 1) - 7);
                  this.fechaHasta = this.comunicacion.convertirFecha(2, '' + new Date(date2), "yyyy/MM/dd");
                  this.fechaDesde = this.comunicacion.convertirFecha(2, '' + new Date(date), "yyyy/MM/dd");
                }
              }
              
              else if (data.fecha==4){
                let fechaTrabajoINI = this.comunicacion.convertirFecha(1, '' , "yyyy/MM/dd");
                let fechaTrabajoINI2 = fechaTrabajoINI.substring(0,7) + "/01"
                this.fechaDesde = this.comunicacion.convertirFecha(2, '' + new Date(fechaTrabajoINI2), "yyyy/MM/dd");
              }
              else if (data.fecha==5){

                let fechaTrabajoINI = this.comunicacion.convertirFecha(1, '' , "yyyy/MM/dd");
                let fechaTrabajoINI2 = fechaTrabajoINI.substring(0,7) + "/01"
                let date = new Date(fechaTrabajoINI2);
                date.setDate(date.getDate() -  1);
                let date2 = new Date(date);
                fechaTrabajoINI = this.comunicacion.convertirFecha(2, '' + date2, "yyyy/MM/dd");
                fechaTrabajoINI2 = fechaTrabajoINI.substring(0,7) + "/01"
                this.fechaHasta = this.comunicacion.convertirFecha(2, '' + new Date(fechaTrabajoINI), "yyyy/MM/dd");
                this.fechaDesde = this.comunicacion.convertirFecha(2, '' + new Date(fechaTrabajoINI2), "yyyy/MM/dd");
              }
              else if (data.fecha==6){
                let fechaTrabajoINI = this.comunicacion.convertirFecha(1, '' , "yyyy/MM/dd");
                let fechaTrabajoINI2 = fechaTrabajoINI.substring(0,4) + "/01/01"
                this.fechaDesde = this.comunicacion.convertirFecha(2, '' + new Date(fechaTrabajoINI2), "yyyy/MM/dd");
              }
            }
            //Se busca el detalle
            let consultaNRO = this.comunicacion.recuperConsultaActual();
            this.filtroAdicional = "";
            if (data.filtrocel>0)  {
              this.filtroAdicional = this.filtroAdicional + " AND r.celula in (SELECT valor FROM consultas_det WHERE consulta = " + consultaNRO + " AND tabla = 10) "
            }
            if (data.filtromaq>0)  {
              this.filtroAdicional = this.filtroAdicional + " AND r.maquina in (SELECT valor FROM consultas_det WHERE consulta = " + consultaNRO + " AND tabla = 20) "
            }
            if (data.filtroare>0)  {
              this.filtroAdicional = this.filtroAdicional + " AND r.area in (SELECT valor FROM consultas_det WHERE consulta = " + consultaNRO + " AND tabla = 30) "
            }
            if (data.filtrofal>0)  {
              this.filtroAdicional = this.filtroAdicional + " AND r.falla_ajustada in (SELECT valor FROM consultas_det WHERE consulta = " + consultaNRO + " AND tabla = 40) "
            }
            if (data.filtromti>0)  {
              this.filtroAdicional = this.filtroAdicional + " AND r.maquina in (SELECT id FROM maquinas WHERE tipo in (SELECT valor FROM consultas_det WHERE consulta = " + consultaNRO + " AND tabla = 50)) "
            }
            if (data.filtroma1>0)  {
              this.filtroAdicional = this.filtroAdicional + " AND r.maquina in (SELECT id FROM maquinas WHERE clasificacion1 in (SELECT valor FROM consultas_det WHERE consulta = " + consultaNRO + " AND tabla = 60)) " 
            }
            if (data.filtroma2>0)  {
              this.filtroAdicional = this.filtroAdicional + " AND r.maquina in (SELECT id FROM maquinas WHERE clasificacion2 in (SELECT valor FROM consultas_det WHERE consulta = " + consultaNRO + " AND tabla = 70)) " 
            }
            if (data.filtrofa1>0)  {
              this.filtroAdicional = this.filtroAdicional + " AND r.falla_ajustada in (SELECT id FROM fallas WHERE clasificacion1 in (SELECT valor FROM consultas_det WHERE consulta = " + consultaNRO + " AND tabla = 80)) " 
            }
            if (data.filtrofa2>0)  {
              this.filtroAdicional = this.filtroAdicional + " AND r.falla_ajustada in (SELECT id FROM fallas WHERE clasificacion2 in (SELECT valor FROM consultas_det WHERE consulta = " + consultaNRO + " AND tabla = 90)) " 
            }
            if (data.filtrotec>0)  {
              this.filtroAdicional = this.filtroAdicional + " AND r.tecnico in (SELECT valor FROM consultas_det WHERE consulta = " + consultaNRO + " AND tabla = 95) "
            }
            this.buscarGrafica();
          });
        }
      }

      buscarGrafica()
      {
          
            let campos = {accion: 1700 + this.graficaActual, desde: this.fechaDesde, hasta: this.fechaHasta,  filtroadicional: this.filtroAdicional};
            this.gestionBD.consultasBD(campos).subscribe((data: GraficaMTTR[])=>{
              this.graficamttr = data;
              if (data.length==0) {
                this.hayGrafico = false;
                
                this.toast('custom-class-red', 'No hay datos para graficar...', 3000);
              }
              else {
                if (!this.hayGrafico) {this.hayGrafico = true};
                this.mttr();
              }
              
                
            });
          }
      
        //Gráfico de MMTTR
    mttr()
        {
          this.mttrmensual = 0;
          this.mttrmensualstd = 0;
          this.mesAnterior = ""
          this.mttranual = 0;
          this.mttranualstd = 0;
          this.anyoAnterior = ""
          this.mttrmescomp = 0;
          this.mttrmescompstd = 0;
          this.mesAnteriorcomp = ""

          this.acumularMes();
          
        }

acumularMes()
{
    this.acumularAnyo();
}

acumularAnyo()
{
      this.acumularMesComp();
}

acumularMesComp()
{
      this.acumularYTD();
}

acumularYTD()
{
      this.acumularMTD();
}

acumularMTD()
{
      this.continuarGrafico();
}


continuarGrafico() 
{
      //this.comunicacion.activarSpinner.emit(false);  
      //se preparan los datos
        
      this.valores = [];
      this.graficamttr.sort(this.compare);
      let eliminar: number = 0;
      this.totalMTTR = 0;
      this.graficamttr.forEach((elementos: GraficaMTTR, index) => {
        if (elementos.pref!=null) {
          //alert("MTTR solo: " + elementos.mttrc + " acumulado: " + this.totalMTTR + " maximo PCT: " + this.maximoPCT)
          this.valores.push({nFrecuencia: elementos.totalf, nPCT: 0, nEtiqueta: elementos.pref});
        }
        else {
          this.totalMTTR =elementos.totalf *1;
          this.ultimo = elementos;
          eliminar = index;
        }
      })
      this.graficamttr.splice(eliminar, 1);
      //Se revisa si hay más barras de lo deseado
      if (+this.maximoPCT > 0 || (+this.maximoBarras > 0 && this.graficamttr.length > this.maximoBarras )) {
        this.graficamttr.sort(this.compare);
        let agrupado: GraficaMTTR = { pref: "", totalf: 0, totalr: 0, tdias: 0 }
        agrupado.totalf=0;
        let items: number = 0;  
        let acumuladoMTTR=0;
        let pasode80: boolean = false;
        this.graficamttr.forEach((elementos, index) => {
          acumuladoMTTR = acumuladoMTTR + elementos.totalf*1; 
            
          if ((index>=this.maximoBarras && index <= this.graficamttr.length-1 && this.maximoBarras) || (pasode80 && index <= this.graficamttr.length-1)) {
            items=items+1;
            agrupado.totalf = agrupado.totalf + elementos.totalf*1;
            agrupado.totalr = agrupado.totalr + elementos.totalr*1;
            agrupado.tdias = agrupado.tdias + elementos.tdias*1;
          }
          pasode80 = acumuladoMTTR > (this.maximoPCT / 100 * this.totalMTTR) && +this.maximoPCT > 0;
        })
        //alert("cantos items se consideraron a quitar " + items)
        if (+items>1) {
          this.graficamttr.splice(this.graficamttr.length - items, items);
          if (this.agrupar=="S") {
            agrupado.pref = "VARIOS (" + items + ")";
            this.graficamttr.push(agrupado);
          }
        }
        else {
          //this.graficamttr.splice(this.maximoBarras,this.graficamttr.length - this.maximoBarras);
        }
      }
        
        //Se vuelve a ordenar
        this.valores = [];
        this.graficamttr.sort(this.compare);
        let sumaPCT: number  = 0;
        this.graficamttr.forEach((elementos, index) => {
          sumaPCT = sumaPCT + elementos.totalf*1; 
          this.valores.push({nFrecuencia: elementos.totalf, nPCT: Math.round(sumaPCT /  this.totalMTTR * 100), nEtiqueta: elementos.pref});
        })
    
          
        //se establecen los parámetros
        
        this.chart._setOption("title", {text: this.titulo, font: {size: this.f1, weight: 600, bold: "true"}});
        this.chart._setOption("dataSource", {dataSource: this.valores});
        this.chart._setOption("tooltip", 
        { enabled: "true", 
          shared: "true", 
          customizeTooltip: function (arg) {
            return {
                text: arg.argumentText + "<br/>" + arg.valueText
            };
          }
        });
        
        this.chart._setOption("margin", { left: this.marginLeft, top: this.marginTop, right: this.marginRight, bottom: this.marginBottom});
        this.chart._setOption("commonSeriesSettings",{argumentField: "nEtiqueta"})
        this.chart._setOption("series", 
          [{ type: "bar", 
            valueField: "nFrecuencia", 
            axis: "frecuencia",
            label: 
              { visible: "true",
              position: "outside",
              font:  
                { size: this.f4,
                  weight: 600,
                color: "#000000",
                
                bold: "true"},
                }
          },
          { type: "spline", 
          valueField: "nPCT", 
          axis: "pct",
          width: 2,
          color: "blue",
          label: 
            { visible: "true",
            
            font:  
              { size: this.f4,
                weight: 600,
              color: "#000000",
              
              bold: "true"},
              }
        }]);
        this.chart._setOption("size", {height: this.alto, width: this.ancho});
        this.chart._setOption("argumentAxis",
          { label: 
            {overlappingBehavior: "rotate", 
            rotateAngle: this.grados, 
            font: { size: this.f3 }}, 
            title: 
              { text: this.textoX, 
                font: 
                {size: this.f2, 
                  bold: "true",
                  weight: 600}
                }
          });
          this.chart._setOption("valueAxis",
            [{
              name: "frecuencia",
              position: "left",
              valueType: "numeric", 
              label: {
                font: {
                  size: this.f3,
                }
              },
              title: 
              { text: this.textoY, 
                font: 
                {size: this.f2, 
                  bold: "true",
                  weight: 600}
                }
        },
          {
            name: "pct",
            position: "right",
            valueType: "numeric", 
            showZero: true,
            label: {
                text: { customizeText: function (info) {
                    return info.valueText + "%";
                }},
                font: {
                  size: this.f3,
                }
            },
            title: 
              { text: this.textoZ, 
                font: 
                {size: this.f2, 
                  bold: "true",
                  weight: 600}
                },
            constantLines: [{
              value: this.valor80,
              color: "#fc3535",
              dashStyle: "dash",
              width: 5,
              label: 
                  { text: this.texto80, font: { size: this.f4, weight: 600, bold: "true"}},
          }],
          valueMarginsEnabled: false
          }]);
          
      }

      toast(clase: string, mensaje: string, duracion: number) {
        let config = new MatSnackBarConfig();
          config.panelClass = [clase];
          config.duration = duracion;
          config.verticalPosition='bottom';
          this.snackBar.open(mensaje, null, config);
      } 

      exportarImagen()
      {
        this.chart.instance.exportTo(this.graficaActualNombre, 'PNG');
      }
      
      exportarDatos()
      {
        let exportCSV: string = "";

        // Loop the array of objects
        exportCSV = this.graficaActualNombre  + "\r\n";
        exportCSV = exportCSV + this.agrupador[this.graficaActual - 1] + ",";
        exportCSV = exportCSV + '"Dias evaluados",';
        exportCSV = exportCSV + '"MTTR esperado",';
        exportCSV = exportCSV + '"MTBF esperado",';
        exportCSV = exportCSV + '"Total fallas",';
        exportCSV = exportCSV + '"Total horas de reparación",';
        exportCSV = exportCSV + '"Total horas (paros planeados)",';
        exportCSV = exportCSV + '"Total horas disponibles",';
        exportCSV = exportCSV + '"MTTR calculado",';
        exportCSV = exportCSV + '"MTBF calculado",' + "\r\n";
        let lineas: number = 0;
        let totalFalla: number = 0;
        let totalHoras: number = 0;
        this.graficamttr.forEach((elementos: GraficaMTTR, index) => {
          lineas=lineas+1
          exportCSV = exportCSV + '"' + elementos.pref + '",';
          exportCSV = exportCSV + '"' + elementos.tdias + '",';
          exportCSV = exportCSV + '"' + elementos.totalf + '",';
          exportCSV = exportCSV + '"' + elementos.totalr + '",';
          totalFalla = totalFalla + +elementos.totalf;
          totalHoras = totalHoras + +elementos.totalr;
        })
        exportCSV = exportCSV + '"Total registro(s): "' + lineas + ",,,," + totalFalla + "," + totalHoras + ",,,"
        // Once we are done looping, download the .csv by creating a link
        var blob = new Blob([exportCSV], {type: 'text/csv' }),
        url = window.URL.createObjectURL(blob);
        let link = document.createElement('a')
        link.download = this.graficaActualNombre + ".csv";
        link.href = url
        link.click()
        window.URL.revokeObjectURL(url);
        link.remove();
      }

calcularColor(arg: any) {
    //if(+arg.value < +arg.data.nPCT) {
        return { color: "rgba(231, 76, 60, 0.7)", hoverStyle: { color: "rgba(231, 76, 60, 1)" } };
    //}         
    //else { 
    //  return { color: "rgba(23, 165, 137, 0.7)", hoverStyle: { color: "rgba(23, 165, 137, 1)" } };
    //}
  }

  colocarToolTip2 (pointInfo: any) {
    return pointInfo.value;
};

  colocarTooltip(info: any) {
      return {
          text: info.argumentText + "<br/>" + info.valueText
      };
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }
}