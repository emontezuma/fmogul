import { Component, OnInit, Inject } from '@angular/core';
import { ComunicacionService } from '../services/comunicacion.service';
import { GestionApisService } from '../services/gestion-apis.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';

@Component({
  selector: 'app-dialogo-historico',
  templateUrl: './dialogo-historico.component.html',
  styleUrls: ['./dialogo-historico.component.css']
})
export class DialogoHistoricoComponent implements OnInit {

  constructor( public snackBar: MatSnackBar, public dialogRef: MatDialogRef<DialogoHistoricoComponent>, @Inject(MAT_DIALOG_DATA) public datos: any, private comunicacion: ComunicacionService, private gestionBD: GestionApisService) 
  {
    let fechaTrabajoINI = this.comunicacion.convertirFecha(1, '' , "yyyy/MM/dd");
    let fechaTrabajoINI2 = fechaTrabajoINI.substring(0,7) + "/01"
      this.fecha1 = new Date(fechaTrabajoINI2);
      this.fecha2 = new Date();
   }

miPeriodo: number = 4;
fecha1: any ;
fecha2: any ;
habFecha: boolean = false;
hayErrorFechaD: boolean = false;
hayErrorFechaH: boolean = false;
hayErrorPeriodo: boolean = false;

 cambiarPeriodo(event: any) {
   this.moverPeriodo(event.value);
 }



 moverPeriodo(periodo: number) 
  {
    this.hayErrorPeriodo=false;
    this.fecha2 = new Date();
    let date = this.fecha2;
    if (periodo < 7)
    {
      this.habFecha = false;
      if (periodo == 1)
      {
        this.fecha1 = this.fecha2;
      }
      else if (periodo == 2)
      {
        if (date.getDay()==0) 
        {
          //domingo
          date.setDate(date.getDate() - 6);
          
          this.fecha1 = new Date(date);
          this.fecha2 = new Date();
        }
        else 
        {
          date.setDate(date.getDate() - (date.getDay() - 1));
          this.fecha1 = new Date(date);
          this.fecha2 = new Date();
        }
      }
      else if (periodo == 3)
      {
        if (date.getDay()==0) 
        {
          //domingo
          let date3 = new Date();
          date3.setDate(date3.getDate() - 13);
          let date4 = new Date();
          date4.setDate(date4.getDate() - 7);
          this.fecha1 = new Date(date3);
          this.fecha2 = new Date(date4);
        }
        else 
        {
          let date2 = new Date();
          date2.setDate(date2.getDate() - (date2.getDay()));
          this.fecha2 = new Date(date2);
          date.setDate(date.getDate() - (date.getDay() - 1) - 7);
          this.fecha1 = new Date(date);
        }
      }
      else if (periodo == 4)
      {
        let fechaTrabajoINI = this.comunicacion.convertirFecha(1, '' , "yyyy/MM/dd");
        let fechaTrabajoINI2 = fechaTrabajoINI.substring(0,7) + "/01"
        this.fecha1 = new Date(fechaTrabajoINI2);
      }
      else if (periodo == 5)
      {
        let fechaTrabajoINI = this.comunicacion.convertirFecha(1, '' , "yyyy/MM/dd");
        let fechaTrabajoINI2 = fechaTrabajoINI.substring(0,7) + "/01"
        date = new Date(fechaTrabajoINI2);
        date.setDate(date.getDate() -  1);
        this.fecha2 = new Date(date);
        fechaTrabajoINI = this.comunicacion.convertirFecha(2, this.fecha2 , "yyyy/MM/dd");
        fechaTrabajoINI2 = fechaTrabajoINI.substring(0,7) + "/01"
        this.fecha1 = new Date(fechaTrabajoINI2);
      }
      else if (periodo == 6)
      {
        let fechaTrabajoINI = this.comunicacion.convertirFecha(1, '' , "yyyy/MM/dd");
        let fechaTrabajoINI2 = fechaTrabajoINI.substring(0,4) + "/01/01"
        this.fecha1 = new Date(fechaTrabajoINI2);
      }
    }
    else 
    {
      let fechaTrabajoINI = this.comunicacion.convertirFecha(1, '' , "yyyy/MM/dd");
      let fechaTrabajoINI2 = fechaTrabajoINI.substring(0,7) + "/01"
      this.fecha1 = new Date(fechaTrabajoINI2);
      this.habFecha = true;
    };
  }
 
 
 periodos: any = [{id: 1, nombre: "Hoy"}, {id: 2, nombre: "Esta semana"}, {id: 3, nombre: "Semana ant."}, {id: 4, nombre: "Este mes"}, {id: 5, nombre: "Mes ant."}, {id: 6, nombre: "Este año"}, {id: 7, nombre: "Especificar"}]

 ngOnInit() {
 }

 cancelar(){
   this.datos.accion = 0;
   this.dialogRef.close(this.datos);
 }

 validar()
 {
   this.hayErrorFechaD=false;
   this.hayErrorFechaH=false;
   this.hayErrorPeriodo=false;

   if (!this.miPeriodo) {
     this.hayErrorPeriodo=true;
   }
   if (!this.fecha1 || !this.fecha2)
       {
       if (!this.fecha1)
       {
         this.hayErrorFechaD=true;
       }
       if (!this.fecha2)
       {
         this.hayErrorFechaH=true;
       }
     }
   else {
     if (this.fecha1 > this.fecha2)
     {
       this.hayErrorFechaD=true;
     }
   } 
   if (!this.hayErrorFechaD && !this.hayErrorFechaD && !this.hayErrorPeriodo)
   {
       //Se gusrda la consulta
       this.guardar();
   }
  }
   guardar() {

    let consulta2 = "SELECT reportes.*, maquinas.referencia as mref, maquinas.nombre as mnom, maquinas.prefijo as mpre, areas.referencia as aref, areas.nombre as anom, areas.prefijo as apre, fa.referencia as f1ref, fa.nombre as f1nom, fa.prefijo as f1pre, fb.referencia as f2ref, fb.nombre as f2nom, fb.prefijo as f2pre, celulas.referencia as cref, celulas.nombre as cnom, celulas.prefijo as cpre, ua.nombre AS nsolicitante, ub.nombre AS ntecnico, uc.nombre AS nmodificador, ud.nombre AS ntecnicoat, turnos.referencia as tref FROM reportes LEFT JOIN areas ON reportes.AREA = areas.id LEFT JOIN celulas ON reportes.celula = celulas.id LEFT JOIN maquinas ON reportes.maquina = maquinas.id LEFT JOIN fallas AS fa ON reportes.falla = fa.id LEFT JOIN turnos ON reportes.turno = turnos.id LEFT JOIN fallas AS fb ON reportes.falla_ajustada = fb.id LEFT JOIN usuarios AS ua ON reportes.solicitante = ua.id LEFT JOIN usuarios AS ub ON reportes.tecnico= ub.id LEFT JOIN usuarios AS uc ON reportes.modificador = uc.id LEFT JOIN usuarios AS ud ON reportes.tecnicoatend = ud.id WHERE fecha_reporte >= '" + this.comunicacion.convertirFecha(2, this.fecha1,"yyyy/MM/dd") + "' and fecha_reporte  <= '" + this.comunicacion.convertirFecha(2, this.fecha2, "yyyy/MM/dd") + "' ORDER BY id desc";
      let camposcab={accion: 50300, consulta: consulta2};  
      this.gestionBD.consultasBD(camposcab).subscribe((data) =>{
        if (!data) {
          //Se se halló nada
          this.toast('custom-class-red', 'No se hallaron reportes de mantenimiento datos en este período de tiempo', 3000 );
        }
        else {
          let exportCSV: string = "";

        // Loop the array of objects
              exportCSV = "Reportes de mantenimiento\r\n";
              exportCSV = "Desde: " + this.comunicacion.convertirFecha(2, this.fecha1, "yyyy/MM/dd") + " Hasta: " + this.comunicacion.convertirFecha(2, this.fecha2, "yyyy/MM/dd") +  "\r\n";
              exportCSV = exportCSV + '"Numero (ID)",';
              exportCSV = exportCSV + '"Fecha de generacion",';
              exportCSV = exportCSV + '"Turno (referencia)",';
              exportCSV = exportCSV + '"Nombre del solicitante",';
              exportCSV = exportCSV + '"Fecha de atencion",';
              exportCSV = exportCSV + '"Fecha de culminacion de la reparacion",';
              exportCSV = exportCSV + '"Fecha de cierre del reporte",';
              exportCSV = exportCSV + '"Nombre del tecnico que atendio",';
              exportCSV = exportCSV + '"Nombre del tecnico que cerro la atencion",';
              exportCSV = exportCSV + '"Prefijo de la falla confirmada (tecnico)",';
              exportCSV = exportCSV + '"Nombre de la falla confirmada (tecnico)",';
              exportCSV = exportCSV + '"Estatus del reporte (0=Sin atender/10=En reparacion/100=Reparado/1000=Cerrado) ",';
              exportCSV = exportCSV + '"Tiempo en la llegada del tecnico (hr)",';
              exportCSV = exportCSV + '"Tiempo de la reparacion (hr)",';
              exportCSV = exportCSV + '"Tiempo total de la parada (hr)",';
              exportCSV = exportCSV + '"Detalle de la falla (solicitante)",';
              exportCSV = exportCSV + '"Comentarios de la falla (tecnico)",';
              exportCSV = exportCSV + '"¿Reporte alarmado?",';
              exportCSV = exportCSV + '"¿Se contabiliza?",';
              exportCSV = exportCSV + '"Modificado por",';
              exportCSV = exportCSV + '"ID de la celula",';
              exportCSV = exportCSV + '"Prefijo de la celula",';
              exportCSV = exportCSV + '"Nombre de la celula",';
              exportCSV = exportCSV + '"Referencia de la celula",';
              exportCSV = exportCSV + '"ID de la maquina",';
              exportCSV = exportCSV + '"Prefijo de la maquina",';
              exportCSV = exportCSV + '"Nombre de la maquina",';
              exportCSV = exportCSV + '"Referencia de la maquina",';
              exportCSV = exportCSV + '"ID del area",';
              exportCSV = exportCSV + '"Prefijo del area",';
              exportCSV = exportCSV + '"Nombre del area",';
              exportCSV = exportCSV + '"Referencia del area",';
              exportCSV = exportCSV + '"ID de la falla confirmada",';
              exportCSV = exportCSV + '"Referencia de la falla confirmada",';
              exportCSV = exportCSV + '"ID de la falla solicitada",';
              exportCSV = exportCSV + '"Prefijo de la falla solicitada",';
              exportCSV = exportCSV + '"Nombre de la falla solicitada",';
              exportCSV = exportCSV + '"Referencia de la falla solicitada",';
              exportCSV = exportCSV + '"Tiempo en la llegada del tecnico (s)",';
              exportCSV = exportCSV + '"Tiempo de la reparacion (s)",';
              exportCSV = exportCSV + '"Tiempo total de la parada (s)",';
              exportCSV = exportCSV + '"ID del tecnico que atendio",';
              exportCSV = exportCSV + '"ID del tecnico que cerro la atencion",' 
              exportCSV = exportCSV + '"ID del turno",' + "\r\n";
              let lineas: number = 0;
              let totalFalla: number = 0;
              let totalHoras: number = 0;
              data.forEach((elementos, index) => {
                lineas=lineas+1
                if (elementos.id==32)
                {let elvis=1};
                exportCSV = exportCSV + '"' + elementos.id + '",';
                exportCSV = exportCSV + '"' + this.comunicacion.convertirFecha(2, elementos.fecha, "yyyy/MM/dd HH:mm:ss") + '",';
                exportCSV = exportCSV + '"' + elementos.tref + '",';
                exportCSV = exportCSV + '"' + elementos.nsolicitante + '",';
                if (!elementos.inicio_atencion) 
                  {exportCSV = exportCSV + '"N/A",';}
                else 
                  {exportCSV = exportCSV + '"' + this.comunicacion.convertirFecha(2, elementos.inicio_atencion, "yyyy/MM/dd HH:mm:ss") + '",';}
                if (!elementos.cierre_atencion) 
                  {exportCSV = exportCSV + '"N/A",';}
                else 
                  {exportCSV = exportCSV + '"' + this.comunicacion.convertirFecha(2, elementos.cierre_atencion, "yyyy/MM/dd HH:mm:ss") + '",';}
                if (!elementos.cierre_reporte) 
                  {exportCSV = exportCSV + '"N/A",';}
                else 
                  {exportCSV = exportCSV + '"' + this.comunicacion.convertirFecha(2, elementos.cierre_reporte, "yyyy/MM/dd HH:mm:ss") + '",';}
                  if (!elementos.ntecnicoat) 
                  {exportCSV = exportCSV + '"N/A",';}
                else 
                  {exportCSV = exportCSV + '"' + elementos.ntecnicoat + '",'}
                  if (!elementos.ntecnico) 
                  {exportCSV = exportCSV + '"N/A",';}
                else 
                  {exportCSV = exportCSV + '"' + elementos.ntecnico + '",'}
                if (!elementos.f2pre) 
                  {exportCSV = exportCSV + '"N/A","N/A",';}
                else 
                  {exportCSV = exportCSV + '"' + elementos.f2pre + '",';
                  exportCSV = exportCSV + '"' + elementos.f2nom + '",';
                  }
                exportCSV = exportCSV + '"' + elementos.estatus + '",';
                if (!elementos.inicio_atencion) 
                  {exportCSV = exportCSV + '"0",';}
                else 
                  {exportCSV = exportCSV + '"' + this.restarenHoras(elementos.fecha, elementos.inicio_atencion)  + '",';
                  }
                if (!elementos.tiempoatencion) {elementos.tiempoatencion=0}
                if (!elementos.tiempototal) {elementos.tiempototal=0}
                exportCSV = exportCSV + '"' + (elementos.tiempoatencion / 3600).toFixed(2) + '",';
                exportCSV = exportCSV + '"' + (elementos.tiempototal / 3600).toFixed(2) + '",';
                if (!elementos.detalle)
                {exportCSV = exportCSV + '"N/A",' }
                else {
                exportCSV = exportCSV + '"' + elementos.detalle.replace("\n", " ") + '",'}
                if (!elementos.comentarios)
                {exportCSV = exportCSV + '"N/A",' }
                else {
                exportCSV = exportCSV + '"' + elementos.comentarios.replace("\n", " ") + '",'}
                
                if (!elementos.alarmado) {elementos.alarmado="N"}
                if (!elementos.contabilizar) {elementos.contabilizar="N"}
                exportCSV = exportCSV + '"' + (elementos.alarmado == "S" ? "Si" : "No") + '",';
                exportCSV = exportCSV + '"' + (elementos.contabilizar == "S" ? "Si" : (elementos.contabilizar == "N" ? "No" : "N/A")) + '",';
                exportCSV = exportCSV + '"' + elementos.nmodificador + '",';
                exportCSV = exportCSV + '"' + elementos.celula + '",';
                exportCSV = exportCSV + '"' + elementos.cpre + '",';
                exportCSV = exportCSV + '"' + elementos.cnom + '",';
                exportCSV = exportCSV + '"' + elementos.cref + '",';
                exportCSV = exportCSV + '"' + elementos.maquina + '",';
                exportCSV = exportCSV + '"' + elementos.mpre + '",';
                exportCSV = exportCSV + '"' + elementos.mnom + '",';
                exportCSV = exportCSV + '"' + elementos.mref + '",';
                exportCSV = exportCSV + '"' + elementos.area + '",';
                exportCSV = exportCSV + '"' + elementos.apre + '",';
                exportCSV = exportCSV + '"' + elementos.anom + '",';
                exportCSV = exportCSV + '"' + elementos.aref + '",';
                exportCSV = exportCSV + '"' + elementos.falla_ajustada + '",';
                exportCSV = exportCSV + '"' + elementos.f2ref + '",';
                exportCSV = exportCSV + '"' + elementos.falla + '",';
                exportCSV = exportCSV + '"' + elementos.f1pre + '",';
                exportCSV = exportCSV + '"' + elementos.f1nom + '",';
                exportCSV = exportCSV + '"' + elementos.f1ref + '",';
                if (!elementos.inicio_atencion) 
                  {exportCSV = exportCSV + '"0",';}
                else 
                  {exportCSV = exportCSV + '"' + this.restarenSegundos(elementos.fecha, elementos.inicio_atencion)  + '",';  + '",';
                  }
                exportCSV = exportCSV + '"' + elementos.tiempoatencion + '",';
                exportCSV = exportCSV + '"' + elementos.tiempototal  + '",';
                exportCSV = exportCSV + '"' + elementos.tecnicoatend  + '",';
                exportCSV = exportCSV + '"' + elementos.tecnico  + '",';
                exportCSV = exportCSV + '"' + elementos.turno + '"' + "\r\n";
              })
              exportCSV = exportCSV + '"Total registro(s): "' + lineas
              // Once we are done looping, download the .csv by creating a link
              var blob = new Blob([exportCSV], {type: 'text/csv' }),
              url = window.URL.createObjectURL(blob);
              let link = document.createElement('a')
              link.download = "reporte.csv";
              link.href = url
              link.click()
              window.URL.revokeObjectURL(url);
              link.remove();
                this.datos.accion = 1;
                this.dialogRef.close(this.datos);
              }
    });  
 }

 toast(clase: string, mensaje: string, duracion: number) {
  let config = new MatSnackBarConfig();
    config.panelClass = [clase];
    config.duration = duracion;
    config.verticalPosition='bottom';
    this.snackBar.open(mensaje, null, config);
}

restarenHoras(desde: any, hasta: any)
    {
      let fechaDesde = new Date(desde);
      let fechaHasta = new Date(hasta);
      let  segundos = fechaHasta.getTime() - fechaDesde.getTime();
      segundos = segundos / 1000;

      return (segundos / 3600).toFixed(2);
    }

    restarenSegundos(desde: any, hasta: any)
    {
      let fechaDesde = new Date(desde);
      let fechaHasta = new Date(hasta);
      let  segundos = fechaHasta.getTime() - fechaDesde.getTime();
      segundos = segundos / 1000;
      return segundos;
    }
  

}
