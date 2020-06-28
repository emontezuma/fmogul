import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ComunicacionService } from '../services/comunicacion.service';
import { FormControl, Validators } from '@angular/forms';
import { GestionApisService } from '../services/gestion-apis.service';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-dialogo-reproductor',
  templateUrl: './dialogo-reproductor.component.html',
  styleUrls: ['./dialogo-reproductor.component.css']
})
export class DialogoReproductorComponent implements OnInit {

  detalleF = new FormControl('', [Validators.required]);

  fuentes: any = [

    {id: "0", nombre: "(No usar)"},
    {id: "1001", nombre: "Panel de control por Célula (sólo alarmadas)"},
    {id: "1002", nombre: "Panel de control por Máquina (sólo alarmadas)"},
    {id: "1003", nombre: "Panel de control por Área (sólo alarmadas)"},
    {id: "1", nombre: "MTTR por Célula"},
    {id: "2", nombre: "MTTR por Máquina"},
    {id: "3", nombre: "MTTR por Área"},
    {id: "4", nombre: "MTTR por Falla"},
    {id: "5", nombre: "MTTR por Tipo de Máquina"},
    {id: "6", nombre: "MTTR por Agrupador de Máquinas (1)"},
    {id: "7", nombre: "MTTR por Agrupador de Máquinas (2)"},
    {id: "8", nombre: "MTTR por Agrupador de Fallas (1)"},
    {id: "9", nombre: "MTTR por Agrupador de Fallas (2)"},
    {id: "10", nombre: "MTTR por día"},
    {id: "11", nombre: "MTTR por semana"},
    {id: "12", nombre: "MTTR por mes"},
    {id: "13", nombre: "MTTR por Técnico"},
    {id: "101", nombre: "MTBF por Célula"},
    {id: "102", nombre: "MTBF por Máquina"},
    {id: "103", nombre: "MTBF por Área"},
    {id: "104", nombre: "MTBF por Falla"},
    {id: "105", nombre: "MTBF por Tipo de Máquina"},
    {id: "106", nombre: "MTBF por Agrupador de Máquinas (1)"},
    {id: "107", nombre: "MTBF por Agrupador de Máquinas (2)"},
    {id: "108", nombre: "MTBF por Agrupador de Fallas (1)"},
    {id: "109", nombre: "MTBF por Agrupador de Fallas (2)"},
    {id: "110", nombre: "MTBF por día"},
    {id: "111", nombre: "MTBF por semana"},
    {id: "112", nombre: "MTBF por mes"},
    {id: "201", nombre: "Pareto por Célula"},
    {id: "202", nombre: "Pareto por Máquina"},
    {id: "203", nombre: "Pareto por Área"},
    {id: "204", nombre: "Pareto por Falla"},
    {id: "205", nombre: "Pareto por Tipo de Máquina"},
    {id: "206", nombre: "Pareto por Agrupador de Máquinas (1)"},
    {id: "207", nombre: "Pareto por Agrupador de Máquinas (2)"},
    {id: "208", nombre: "Pareto por Agrupador de Fallas (1)"},
    {id: "209", nombre: "Pareto por Agrupador de Fallas (2)"},
    {id: "210", nombre: "Pareto por día"},
    {id: "211", nombre: "Pareto por semana"},
    {id: "212", nombre: "Pareto por mes"},
    {id: "213", nombre: "Pareto por Técnico"},
  ];

  f1: string = "0";
  f2: string = "0";
  f3: string = "0";
  f4: string = "0";
  f5: string = "0";
  f6: string = "0";
  f7: string = "0";
  f8: string = "0";
  f9: string = "0";
  f10: string = "0";
  estatus: boolean = false;
  marquesina: string = "";

  d1: number = 0;
  d2: number = 0;
  d3: number = 0;
  d4: number = 0;
  d5: number = 0;
  d6: number = 0;
  d7: number = 0;
  d8: number = 0;
  d9: number = 0;
  d10: number = 0;
  d12: number = 0;

  constructor(public dialogRef: MatDialogRef<DialogoReproductorComponent>, @Inject(MAT_DIALOG_DATA) public datos: any, public dialog: MatDialog, private comunicacion: ComunicacionService, private gestionBD: GestionApisService) 
  { 
    let campos={accion: 900};
    this.gestionBD.consultasBD(campos).subscribe((data)=>{
      
      if (data) {
        if (!data.marquesina)
        {this.marquesina = "";}
        else
        {this.marquesina = data.marquesina;}
        this.estatus = (data.carpetaimagenes=="S" ? true: false);
        this.d12 = data.duracion;

        let consulta2 = "SELECT * from reproductor ORDER BY orden";
        let camposcab={accion: 50300, consulta: consulta2};  
        this.gestionBD.consultasBD(camposcab).subscribe((data2) =>{
          if (data2) {
            data2.forEach((elemento) => { 
              if (elemento.orden==1)
              {
                this.f1=elemento.grafica;
                this.d1=elemento.duracion;
              }
              if (elemento.orden==2)
              {
                this.f2=elemento.grafica;
                this.d2=elemento.duracion;
              }
              if (elemento.orden==3)
              {
                this.f3=elemento.grafica;
                this.d3=elemento.duracion;
              }
              if (elemento.orden==4)
              {
                this.f4=elemento.grafica;
                this.d4=elemento.duracion;
              }
              if (elemento.orden==5)
              {
                this.f5=elemento.grafica;
                this.d5=elemento.duracion;
              }
              if (elemento.orden==6)
              {
                this.f6=elemento.grafica;
                this.d6=elemento.duracion;
              }
              if (elemento.orden==7)
              {
                this.f7=elemento.grafica;
                this.d7=elemento.duracion;
              }
              if (elemento.orden==8)
              {
                this.f8=elemento.grafica;
                this.d8=elemento.duracion;
              }
              if (elemento.orden==9)
              {
                this.f9=elemento.grafica;
                this.d9=elemento.duracion;
              }
              if (elemento.orden==10)
              {
                this.f10=elemento.grafica;
                this.d10=elemento.duracion;
              }
            })
          }
        })
      }
    });
  }

  ngOnInit() {
  }
  cancelar(){
    this.datos.accion = 0;
    this.dialogRef.close(this.datos);
  }
  
  validar()
  {
      if (this.d1>3600) {this.d1=3600}
      if (this.d2>3600) {this.d2=3600}
      if (this.d3>3600) {this.d3=3600}
      if (this.d4>3600) {this.d4=3600}
      if (this.d5>3600) {this.d5=3600}
      if (this.d6>3600) {this.d6=3600}
      if (this.d7>3600) {this.d7=3600}
      if (this.d8>3600) {this.d8=3600}
      if (this.d9>3600) {this.d9=3600}
      if (this.d10>3600) {this.d10=3600}

      if (this.d1>0 && this.d1<10) {this.d1=10}
      if (this.d2>0 && this.d2<10) {this.d2=10}
      if (this.d3>0 && this.d3<10) {this.d3=10}
      if (this.d4>0 && this.d4<10) {this.d4=10}
      if (this.d5>0 && this.d5<10) {this.d5=10}
      if (this.d6>0 && this.d6<10) {this.d6=10}
      if (this.d7>0 && this.d7<10) {this.d7=10}
      if (this.d8>0 && this.d8<10) {this.d8=10}
      if (this.d1>0 && this.d1<10) {this.d1=10}

      let consultaSQL = "delete from reproductor"
      let camposcab={accion: 50030, consulta: consultaSQL};  
      this.gestionBD.escribirBD(camposcab).subscribe((data: any) =>{
        consultaSQL = "insert into reproductor (orden, grafica, duracion) VALUES (1, " + this.f1 + ", " + this.d1 + "),(2, " + this.f2 + ", " + this.d2 + "),(3, " + this.f3 + ", " + this.d3 + "),(4, " + this.f4 + ", " + this.d4 + "),(5, " + this.f5 + ", " + this.d5 + "),(6, " + this.f6 + ", " + this.d6 + "),(7, " + this.f7 + ", " + this.d7 + "),(8, " + this.f8 + ", " + this.d8 + "),(9, " + this.f9 + ", " + this.d9 + "),(10, " + this.f10 + ", " + this.d10 + ");"
        camposcab={accion: 50030, consulta: consultaSQL};  
        this.gestionBD.escribirBD(camposcab).subscribe((data: any) =>{

          consultaSQL = "update parametros set marquesina = '" + this.marquesina + "', carpetaimagenes = '" + (this.estatus ? "S" : "N") + "', duracion = " + this.d12
          camposcab={accion: 50030, consulta: consultaSQL};  
          this.gestionBD.escribirBD(camposcab).subscribe((data: any) =>{
            this.datos.accion = 1;
            this.dialogRef.close(this.datos);
          });
        });
    });
    }
  
  }
  
