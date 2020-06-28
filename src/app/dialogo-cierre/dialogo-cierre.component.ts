import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ComunicacionService } from '../services/comunicacion.service';
import { FormControl, Validators } from '@angular/forms';
import { GestionApisService } from '../services/gestion-apis.service';
import { Parametros } from '../parametros';
import { SolicitarTecnicoComponent } from '../solicitar-tecnico/solicitar-tecnico.component';
import { NuevaClaveComponent } from '../nueva-clave/nueva-clave.component';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-dialogo-cierre',
  templateUrl: './dialogo-cierre.component.html',
  styleUrls: ['./dialogo-cierre.component.css']
})
export class DialogoCierreComponent implements OnInit {

  fallaF = new FormControl('', [Validators.required]);
  tipoF = new FormControl('', [Validators.required]);
  detalleF = new FormControl('', [Validators.required]);
  
  fallas: any = [];
  
  parametros: Parametros;
  restan: number = 0;
  tiempoRestante: string = "";
  tiempoVencido: boolean = false
  fallaOriginal: number = 0;
  tipoFalla: number = 0;
  detalleFalla: string = "";
  hayError1: boolean = false;
  hayError2: boolean = false;
  hayError3: boolean = false;
  hayError4: boolean = false;

  constructor(public snackBar: MatSnackBar, public dialogRef: MatDialogRef<SolicitarTecnicoComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog, private gestionBD: GestionApisService, private comunicacion: ComunicacionService ) { 
    this.fallaOriginal = data.falla;
     this.detalleFalla = data.detalle;
    let campos={accion: 900};
     this.gestionBD.consultasBD(campos).subscribe((data: Parametros)=>{
      this.parametros = data;
      if (this.parametros.tiempo_reporte > 0) {
        this.restan  = this.parametros.tiempo_reporte;
        this.tiempoRestante ='Cronómetro!';
        setInterval(() => {this.cronometro()}, 1000);
      }
    });
    let campos2={accion: 1001, filtro: "fallas.estatus = 'A' and (fallas.celula = 0 or fallas.celula = " + data.celula + ")"};
      this.gestionBD.consultasBD(campos2).subscribe((datos: any[])=>{
        this.fallas = datos;
        this.fallaOriginal = data.falla});
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
        let salir: boolean = true;
        this.hayError1 = false;
        this.hayError2 = false;
        this.hayError3 = false;
        this.data.tiempo = this.parametros.tiempo_reporte - this.restan ;
        this.data.detalle = this.detalleFalla;
        this.data.falla = this.fallaOriginal;
        this.data.tipo = this.tipoFalla;
        if (!this.data.falla) {
          this.hayError1 = true
          salir = false;
        }
        if (!this.data.tipo) {
          this.hayError2 = true
          salir = false;
        }
        if (!this.data.detalle) {
          this.hayError3 = true
          salir = false;
        }
        if (salir) {
          //Se solicita usuario
            if (this.comunicacion.rUsuario().tecnico!="S")
              {
              const dialogRef = this.dialog.open(SolicitarTecnicoComponent, {
              disableClose: true, width: '400px', height: '440px', data: { accion: 0 }
              });
              this.comunicacion.mostrarNota.emit("Identificación del técnico");
              dialogRef.afterClosed().subscribe(result => {
              
              if (!result) {
              }
              else if (result.accion ==0) {
              }
              else if(result.accion == 2)
              {
                const dialogRef = this.dialog.open(NuevaClaveComponent, {
                  width: '400px', height: '370px', data: { accion: 0 }
                });
                dialogRef.afterClosed().subscribe(result => {
                  if (result.accion==0)
                  {this.toast('custom-class-red', 'No se realizó el cambio de usuario', 3000 );
                  }
              })
              }
              else if(result.accion == 1)
              {
                this.continuarCierre()
              }
              })
        }
        else
        {
          this.comunicacion.aTecnico({id: this.comunicacion.rUsuario().id, nombre: this.comunicacion.rUsuario().nombre})
          this.continuarCierre()
        }
    }
  }
    continuarCierre()
    {
      this.data.tecnico = this.comunicacion.rTecnico().id;
      this.data.accion = 1;
      this.dialogRef.close(this.data);
    }

    toast(clase: string, mensaje: string, duracion: number) {
      let config = new MatSnackBarConfig();
        config.panelClass = [clase];
        config.duration = duracion;
        config.verticalPosition='bottom';
        this.snackBar.open(mensaje, null, config);
    }
  }
