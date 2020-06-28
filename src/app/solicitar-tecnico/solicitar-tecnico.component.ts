import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, } from '@angular/material';
import { ComunicacionService } from '../services/comunicacion.service';
import { FormControl, Validators } from '@angular/forms';
import { GestionApisService } from '../services/gestion-apis.service';
import { MatDialog } from '@angular/material';
import { DialogoComponent } from '../dialogo/dialogo.component';

@Component({
  selector: 'app-solicitar-tecnico',
  templateUrl: './solicitar-tecnico.component.html',
  styleUrls: ['./solicitar-tecnico.component.css']
})
export class SolicitarTecnicoComponent implements OnInit {

  nombre1 = new FormControl('', [Validators.required]);
  clave1 = new FormControl('', [Validators.required]);
  nombre: string = "";
  clave: string = "";

  hayError1: boolean = false;
  hayError2: boolean = false;

  constructor(public dialogRef: MatDialogRef<SolicitarTecnicoComponent>, @Inject(MAT_DIALOG_DATA) public datos: any, public dialog: MatDialog, private comunicacion: ComunicacionService, private gestionBD: GestionApisService) {
  }

  validar(){
    if (this. nombre && !this.clave)
      {
      let consulta1 = "SELECT * from usuarios where referencia = '" + this.nombre + "' and estatus = 'A'";
        let camposcab={accion: 50100, consulta: consulta1};  
        this.gestionBD.consultasBD(camposcab).subscribe((data) =>{
          if (data)
          {
            if (data.inicializada=="S")
            {
              this.comunicacion.aUsuario({id: data.id, nombre: data.nombre, rol: data.rol, politica: data.politica, admin: data.admin, tecnico: data.tecnico})
              this.inicializarClave();
            }
            else if (data.tecnico!="S")
            {
              const dialogRef = this.dialog.open(DialogoComponent, {
                width: '470px', height: '280px', data: { botones: 1, cabecera: 'INICIO DE SESIÓN FALLIDA', contenido: 'El usuario especificado NO es un técnico. Comuníquese con el administrador del sistema', boton1: 'Aceptar', boton2: '', tipoMensaje: 'ALARMA' }
              });
              dialogRef.afterClosed().subscribe(result => {
            })
            }
            else if (!data.contrasena)
            {
              //No es obligatoria la contraseña
              this.comunicacion.aTecnico({id: data.id, nombre: data.nombre});
              this.datos.accion=1;
              this.dialogRef.close(this.datos);   
            }
            
            else{
              this.continuarValidando()
            }
          }
          else
          {
            const dialogRef = this.dialog.open(DialogoComponent, {
              width: '470px', height: '280px', data: { botones: 1, cabecera: 'INICIO DE SESIÓN FALLIDA', contenido: 'El usuario especificado NO está registrado o no está activo. Comuníquese con el administrador del sistema', boton1: 'Aceptar', boton2: '', tipoMensaje: 'ALARMA' }
            });
            dialogRef.afterClosed().subscribe(result => {
          })
          }
      })
    }
    else
    {
      this.continuarValidando();
    }
  }
  
  continuarValidando()
  {
    this.hayError1=false;
    this.hayError2=false;
    if (this.nombre =="" || !this.nombre)
      {this.hayError1 =true}
    if (this.clave =="" || !this.clave)
      {this.hayError2 =true;}
    if (!this.hayError1 && !this.hayError2)
    {
      let consulta1 = "SELECT * from usuarios where referencia = '" + this.nombre + "' and contrasena = '" + this.clave + "'";
        let camposcab={accion: 50100, consulta: consulta1};  
        this.gestionBD.consultasBD(camposcab).subscribe((data) =>{
          if (!data)
          {
              const dialogRef = this.dialog.open(DialogoComponent, {
                width: '470px', height: '230px', data: { botones: 1, cabecera: 'INICIO DE SESIÓN FALLIDA', contenido: 'El usuario o la contraseña no coinciden', boton1: 'Aceptar', boton2: '', tipoMensaje: 'ALARMA' }
              });
              dialogRef.afterClosed().subscribe(result => {
            })
            }
            else if (data.estatus != "A")
           {
              const dialogRef = this.dialog.open(DialogoComponent, {
                width: '470px', height: '230px', data: { botones: 1, cabecera: 'INICIO DE SESIÓN FALLIDA', contenido: 'El usuario no está activo en el sistema', boton1: 'Aceptar', boton2: '', tipoMensaje: 'ALARMA' }
              });
              dialogRef.afterClosed().subscribe(result => {
            })
            }
            else if (data.tecnico!="S")
            {
              const dialogRef = this.dialog.open(DialogoComponent, {
                width: '470px', height: '280px', data: { botones: 1, cabecera: 'INICIO DE SESIÓN FALLIDA', contenido: 'El usuario especificado NO es un técnico. Comuníquese con el administrador del sistema', boton1: 'Aceptar', boton2: '', tipoMensaje: 'ALARMA' }
              });
              dialogRef.afterClosed().subscribe(result => {
            })
            }
            else if (data.inicializada=="S")
            {
              const dialogRef = this.dialog.open(DialogoComponent, {
                width: '470px', height: '280px', data: { botones: 1, cabecera: 'INICIO DE SESIÓN FALLIDA', contenido: 'Al usuario especificado se le ha inicializado la contraseña. Inicie sesión con otra opción y restablezca la contraseña.', boton1: 'Aceptar', boton2: '', tipoMensaje: 'ALARMA' }
              });
              dialogRef.afterClosed().subscribe(result => {
            })
            }
            
          
            else
            {
              this.comunicacion.aTecnico({id: data.id, nombre: data.nombre})
              this.datos.accion=1;
              this.dialogRef.close(this.datos);   
            }
      });
    }
  }
  

  inicializarClave()
{
  //Contraseña inicializada
  
  this.datos.accion=2;
  this.dialogRef.close(this.datos);   
  
}
cancelar()
{
  this.datos.accion=0;
this.dialogRef.close(this.datos);   
}

ngOnInit() {
}

enviarMail()
{
  alert('No implementado!')
}
}

