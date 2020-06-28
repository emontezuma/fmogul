import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, } from '@angular/material';
import { ComunicacionService } from '../services/comunicacion.service';
import { FormControl, Validators } from '@angular/forms';
import { GestionApisService } from '../services/gestion-apis.service';
import { MatDialog } from '@angular/material';
import { DialogoComponent } from '../dialogo/dialogo.component';

@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.component.html',
  styleUrls: ['./inicio-sesion.component.css']
})
export class InicioSesionComponent implements OnInit {

  nombre1 = new FormControl('', [Validators.required]);
  clave1 = new FormControl('', [Validators.required]);
  nombre: string = "";
  clave: string = "";

  hayError1: boolean = false;
  hayError2: boolean = false;

  constructor(public dialogRef: MatDialogRef<InicioSesionComponent>, @Inject(MAT_DIALOG_DATA) public datos: any, public dialog: MatDialog, private comunicacion: ComunicacionService, private gestionBD: GestionApisService) {
  }

validar(){
  if (this.nombre && !this.clave)
    {
      let consulta1 = "SELECT usuarios.*, politicas.diasvencimiento, politicas.vence, politicas.aviso, politicas.deunsolouso from usuarios left join politicas on usuarios.politica = politicas.id  where usuarios.referencia = '" + this.nombre + "' and usuarios.estatus = 'A'";
      let camposcab={accion: 50100, consulta: consulta1};  
      this.gestionBD. consultasBD(camposcab).subscribe((data) =>{
        if (data)
        {
          if (data.inicializada=="S")
            {
              this.comunicacion.aUsuario({id: data.id, nombre: data.nombre, rol: data.rol, politica: data.politica, admin: data.admin, tecnico: data.tecnico})
              this.inicializarClave();
            }
          else if (!data.contrasena)
            {
              if (data.caducado=="S")
                {
                  this.comunicacion.aUsuario({id: data.id, nombre: data.nombre, rol: data.rol, politica: data.politica, admin: data.admin, tecnico: data.tecnico})
                  this.caducada();
                }
              else if (data.ultimocambio && data.vence=="S" && data.diasvencimiento && data.diasvencimiento>0)
                {
                  let diferencia = ((new Date().getTime() - new Date(this.comunicacion.convertirFecha(2, data.ultimocambio, "yyyy/MM/dd HH:mm:ss")).getTime()) / (1000 * 24 * 60 * 60)).toFixed(0);
                  if (+diferencia>=data.diasvencimiento) {
                    this.comunicacion.aUsuario({id: data.id, nombre: data.nombre, rol: data.rol, politica: data.politica, admin: data.admin, tecnico: data.tecnico})
                    this.caducada();
                  }
                  else if (data.diasvencimiento-+diferencia<=data.aviso && data.aviso>0) {
                    this.comunicacion.aUsuario({id: data.id, nombre: data.nombre, rol: data.rol, politica: data.politica, admin: data.admin, tecnico: data.tecnico})
                    this.datos.accion=1;
                    this.datos.anunciar=data.diasvencimiento-+diferencia;
                    this.dialogRef.close(this.datos);   
                  }
                  else
                  {
                  //No es obligatoria la contraseña
                    this.comunicacion.aUsuario({id: data.id, nombre: data.nombre, rol: data.rol, politica: data.politica, admin: data.admin, tecnico: data.tecnico})
                    this.datos.accion=1;
                    this.datos.anunciar=0;
                    this.dialogRef.close(this.datos);   
                  }
                }
              else
              {
              //No es obligatoria la contraseña
                this.comunicacion.aUsuario({id: data.id, nombre: data.nombre, rol: data.rol, politica: data.politica, admin: data.admin, tecnico: data.tecnico})
                this.datos.accion=1;
                this.datos.anunciar=0;
                this.dialogRef.close(this.datos);   
              }
            }
          
          else{
            this.continuarValidando()
          }
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
    let consulta1 = "SELECT usuarios.*, politicas.diasvencimiento, politicas.aviso, politicas.deunsolouso from usuarios left join politicas on usuarios.politica = politicas.id where usuarios.referencia = '" + this.nombre + "' and usuarios.contrasena = '" + this.clave + "'";
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
          else if (data.inicializada=="S")
          {
            this.comunicacion.aUsuario({id: data.id, nombre: data.nombre, rol: data.rol, politica: data.politica, admin: data.admin, tecnico: data.tecnico})
            this.inicializarClave();
          }
          else if (data.caducado=="X")
          {
            const dialogRef = this.dialog.open(DialogoComponent, {
              width: '470px', height: '230px', data: { botones: 1, cabecera: 'INICIO DE SESIÓN FALLIDA', contenido: 'Este usuario ya utilizó su inicio de sesión (usuarios de un sólo uso)', boton1: 'Aceptar', boton2: '', tipoMensaje: 'ALARMA' }
            });
            dialogRef.afterClosed().subscribe(result => {
          })
          }
          else if (data.caducado=="S")
          {
            this.comunicacion.aUsuario({id: data.id, nombre: data.nombre, rol: data.rol, politica: data.politica, admin: data.admin, tecnico: data.tecnico})
            this.caducada();
          }
        else if (data.estatus != "A")
         {
            const dialogRef = this.dialog.open(DialogoComponent, {
              width: '470px', height: '230px', data: { botones: 1, cabecera: 'INICIO DE SESIÓN FALLIDA', contenido: 'El usuario no está activo en el sistema', boton1: 'Aceptar', boton2: '', tipoMensaje: 'ALARMA' }
            });
            dialogRef.afterClosed().subscribe(result => {
          })
          }
          else if (data.ultimocambio && data.vence=="S" && data.diasvencimiento && data.diasvencimiento>0)
          {
            let diferencia = ((new Date().getTime() - new Date(this.comunicacion.convertirFecha(2, data.ultimocambio, "yyyy/MM/dd HH:mm:ss")).getTime()) / (1000 * 24 * 60 * 60)).toFixed(0);
            if (+diferencia>=data.diasvencimiento) {
              this.comunicacion.aUsuario({id: data.id, nombre: data.nombre, rol: data.rol, politica: data.politica, admin: data.admin, tecnico: data.tecnico})
              this.caducada();
            }
            else if (data.diasvencimiento-+diferencia<=data.aviso && data.aviso>0) {
              this.comunicacion.aUsuario({id: data.id, nombre: data.nombre, rol: data.rol, politica: data.politica, admin: data.admin, tecnico: data.tecnico})
              this.datos.accion=1;
              this.datos.anunciar=data.diasvencimiento-+diferencia;
              this.dialogRef.close(this.datos);   
            }
            else
          {
            this.comunicacion.aUsuario({id: data.id, nombre: data.nombre, rol: data.rol, politica: data.politica, admin: data.admin, tecnico: data.tecnico})
            this.datos.accion=1;
            this.datos.anunciar=0;
            this.dialogRef.close(this.datos);   
          }
          }
                  
          else
          {
            this.comunicacion.aUsuario({id: data.id, nombre: data.nombre, rol: data.rol, politica: data.politica, admin: data.admin, tecnico: data.tecnico})
            this.datos.accion=1;
            this.datos.anunciar=0;
            this.dialogRef.close(this.datos);   
          }
    });
  }
}

cancelar()
{
  this.datos.accion=0;
this.dialogRef.close(this.datos);   
}

ngOnInit() {
}

inicializarClave()
{
  //Contraseña inicializada
  
  this.datos.accion=2;
  this.dialogRef.close(this.datos);   
  
}

caducada()
{
  //Contraseña inicializada
  
  this.datos.accion=3;
  this.dialogRef.close(this.datos);   
  
}

enviarMail()
{
  alert('No implementado!')
}

}

