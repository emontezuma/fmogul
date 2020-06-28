import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ComunicacionService } from '../services/comunicacion.service';
import { FormControl, Validators } from '@angular/forms';
import { GestionApisService } from '../services/gestion-apis.service';
import { Parametros } from '../parametros';
import { DialogoCambioComponent } from '../dialogo-cambio/dialogo-cambio.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dialogo-ct',
  templateUrl: './dialogo-ct.component.html',
  styleUrls: ['./dialogo-ct.component.css']
})
export class DialogoCTComponent implements OnInit {

  fallaF = new FormControl('', [Validators.required]);
  turnos: any = [];
  parametros: Parametros;
  restan: number = 0;
  tiempoRestante: string = "";
  tiempoVencido: boolean = false;
  fallaOriginal: number = 0;
  miTurno: number = this.data.actTurno;
  obligarCT: boolean = this.comunicacion.rObligar();

  constructor( public datepipe: DatePipe, private gestionBD: GestionApisService, private comunicacion: ComunicacionService, public dialogRef: MatDialogRef<DialogoCambioComponent>, @Inject(MAT_DIALOG_DATA) public data: any)
   { 
    let campos={accion: 900};
    this.gestionBD.consultasBD(campos).subscribe((data: Parametros)=>{
      this.parametros = data;

      if (this.obligarCT) { 
        if (this.parametros.tiempo_cierre_turno > 0) {
          this.restan  = this.parametros.tiempo_cierre_turno;
          this.tiempoRestante ='Cronómetro!';
          setInterval(() => {this.cronometro()}, 1000);
        }      
      }
    });
    let campos2={accion: 1004, filtro: "turnos.estatus = 'A'"};
    this.gestionBD.consultasBD(campos2).subscribe((data: any)=>{
      this.turnos = data});
  }

  ngOnInit() {
  
  }

cronometro() {
      let segundos = 0;    
      let minutos = 0;    
      let horas = 0;
      this.restan = this.restan - 1;
      if (this.restan <=0)
        {
          this.tiempoRestante ='Tiempo vencido!';
          setTimeout(() => {
            //Se toma el turno siguiente;   
          }, 1000);
        }
      else
        {
        let strhoras = '';
        let strminutos = '';
        let strsegundos = '';
        horas = Math.floor(this.restan / 3600);
        minutos = Math.floor((this.restan % 3600) / 60);
        segundos = this.restan % 60 ;
        if (horas > 0)
          {
            strhoras = horas + 'hr ';
          }
        if (minutos > 0) 
          { 
            strminutos = minutos + 'min ';
          }
        if (segundos > 0) 
          { 
            strsegundos = segundos + 'seg ';
          } 
          this.tiempoRestante = 'Restan: ' + strhoras + strminutos + strsegundos;
        }
      }

      validar() {
        let campos2={accion: 1005, id: this.miTurno};
        this.gestionBD.consultasBD(campos2).subscribe((mdatos: any)=>{
          let campo: any = {id: mdatos[0].id, desde: mdatos[0].hora_inicio, hasta: mdatos[0].hora_fin, mover: mdatos[0].mover, referencia: mdatos[0].referencia, secuencia: mdatos[0].secuencia };
          this.comunicacion.aTurno(campo);
          this.dialogRef.close();
        });
      }

      cancelar() {
        this.dialogRef.close();
      }
}
