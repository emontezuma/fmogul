import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, } from '@angular/material';
import { ComunicacionService } from '../services/comunicacion.service';
import { FormControl, Validators } from '@angular/forms';
import { GestionApisService } from '../services/gestion-apis.service';

@Component({
  selector: 'app-dialogo-cambio',
  templateUrl: './dialogo-cambio.component.html',
  styleUrls: ['./dialogo-cambio.component.css']
})
export class DialogoCambioComponent implements OnInit {

  pagersF = new FormControl('', [Validators.required]);
  parteF = new FormControl('', [Validators.required]);
  detalleF = new FormControl('', [Validators.required]);
  maquinaF = new FormControl('', [Validators.required]);
  parteHabilitado: boolean = false;
  errorPartes: string = "";
  desabilitar: boolean = true;

  miDetalle: string = "";
  pager: number = 0;
  miMaquina: number = 0;
  detalleFalla: string = "";
  miPager: any;
  miParte: number = 0;
  hayError1: boolean = false;
  hayError2: boolean = false;
  hayError3: boolean = false;
  hayError4: boolean = false;
  mitxtMaquina: any = "";

  constructor( private gestionBD: GestionApisService, private comunicacion: ComunicacionService, public dialogRef: MatDialogRef<DialogoCambioComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {

    let campos2={accion: 302};
    this.gestionBD.consultasBD(campos2).subscribe((data: any[])=>{
      this.pagers = data});
    let campos3={accion: 10003, filtro: "a.estatus = 'A'", orden: " a.prefijo asc "};
    this.gestionBD.consultasBD(campos3).subscribe((data: any[])=>{this.maquinas = data});
  }

  partes: any[] = [];
  pagers: any[] = [];
  maquinas: any[] = [];

  ngOnInit() {
  }

  cancelar(){
    this.data.accion = 0;
    this.dialogRef.close(this.data);
  }

  validar() {

    this.hayError1 = false
    this.hayError2 = false
    this.hayError3 = false
    this.hayError4 = false
    let salir: boolean = true;
    this.data.pager = this.miPager;
    this.data.parte = this.miParte;
    this.data.maquina = this.miMaquina;
    this.data.detalle = this.miDetalle
    
    if (!this.data.pager) {
      this.hayError1 = true
      salir = false;
    }
    if (!this.data.maquina) {
      this.hayError2 = true
      salir = false;
    }
    if (!this.data.parte) {
      this.hayError3 = true
      salir = false;
    }
    if (!this.data.detalle) {
      this.hayError4 = true
      salir = false;
    }
    if (salir) {
        this.data.accion = 1;
        this.dialogRef.close(this.data);
    }
    else{
      
    }
  }

  cambiarMaquina(event: any) {
    this.partes = [];
    this.parteHabilitado = false;
    let target = event.source.selected._element.nativeElement;
    this.mitxtMaquina = {
      text: target.innerText.trim()
    };

    let campos={accion: 300, filtro: "maquina = " + event.value};
    this.gestionBD.consultasBD(campos).subscribe((data: any[])=>{
      
      this.partes = data
      if (this.partes == null) {
        this.parteHabilitado = true;
      }
    else {
      this.errorPartes = "No se hallaron partes para esta máquina"
    }});
    
  }

  cambiarParte(event: any) {
    let target = event.source.selected._element.nativeElement;
    let selectedData = {
      value: event.value,
      text: target.innerText.trim()
    };
    this.miDetalle = selectedData.text + " SMED MAQ " + this.mitxtMaquina.text; 
  }

}
