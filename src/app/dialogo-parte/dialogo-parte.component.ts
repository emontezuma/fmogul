import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { ComunicacionService } from '../services/comunicacion.service';
import { GestionApisService } from '../services/gestion-apis.service';
import { MatTableDataSource, MatSort, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { DialogoComponent } from '../dialogo/dialogo.component';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-dialogo-parte',
  templateUrl: './dialogo-parte.component.html',
  styleUrls: ['./dialogo-parte.component.css']
})
export class DialogoParteComponent implements OnInit {

  maquinasSeleccionadas: any[];
  
 
  numero1 = new FormControl('', [Validators.required]);
  columnas: string[] = [];
  
  
  hayError1: boolean = false;
  hayError2: boolean = false;
  estaMaquina: any;
  numero: string = "";
  maquinas: any = [];
  idParo: string = "";
  
  
  constructor(public dialogRef: MatDialogRef<DialogoParteComponent>, @Inject(MAT_DIALOG_DATA) public datos: any, public dialog: MatDialog, private comunicacion: ComunicacionService, private gestionBD: GestionApisService) {
      let consulta2 = "SELECT id, prefijo FROM maquinas WHERE estatus = 'A' order by prefijo";
      let camposcab={accion: 50300, consulta: consulta2};  
      this.gestionBD.consultasBD(camposcab).subscribe((data: any []) =>{
        this.maquinas = data;
      });
      this.idParo = '' + datos.id;
      if (datos.id > 0) 
      {
        let consulta1 = "SELECT * from partes where id = " + this.idParo + " order by referencia";
        let camposcab={accion: 50100, consulta: consulta1};  
        this.gestionBD.consultasBD(camposcab).subscribe((data) =>{
          this.numero = data.referencia;
          this.estaMaquina = data.maquina;

          let consulta2 = "SELECT maquina as id, prefijo FROM partexmaquina LEFT JOIN maquinas on partexmaquina.maquina = maquinas.id  WHERE parte = " + this.idParo;
          let camposcab={accion: 50300, consulta: consulta2};  
          this.gestionBD.consultasBD(camposcab).subscribe((data: any []) =>{
            this.maquinasSeleccionadas = data;
          });
      });
    }
  }

  cancelar(){
    this.datos.accion = 0;
    this.dialogRef.close(this.datos);
  }

  eliminar() {
    const dialogRef = this.dialog.open(DialogoComponent, {
      width: '570px', height: '270px', data: { botones: 2, cabecera: 'ELIMINAR # DE PARTE SMED', contenido: 'Esta acción eliminará este número de parte de la base de datos. ¿Está seguro de esta acción?.', boton1: 'Si, lo eliminaré', boton2: 'No, lo pensaré mejor', tipoMensaje: 'NORMAL' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result)
      {
      }
      else if (result == 1)
      {
        let consulta1 = "delete from partes WHERE id = " + this.idParo;
        let camposcab={accion: 50030, consulta: consulta1};  
        this.gestionBD.escribirBD(camposcab).subscribe((data: any) =>{
        
          consulta1 = "delete from partexmaquina WHERE parte = " + this.idParo;
          camposcab={accion: 50030, consulta: consulta1};  
          this.gestionBD.escribirBD(camposcab).subscribe((data: any) =>{
            this.datos.accion = -1;
            this.dialogRef.close(this.datos);
        });
      });
    }
  })
}

  validar()
  {
    this.hayError1=false;
    this.hayError2=false;
    if (this.numero =="" || !this.numero)
      {this.hayError1 =true;}
    if (!this.maquinasSeleccionadas)
    {this.hayError2 =true;}
    else if (this.maquinasSeleccionadas.length==0)
    {this.hayError2 =true;}
     
    if (!this.hayError1 && !this.hayError2)
    {
        let consulta1 = "SELECT * from partes where id = " + this.idParo;
        let camposcab={accion: 50100, consulta: consulta1};  
        this.gestionBD.consultasBD(camposcab).subscribe((data) =>{
          let agregar = false;
        if (!data) {
          consulta1 = "insert into partes (referencia) VALUES ('" + this.numero + "');";
          agregar = true;
        }
        else {
          consulta1 = "update partes set referencia = '" + this.numero + "' WHERE id = " + this.idParo;
        }
          camposcab={accion: 50030, consulta: consulta1};  
          this.gestionBD.escribirBD(camposcab).subscribe((data: any) =>{
            if (agregar)
            {
              consulta1 = "select MAX(id) as maximo from partes";
              camposcab={accion: 50100, consulta: consulta1};  
              this.gestionBD.consultasBD(camposcab).subscribe((data) =>{
                this.idParo = data.maximo;
                this.cargarDetalle();
              })
            }
            else
            {
              this.cargarDetalle();
            }        
        });
      });
    }
  }

  cargarDetalle()
  {
    let consulta1 = "delete from partexmaquina where parte = " + this.idParo;
    let camposcab={accion: 50030, consulta: consulta1};  
    this.gestionBD.escribirBD(camposcab).subscribe((data: any) =>{
    if (this.maquinasSeleccionadas.length>0){
      consulta1 = "insert into partexmaquina (parte, maquina) VALUES ";
      this.maquinasSeleccionadas.forEach((pager, index) => {
        consulta1 = consulta1 + "(" + this.idParo + ", " + pager.id + "),";
        if (index == this.maquinasSeleccionadas.length - 1)
        {
          camposcab={accion: 50030, consulta: consulta1.substr(0, consulta1.length - 1)};  
          this.gestionBD.escribirBD(camposcab).subscribe((data: any) =>{
            this.datos.accion = 1;
            this.dialogRef.close(this.datos);
            })
        }
      })
    }
    
  })
}

ngOnInit() {
  }

  selectAll(select: NgModel, values) {
    select.update.emit(values); 
  }

  deselectAll(select: NgModel) {
    select.update.emit([]); 
  }

  equals(objOne, objTwo) {
    if (typeof objOne !== 'undefined' && typeof objTwo !== 'undefined') {
      return objOne.id === objTwo.id;
    }
  }

}
