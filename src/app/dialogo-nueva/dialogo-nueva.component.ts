import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ComunicacionService } from '../services/comunicacion.service';
import { GestionApisService } from '../services/gestion-apis.service';

@Component({
  selector: 'app-dialogo-nueva',
  templateUrl: './dialogo-nueva.component.html',
  styleUrls: ['./dialogo-nueva.component.css']
})
export class DialogoNuevaComponent implements OnInit {
  hayError: boolean = false;
  nombreC = new FormControl('', [Validators.required]);
 
  constructor( private gestionBD: GestionApisService, private comunicacion: ComunicacionService,public dialogRef: MatDialogRef<DialogoNuevaComponent>, @Inject(MAT_DIALOG_DATA) public datos: any) { }

  ngOnInit() {
  }

  cancelar(){
    this.dialogRef.close(this.datos);
  }

  validar() {
    if (!this.nombreC.value || this.nombreC.value=="")
    {
      return;
    }
    let eConsulta = this.comunicacion.recuperConsultaActual();
    if (!this.hayError) {
      let consultaN: string  = this.nombreC.value.replace(/['"]+/g, '');
      consultaN = consultaN.replace(/\\/g, "/")
      
      let consulta1 = "insert into consultas_cab (nombre, usuario) VALUES ('" + consultaN + "', " + this.comunicacion.rUsuario().id + ")"
      let camposcab={accion: 50030, consulta: consulta1};  
        this.gestionBD.escribirBD(camposcab).subscribe((data: any) =>{
          let consulta2 = "SELECT max(id) AS ultima from consultas_cab where usuario = " + this.comunicacion.rUsuario().id ;
          let camposcab={accion: 50100, consulta: consulta2};  
            this.gestionBD.consultasBD(camposcab).subscribe((data: any) =>{
              this.comunicacion.consultaActual(data.ultima);
              this.datos.accion = data.ultima;
              this.dialogRef.close(this.datos);
            });             
         });
      }
  }

}
