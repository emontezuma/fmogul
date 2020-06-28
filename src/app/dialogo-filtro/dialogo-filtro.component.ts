import { Component, OnInit, Inject } from '@angular/core';
import { ComunicacionService } from '../services/comunicacion.service';
import { GestionApisService } from '../services/gestion-apis.service';
import { DialogoTablasComponent } from '../dialogo-tablas/dialogo-tablas.component';
import { DialogoNuevaComponent } from '../dialogo-nueva/dialogo-nueva.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';

import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-dialogo-filtro',
  templateUrl: './dialogo-filtro.component.html',
  styleUrls: ['./dialogo-filtro.component.css']
})
export class DialogoFiltroComponent implements OnInit {


  constructor( public dialogRef: MatDialogRef<DialogoFiltroComponent>, @Inject(MAT_DIALOG_DATA) public datos: any, public dialog: MatDialog, private comunicacion: ComunicacionService, private gestionBD: GestionApisService ) {
    this.buscarConsultas();
    
   }

   nombreC = new FormControl('', [Validators.required]);
   fechaD = new FormControl('', [Validators.required]);
   fechaH = new FormControl('', [Validators.required]);
   miPeriodo: number = 0;
fecha1: any ;
fecha2: any ;
habFecha: boolean = false;
hayErrorFechaD: boolean = false;
hayErrorFechaH: boolean = false;
hayErrorNombre: boolean = false;
hayErrorPeriodo: boolean = false;
   consultas: any = [];
   checked: boolean = false;
  totMaquinas: string = "Máquinas (Todas)";
  totAreas: string = "Áreas (Todas)";
  totFallas: string = "Fallas (Todas)";
  totCelulas: string = "Células (Todas)";
  totMaquinasTipo: string = "Máquinas Tipo (Todas)";
  totMaquinasAgr1: string = "Máquinas Agrup 1 (Todas)";
  totMaquinasAgr2: string = "Máquinas Agrup 2 (Todas)";
  totFallasAgr1: string = "Fallas Agrup 1 (Todas)";
  totFallasAgr2: string = "Fallas Agrup 2 (Todas)";
  totFallasTec: string = "Técnicos (Todos)";
  iconomiTabla1: string = "propioVobo";
  iconomiTabla2: string = "propioVobo";
  iconomiTabla3: string = "propioVobo";
  iconomiTabla4: string = "propioVobo";
  iconomiTabla5: string = "propioVobo";
  iconomiTabla6: string = "propioVobo";
  iconomiTabla7: string = "propioVobo";
  iconomiTabla8: string = "propioVobo";
  iconomiTabla9: string = "propioVobo";
  iconomiTabla10: string = "propioVobo";
  miConsulta: number = 0;

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

  buscarConsultas() {
    this.consultas  = [];
    let camposcab={accion: 50005, usuario: this.comunicacion.rUsuario().id};  
    this.gestionBD.consultasBD(camposcab).subscribe((datacab: any[])=>{
      this.consultas = datacab;
      if (this.comunicacion.recuperConsultaActual()>0) {
        this.miConsulta = this.comunicacion.recuperConsultaActual(); 
        this.recuperarConsulta()
      }
      else
      {
        this.checked = false;
        this.miPeriodo = 4;
        this.fecha2 = new Date();
        let fechaTrabajoINI = this.comunicacion.convertirFecha(1, '' , "yyyy/MM/dd");
        let fechaTrabajoINI2 = fechaTrabajoINI.substring(0,7) + "/01"
        this.fecha1 = new Date(fechaTrabajoINI2);
      }
    });        
  }

  
  cambiarConsulta(event: any) {
    this.comunicacion.consultaActual(event.value);
    this.recuperarConsulta()  
    this.hayErrorNombre=false;
  }

  recuperarConsulta()
 {
  let camposcab={accion: 50000, consulta: this.comunicacion.recuperConsultaActual()};  
  this.gestionBD.consultasBD(camposcab).subscribe((data: any) =>{
    this.totCelulas = "Células (" + (data.filtrocel==0 ? "Todas" : data.filtrocel) + ")";
    this.miPeriodo = +data.fecha;
    if (data.fecha==5) {
      this.fecha1 = new Date(data.desde);
      this.fecha2 = new Date(data.hasta);
    }
    else
    {
      this.moverPeriodo(data.fecha);
    }
    this.totAreas = "Áreas (" + (data.filtroare==0 ? "Todas" : data.filtroare) + ")";
    this.totFallas = "Fallas (" + (data.filtrofal==0 ? "Todas" : data.filtrofal) + ")";
    this.totMaquinas = "Máquinas (" + (data.filtromaq==0 ? "Todas" : data.filtromaq) + ")";
    this.totMaquinasTipo = "Máquinas Tipo (" + (data.filtromti==0 ? "Todas" : data.filtromti) + ")";
    this.totMaquinasAgr1 = "Máquinas Agrup 1 (" + (data.filtroma1==0 ? "Todas" : data.filtroma2) + ")";
    this.totMaquinasAgr2 = "Máquinas Agrup 2 (" + (data.filtroma2==0 ? "Todas" : data.filtroma2) + ")";
    this.totFallasAgr1 = "Fallas Agrup 1 (" + (data.filtrofa1==0 ? "Todas" : data.filtrofa1) + ")";
    this.totFallasAgr2 = "Fallas Agrup 2 (" + (data.filtrofa2==0 ? "Todas" : data.filtrofa2) + ")";
    this.totFallasTec = "Técnicos (" + (data.filtrotec==0 ? "Todos" : data.filtrotec) + ")";
    this.checked = (data.defecto == "0" ? false : true);
    this.iconomiTabla1 = data.filtrocel==0 ? "propioVobo" : "propioFiltrar"
    this.iconomiTabla2 = data.filtromaq==0 ? "propioVobo" : "propioFiltrar"
    this.iconomiTabla3 = data.filtroare==0 ? "propioVobo" : "propioFiltrar"
    this.iconomiTabla4 = data.filtrofal==0 ? "propioVobo" : "propioFiltrar"
    this.iconomiTabla5 = data.filtromti==0 ? "propioVobo" : "propioFiltrar"
    this.iconomiTabla6 = data.filtroma1==0 ? "propioVobo" : "propioFiltrar"
    this.iconomiTabla7 = data.filtroma2==0 ? "propioVobo" : "propioFiltrar"
    this.iconomiTabla8 = data.filtrofa2==0 ? "propioVobo" : "propioFiltrar"
    this.iconomiTabla9 = data.filtrofa2==0 ? "propioVobo" : "propioFiltrar"
    this.iconomiTabla10 = data.filtroTec==0 ? "propioVobo" : "propioFiltrar"
  });
 }
 
 agregar() {
  const dialogRef = this.dialog.open(DialogoNuevaComponent, {
    width: '500px', height: '330px', data: { accion: 0 }
  });
  dialogRef.afterClosed().subscribe(result => {
  if (result.accion >"0") {
      //
      let consulta1 = "update consultas_cab set defecto = '" + (this.checked ? "1" : "0") + "', fecha = " + this.miPeriodo + ", desde = '" + this.comunicacion.convertirFecha(2, this.fecha1 + "", "yyyy/MM/dd") + "', hasta = '" + this.comunicacion.convertirFecha(2, this.fecha2 + "", "yyyy/MM/dd") + "' where id = " + this.comunicacion.recuperConsultaActual()
      let camposcab={accion: 50030, consulta: consulta1};  
      this.gestionBD.escribirBD(camposcab).subscribe((data: any) =>{
        this.buscarConsultas();
        this.miConsulta = this.comunicacion.recuperConsultaActual(); 
        this.recuperarConsulta();
      });
    }
  });
 }

 mostrarFiltro() {
  const dialogRef = this.dialog.open(DialogoTablasComponent, {
    width: '530px', height: '610px', data: { accion: 0 }
  });
  dialogRef.afterClosed().subscribe(result => {
      this.recuperarConsulta()
  });
 }
  
 celulas() {
    this.comunicacion.tablaFiltro(10);
    this.mostrarFiltro()
    
  }

  maquinas() {
    this.comunicacion.tablaFiltro(20);
    this.mostrarFiltro()
  }
 

  areas() {
    this.comunicacion.tablaFiltro(30);
    this.mostrarFiltro()
  }

  fallas() {
    this.comunicacion.tablaFiltro(40);
    this.mostrarFiltro()
  }

  maquinasT() {
    this.comunicacion.tablaFiltro(50);
    this.mostrarFiltro()
  }

  maquinasA1() {
    this.comunicacion.tablaFiltro(60);
    this.mostrarFiltro()
  }

  maquinasA2() {
    this.comunicacion.tablaFiltro(70);
    this.mostrarFiltro()
  }
  
  fallasA1() {
    this.comunicacion.tablaFiltro(80);
    this.mostrarFiltro()
  }

  fallasA2() {
    this.comunicacion.tablaFiltro(90);
    this.mostrarFiltro()
  }

  tecnicos() {
    this.comunicacion.tablaFiltro(95);
    this.mostrarFiltro()
  }

  cancelar(){
    this.datos.accion = 0;
    this.dialogRef.close(this.datos);
  }

  validar()
  {
    this.hayErrorFechaD=false;
    this.hayErrorFechaH=false;
    this.hayErrorNombre=false;
    this.hayErrorPeriodo=false;

    if (!this.miConsulta) {
      this.hayErrorNombre=true;
    }
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
    if (!this.hayErrorFechaD && !this.hayErrorFechaD && !this.hayErrorNombre && !this.hayErrorPeriodo)
    {
        //Se gusrda la consulta
        if (this.checked)
        {
          let consulta1 = "update consultas_cab set defecto = '0' where usuario = " + this.comunicacion.rUsuario().id;
          let camposcab={accion: 50030, consulta: consulta1};  
          this.gestionBD.escribirBD(camposcab).subscribe((data: any) =>{
              this.guardar();  
        });
      }
      else
      {
        this.guardar();
      }
        
      }
    }

    guardar() {
      let consulta1 = "update consultas_cab set defecto = '" + (this.checked ? "1" : "0") + "', fecha = " + this.miPeriodo + ", desde = '" + this.comunicacion.convertirFecha(2, this.fecha1 + "", "yyyy/MM/dd") + "', hasta = '" + this.comunicacion.convertirFecha(2, this.fecha2 + "", "yyyy/MM/dd") + "' where id = " + this.comunicacion.recuperConsultaActual()
      let camposcab={accion: 50030, consulta: consulta1};  
      this.gestionBD.escribirBD(camposcab).subscribe((data: any) =>{
        this.comunicacion.consultaActual(this.miConsulta);
        this.datos.accion = 1;
        this.dialogRef.close(this.datos);
    });  
  }

  quitar() {
    this.comunicacion.consultaActual(-1);
      this.datos.accion = 2;
      this.dialogRef.close(this.datos);
  }
}
