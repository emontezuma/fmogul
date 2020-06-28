import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { ComunicacionService } from '../services/comunicacion.service';
import { GestionApisService } from '../services/gestion-apis.service';
import { MatTableDataSource, MatSort, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { DialogoComponent } from '../dialogo/dialogo.component';

@Component({
  selector: 'app-dialogo-pager',
  templateUrl: './dialogo-pager.component.html',
  styleUrls: ['./dialogo-pager.component.css']
})
export class DialogoPagerComponent implements OnInit {

  nombre1 = new FormControl('', [Validators.required]);
  pager1 = new FormControl('', [Validators.required]);
  
  nombre: string = "";
  hayError1: boolean = true;
  hayError2: boolean = true;
  pager: string = "";
  idParo: string = "";
  
  
  constructor(public dialogRef: MatDialogRef<DialogoPagerComponent>, @Inject(MAT_DIALOG_DATA) public datos: any, public dialog: MatDialog, private comunicacion: ComunicacionService, private gestionBD: GestionApisService) {
      this.idParo = '' + datos.id;
      if (datos.id > 0) 
      {
        let consulta1 = "SELECT * from pagerssmed where id = " + this.idParo;
        let camposcab={accion: 50100, consulta: consulta1};  
        this.gestionBD.consultasBD(camposcab).subscribe((data) =>{
          this.nombre = data.nombre;
          this.pager = data.pager;
      });
    }
  }

  cancelar(){
    this.datos.accion = 0;
    this.dialogRef.close(this.datos);
  }

  eliminar() {
    const dialogRef = this.dialog.open(DialogoComponent, {
      width: '570px', height: '270px', data: { botones: 2, cabecera: 'ELIMINAR PAGER PARA SMED', contenido: 'Esta acción eliminará este pager de la base de datos. ¿Está seguro de esta acción?.', boton1: 'Si, lo eliminaré', boton2: 'No, lo pensaré mejor', tipoMensaje: 'NORMAL' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result)
      {
      }
      else if (result == 1)
      {
        let consulta1 = "delete from pagerssmed WHERE id = " + this.idParo;
        let camposcab={accion: 50030, consulta: consulta1};  
        this.gestionBD.escribirBD(camposcab).subscribe((data: any) =>{
          this.datos.accion = -1;
          this.dialogRef.close(this.datos);
        });
      }
    
  })
}

  validar(){
    this.hayError1=false;
    this.hayError2=false;
    if (this.nombre =="" || !this.nombre)
      {this.hayError1 =true;}
    if (this.pager =="" || !this.pager)
    {this.hayError2 =true;}
    if (!this.hayError1 && !this.hayError2)
    {

    let consulta1 = "SELECT * from pagerssmed where id = " + this.idParo;
        let camposcab={accion: 50100, consulta: consulta1};  
        this.gestionBD.consultasBD(camposcab).subscribe((data) =>{
        if (!data) {
          consulta1 = "insert into pagerssmed (pager, nombre) VALUES (" + this.pager + ", '" + this.nombre +  "');";
        }
        else {
          consulta1 = "update pagerssmed set pager = " + this.pager + ", nombre = '" + this.nombre + "' WHERE id = " + this.idParo;
        }
          camposcab={accion: 50030, consulta: consulta1};  
          this.gestionBD.escribirBD(camposcab).subscribe((data: any) =>{
              this.datos.accion = 1;
            this.dialogRef.close(this.datos);
          });
      });
    }
  }

  ngOnInit() {
  }

}
