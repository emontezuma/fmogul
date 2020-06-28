import { Component, OnInit, Inject } from '@angular/core';
import { ComunicacionService } from '../services/comunicacion.service';
import { GestionApisService } from '../services/gestion-apis.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-dialogo-configuracion',
  templateUrl: './dialogo-configuracion.component.html',
  styleUrls: ['./dialogo-configuracion.component.css']
})
export class DialogoConfiguracionComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogoConfiguracionComponent>, @Inject(MAT_DIALOG_DATA) public datos: any, public dialog: MatDialog, private comunicacion: ComunicacionService, private gestionBD: GestionApisService) {

      let consulta2 = "SELECT serial from locations LIMIT 1" ;
        let camposcab={accion: 50200, consulta: consulta2};  
          this.gestionBD.consultasBD(camposcab).subscribe((serialMMCALL: any) =>{
          if (serialMMCALL) {
            this.serial = serialMMCALL.serial;
            let campos={accion: 900};
            this.gestionBD.consultasBD(campos).subscribe((data)=>{
              if (data) {
                this.nPlanta = data.planta;
                this.mttr = data.mttr;
                this.mtbf = data.mtbf;
                this.mtbflbl = data.textomtbf;
                this.tiempoCierre = data.tiempo_reporte;
                this.mttrlbl = data.textomttr;
                this.pareto = data.valorpareto;
                this.clave = data.clave;
                this.paretolbl = data.textopareto;
                this.mttrH = (+this.mttr / 3600).toFixed(2) + "hr";
                this.mtbfH = (+this.mtbf / 3600).toFixed(2) + "hr";
                let consulta2 = "SELECT * from disponibilidad where maquina = 0 LIMIT 1" ;
                  let camposcab={accion: 50100, consulta: consulta2};  
                    this.gestionBD.consultasBD(camposcab).subscribe((data2) =>{
                    if (data2) {
                      this.lunes = data2.lunes;
                      this.martes = data2.martes;
                      this.miercoles = data2.miercoles;
                      this.jueves = data2.jueves;
                      this.viernes = data2.viernes;
                      this.sabado = data2.sabado;
                      this.domingo = data2.domingo;
                    }  
                });
              }
            });
          }  
        });
    
   }
   
  nPlanta1 = new FormControl('', [Validators.required]);
  serial1 = new FormControl('', [Validators.required]);
  clave1 = new FormControl('', [Validators.required]);
  mttr1 = new FormControl('', [Validators.required, Validators.min(0), Validators.max(99999999)]);
  mtbf1 = new FormControl('', [Validators.required, Validators.min(0), Validators.max(99999999)]);
  mttrlbl1 = new FormControl('', [Validators.required]);
  mtbflbl1 = new FormControl('', [Validators.required]);
  pareto1 = new FormControl('', [Validators.required, Validators.min(0), Validators.max(999)]);
  paretolbl1 = new FormControl('', [Validators.required]);
  lunes1 = new FormControl('', [Validators.required, Validators.min(0), Validators.max(999999)]);
  martes1 = new FormControl('', [Validators.required, Validators.min(0), Validators.max(999999)]);
  miercoles1 = new FormControl('', [Validators.required, Validators.min(0), Validators.max(999999)]);
  jueves1 = new FormControl('', [Validators.required, Validators.min(0), Validators.max(999999)]);
  viernes1 = new FormControl('', [Validators.required, Validators.min(0), Validators.max(999999)]);
  sabado1 = new FormControl('', [Validators.required, Validators.min(0), Validators.max(999999)]);
  domingo1 = new FormControl('', [Validators.required, Validators.min(0), Validators.max(999999)]);
  tiempoCierre1 = new FormControl('', [Validators.required, Validators.min(0), Validators.max(999999)]);
  
  nPlanta: string = "";
  serial: string = "";
  clave: string = "";
  mttr: string = "";
  mtbf: string = "";
  mttrlbl: string = "";
  mtbflbl: string = "";
  pareto: string = "";
  paretolbl: string = "";
   mttrH: string = "0.00hr";
   mtbfH: string = "0.00hr";
   lunes: string = "";
   martes: string = "";
   miercoles: string = "";
   jueves: string = "";
   viernes: string = "";
   sabado: string = "";
   domingo: string = "";
   tiempoCierre: string = "";

   hayError01: boolean = false;
   hayError02: boolean = false;
   hayError03: boolean = false;
   hayError04: boolean = false;
   hayError05: boolean = false;
   hayError06: boolean = false;
   hayError07: boolean = false;
   hayError08: boolean = false;
   
   calculoMTTR() {
    this.mttrH = (+this.mttr / 3600).toFixed(2) + "hr"
  }

  calculoMTBF() {
    this.mtbfH = (+this.mtbf / 3600).toFixed(2) + "hr"
  }

  validar()
  {
    this.hayError01 = false;
    this.hayError02 = false;
    this.hayError03 = false;
    this.hayError04 = false;
    this.hayError05 = false;
    this.hayError06 = false;
    this.hayError07 = false;
    this.hayError08 = false;
    
    if (!this.nPlanta) {
      this.hayError01 = true;
    }
    if (!this.mttr) {
      this.hayError02 = true;
    }
    if (!this.mttrlbl) {
      this.hayError03 = true;
    }
    if (!this.clave) {
      this.hayError08 = true;
    }
    
    if (!this.mtbf) {
      this.hayError04 = true;
    }
    if (!this.mtbflbl) {
      this.hayError05 = true;
    }
    if (!this.pareto) {
      this.hayError06 = true;
    }
    if (!this.paretolbl) {
      this.hayError07 = true;
    } 
    if (!this.hayError01 && !this.hayError02 && !this.hayError03 && !this.hayError04 && !this.hayError05 && !this.hayError06 && !this.hayError07 && !this.hayError08)
      {
        if (!this.tiempoCierre) {this.tiempoCierre ="0"};
        let consulta1 = "SELECT * from parametros LIMIT 1";
        let camposcab={accion: 50100, consulta: consulta1};  
        this.gestionBD.consultasBD(camposcab).subscribe((data) =>{
        if (!data) {
          consulta1 = "insert into parametros (planta, clave, tiempo_reporte, mttr, mtbf, textomttr, textomtbf, valorpareto, textopareto) VALUES ('" + this.nPlanta + "', '" + this.clave + "', '" + this.tiempoCierre + "', '" + this.mttr + "', '" + this.mtbf + "', '" + this.mttrlbl + "', '" + this.mtbflbl + "', '" + this.pareto + "', '" + this.paretolbl + "');";
        }
        else {
          consulta1 = "update parametros set planta = '" + this.nPlanta + "', clave = '" + this.clave + "', tiempo_reporte = " + this.tiempoCierre + ", mttr = " + this.mttr + ", mtbf = " + this.mtbf + ", textomttr = '" + this.mttrlbl + "', textomtbf = '" + this.mtbflbl + "', valorpareto = " + this.pareto + ", textopareto = '" + this.paretolbl + "'";
        }
        camposcab={accion: 50030, consulta: consulta1};  
          this.gestionBD.escribirBD(camposcab).subscribe((data: any) =>{
            this.guardar01();
        });
      });
    }
  }
    guardar01() {
      if (!this.lunes) {this.lunes ="0"};
      if (!this.martes) {this.martes ="0"};
      if (!this.miercoles) {this.miercoles ="0"};
      if (!this.jueves) {this.jueves ="0"};
      if (!this.viernes) {this.viernes ="0"};
      if (!this.sabado) {this.sabado ="0"};
      if (!this.domingo) {this.domingo ="0"};
      let consulta1 = "SELECT * from disponibilidad where maquina = 0 LIMIT 1" ;
      let camposcab={accion: 50100, consulta: consulta1};  
      this.gestionBD.consultasBD(camposcab).subscribe((data) =>{
      if (!data) {
        consulta1 = "insert into disponibilidad (maquina, lunes, martes, miercoles, jueves, viernes, sabado, domingo) VALUES (0, " + this.lunes + ", " + this.martes + ", " + this.miercoles + ", " + this.jueves + ", " + this.viernes + ", " + this.sabado + ", " + this.domingo + ");";        
      }
      else {
        consulta1 = "update disponibilidad set lunes = " + this.lunes + ", martes = " + this.martes + ", miercoles = " + this.miercoles + ", jueves  = " + this.jueves + ", viernes = " + this.viernes + ", sabado  = " + this.sabado + ", domingo  = " + this.domingo + " WHERE maquina = 0;";    
      }
      camposcab={accion: 50030, consulta: consulta1};  
        this.gestionBD.escribirBD(camposcab).subscribe((data: any) =>{
          this.datos.accion = 1;
          this.dialogRef.close(this.datos);
        });
      });
    }

    cancelar(){
      this.datos.accion = 0;
      this.dialogRef.close(this.datos);
    }

  ngOnInit() {
  }

}
