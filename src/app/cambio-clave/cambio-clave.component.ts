import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, } from '@angular/material';
import { ComunicacionService } from '../services/comunicacion.service';
import { FormControl, Validators } from '@angular/forms';
import { GestionApisService } from '../services/gestion-apis.service';
import { MatDialog } from '@angular/material';
import { DialogoComponent } from '../dialogo/dialogo.component';

@Component({
  selector: 'app-cambio-clave',
  templateUrl: './cambio-clave.component.html',
  styleUrls: ['./cambio-clave.component.css']
})
export class CambioClaveComponent implements OnInit {

  @ViewChild("txtClave") miEemento: ElementRef;
  @ViewChild("txtClave2") miEemento2: ElementRef;

  clave1 = new FormControl('', [Validators.required]);
  clave21 = new FormControl('', [Validators.required]);
  clave31 = new FormControl('', [Validators.required]);
  clave: string = "";
  clave2: string = "";
  clave3: string = "";
  MensajeError: string ="Campo obligatorio"
  MensajeError2: string ="Campo obligatorio"

  hayError1: boolean = false;
  hayError2: boolean = false;
  hayError3: boolean = false;

  vermiClave: boolean = false;
  vermiClave2: boolean = false;
  vermiClave3: boolean = false;
  obligada: boolean = true;

  constructor(public dialogRef: MatDialogRef<CambioClaveComponent>, @Inject(MAT_DIALOG_DATA) public datos: any, public dialog: MatDialog, private comunicacion: ComunicacionService, private gestionBD: GestionApisService) {
  }

validar(){
  let consulta1="";
  let fecha = "";
  consulta1 = "SELECT count(*) as trec from politicas where id = " + this.comunicacion.rUsuario().politica + " and obligatoria = 'N' and estatus = 'A'"
  let camposcab={accion: 50100, consulta: consulta1};  
  this.gestionBD.consultasBD(camposcab).subscribe((data) =>{
  if (data.trec > 0)
  {
    this.obligada = false;
  }
    this.continuar()
  })
}

continuar()
{
  if (!this.clave && !this.clave2 && !this.clave3 && !this.obligada)
  {

    let consulta1 = "SELECT * from usuarios where id = " + this.comunicacion.rUsuario().id + " AND estatus = 'A'";
    let camposcab2={accion: 50100, consulta: consulta1};  
    this.gestionBD.consultasBD(camposcab2).subscribe((data) =>{
      if (!data)
      {
          const dialogRef = this.dialog.open(DialogoComponent, {
            width: '470px', height: '230px', data: { botones: 1, cabecera: 'INICIO DE SESIÓN FALLIDA', contenido: 'El usuario no existe o no está activo. Comuníquese con el administrador del sistema', boton1: 'Aceptar', boton2: '', tipoMensaje: 'ALARMA' }
          });
          dialogRef.afterClosed().subscribe(result => {
        })
      }
      else
      {
        if (data.contrasena)
        {
          this.hayError1 = true;
          this.MensajeError="La contraseña actual no coincide"
          this.miEemento.nativeElement.focus();
        }
      else
          {
        //Se graba la contraseña
        this.grabarClave();
          }
        }
      })   
  }
  else if (!this.clave2 && !this.clave3 && !this.obligada)
  {
    let consulta1 = "SELECT * from usuarios where id = " + this.comunicacion.rUsuario().id + " AND estatus = 'A'";
    let camposcab2={accion: 50100, consulta: consulta1};  
    this.gestionBD.consultasBD(camposcab2).subscribe((data) =>{
      if (!data)
      {
          const dialogRef = this.dialog.open(DialogoComponent, {
            width: '470px', height: '230px', data: { botones: 1, cabecera: 'INICIO DE SESIÓN FALLIDA', contenido: 'El usuario no existe o no está activo. Comuníquese con el administrador del sistema', boton1: 'Aceptar', boton2: '', tipoMensaje: 'ALARMA' }
          });
          dialogRef.afterClosed().subscribe(result => {
        })
      }
      else
      {
        if (this.clave != data.contrasena)
        {
          this.hayError1 = true;
          this.MensajeError="La contraseña actual no coincide"
          this.miEemento.nativeElement.focus();
        }
        else
        {
          this.grabarClave();
        }
      }
    })
  }
  else
  {
    this.validarSegunda();
  }
}

  validarSegunda()
{
  let claveBlanco=false;
  let consulta1 = "SELECT contrasena from usuarios where id = " + this.comunicacion.rUsuario().id + " AND estatus = 'A'";
    let camposcab2={accion: 50100, consulta: consulta1};  
    this.gestionBD.consultasBD(camposcab2).subscribe((data) =>{
    if (!data.contrasena)
    {
        claveBlanco=true
    }
  
  this.hayError1=false;
  this.hayError2=false;
  this.hayError3=false;
  this.MensajeError ="Campo obligatorio"
  this.MensajeError2 ="Campo obligatorio"
  if ((this.clave =="" || !this.clave) && !claveBlanco)
    {this.hayError1 =true}
  if (this.clave2 =="" || !this.clave2)
    {this.hayError2 =true;}
  if (this.clave3 =="" || !this.clave3)
    {this.hayError3 =true;}
    if (!this.hayError1 && !this.hayError2 && !this.hayError3)
  {
    if (this.clave2 != this.clave3 )
    {
      this.hayError3=true;
      this.MensajeError2 ="Confirmación incorrecta!"
      this.miEemento2.nativeElement.focus();
    }
    else {

      let consulta1 = "SELECT * from usuarios where id = " + this.comunicacion.rUsuario().id + " AND estatus = 'A'";
      let camposcab2={accion: 50100, consulta: consulta1};  
      this.gestionBD.consultasBD(camposcab2).subscribe((data) =>{
        if (!data)
        {
            const dialogRef = this.dialog.open(DialogoComponent, {
              width: '470px', height: '230px', data: { botones: 1, cabecera: 'INICIO DE SESIÓN FALLIDA', contenido: 'El usuario no existe o no está activo. Comuníquese con el administrador del sistema', boton1: 'Aceptar', boton2: '', tipoMensaje: 'ALARMA' }
            });
            dialogRef.afterClosed().subscribe(result => {
          })
          }
          else
          {
            if (this.clave != data.contrasena)
            {
              this.hayError1 = true;
              this.MensajeError="La contraseña actual no coincide"
              this.miEemento.nativeElement.focus();
            }
            else {
              consulta1 = "SELECT * from politicas where id = " + this.comunicacion.rUsuario().politica + " and estatus = 'A'"
              let camposcab={accion: 50100, consulta: consulta1};  
              this.gestionBD.consultasBD(camposcab).subscribe((data) =>{
                if (!data)
                  {
                      const dialogRef = this.dialog.open(DialogoComponent, {
                        width: '470px', height: '230px', data: { botones: 1, cabecera: 'INICIO DE SESIÓN FALLIDA', contenido: 'La política del usuario no existe o no está activa. Comuníquese con el administrador del sistema', boton1: 'Aceptar', boton2: '', tipoMensaje: 'ALARMA' }
                      });
                      dialogRef.afterClosed().subscribe(result => {
                    })
                  }
                else
                  {
                    if (data.complejidad)
                      {
                        if (data.complejidad.substr(0,2) > 0 && this.clave3.length < data.complejidad.substr(0,2))
                        {
                          this.hayError3=true;
                          this.MensajeError2 ="El largo de la contraseña debe ser mayor a " + Number(data.complejidad.substr(0,2)) + " caracter(es)"
                          this.miEemento2.nativeElement.focus(); 
                        }

                        else 
                        {
                          var especiales = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
                          var mayusculas = /[ABCDEFGHIJKLMNOPQRSTUVWXYZ]/;
                          var minusculas =     /[abcdefghijklmnopqrstuvwxyz]/;
                          var numeros =     /[1234567890]/;
                          if (!especiales.test(this.clave3) && data.complejidad.substr(2,1)=="S")
                            {
                              this.hayError3=true;
                              this.MensajeError2 ="la contraseña debe incluir caracteres especiales"
                              this.miEemento2.nativeElement.focus(); 
                            }
                          else if (!mayusculas.test(this.clave3) && data.complejidad.substr(3,1)=="S")
                          {
                            this.hayError3=true;
                            this.MensajeError2 ="la contraseña debe incluir mayúsculas"
                            this.miEemento2.nativeElement.focus(); 
                          }
                          else if (!minusculas.test(this.clave3) && data.complejidad.substr(3,1)=="S")
                          {
                            this.hayError3=true;
                            this.MensajeError2 ="la contraseña debe incluir minúsculas"
                            this.miEemento2.nativeElement.focus(); 
                          }

                          else if (!numeros.test(this.clave3) && data.complejidad.substr(4,1)=="S")
                          {
                            this.hayError3=true;
                            this.MensajeError2 ="la contraseña debe incluir números"
                            this.miEemento2.nativeElement.focus(); 
                          }
                          else if (data.usadas > 0 && data.usadas < 6)
                          {
                            let consulta1 = "SELECT * from usuarios where id = " + this.comunicacion.rUsuario().id;
                            let camposcab={accion: 50100, consulta: consulta1};  
                            this.gestionBD.consultasBD(camposcab).subscribe((datauser) =>{
                              if (!datauser)
                              {
                                const dialogRef = this.dialog.open(DialogoComponent, {
                                  width: '470px', height: '230px', data: { botones: 1, cabecera: 'INICIO DE SESIÓN FALLIDA', contenido: 'El usuario no existe o no está activo. Comuníquese con el administrador del sistema', boton1: 'Aceptar', boton2: '', tipoMensaje: 'ALARMA' }
                                });
                                dialogRef.afterClosed().subscribe(result => {
                                })
                              }
                              else 
                              {
                                if (datauser.contrasena1 && datauser.contrasena1 == this.clave3 )
                                {
                                  this.hayError3=true;
                                  this.MensajeError2 ="La contraseña ha sido usada en las últimas " + data.usadas + " veces"
                                  this.miEemento2.nativeElement.focus(); 
                                }
                                if (datauser.contrasena2 && datauser.contrasena2 == this.clave3 && data.usadas > "1")
                                {
                                  this.hayError3=true;
                                  this.MensajeError2 ="La contraseña ha sido usada en las últimas " + data.usadas + " veces"
                                  this.miEemento2.nativeElement.focus(); 
                                }
                                if (datauser.contrasena3 && datauser.contrasena3 == this.clave3 && data.usadas > "2")
                                {
                                  this.hayError3=true;
                                  this.MensajeError2 ="La contraseña ha sido usada en las últimas " + data.usadas + " veces"
                                  this.miEemento2.nativeElement.focus(); 
                                }
                                if (datauser.contrasena4 && datauser.contrasena4 == this.clave3 && data.usadas > "3")
                                {
                                  this.hayError3=true;
                                  this.MensajeError2 ="La contraseña ha sido usada en las últimas " + data.usadas + " veces"
                                  this.miEemento2.nativeElement.focus(); 
                                }
                                if (datauser.contrasena5 && datauser.contrasena5 == this.clave3 && data.usadas > "4")
                                {
                                  this.hayError3=true;
                                  this.MensajeError2 ="La contraseña ha sido usada en las últimas " + data.usadas + " veces"
                                  this.miEemento2.nativeElement.focus(); 
                                }
                                else
                                {
                                  this.grabarClave();
                              }
                            }
                          })
                        }
                      else
                          {
                            this.grabarClave();
                          }
                        }

                      }
                    
                  }
              });
            }
          }
        });
      }
      }
    })
  }

grabarClave()
{
  let fecha = this.comunicacion.convertirFecha(1,"","yyyy/MM/dd");
    let consulta1 = "update usuarios set inicializada = 'N', caducado = 'N', ultimocambio = '" + fecha + "', contrasena5 = contrasena4, contrasena4 = contrasena3, contrasena3 = contrasena2, contrasena2 = contrasena1, contrasena1 = contrasena, contrasena = '" + this.clave3 + "' WHERE id = " + this.comunicacion.rUsuario().id;
    let camposcab={accion: 50030, consulta: consulta1};  
    this.gestionBD.escribirBD(camposcab).subscribe((data: any) =>{
      this.datos.accion =1;
      this.dialogRef.close(this.datos);   
    })
}

validarClave()
{
    let consulta1 = "SELECT * from usuarios where id = " + this.comunicacion.rUsuario().id + " AND estatus = 'A'";
      let camposcab2={accion: 50100, consulta: consulta1};  
      this.gestionBD.consultasBD(camposcab2).subscribe((data) =>{
        if (!data)
        {
            const dialogRef = this.dialog.open(DialogoComponent, {
              width: '470px', height: '230px', data: { botones: 1, cabecera: 'INICIO DE SESIÓN FALLIDA', contenido: 'El usuario no existe o no está activo. Comuníquese con el administrador del sistema', boton1: 'Aceptar', boton2: '', tipoMensaje: 'ALARMA' }
            });
            dialogRef.afterClosed().subscribe(result => {
          })
          }
          else
          {
            if (this.clave != data.contrasena)
            {
              this.hayError1 = true;
              this.MensajeError="La contraseña actual no coincide"
              this.miEemento.nativeElement.focus();
            }
            else {

            }   
          }
    });
}

cancelar()
{
  this.datos.accion=0;
  this.dialogRef.close(this.datos);   
}

ngOnInit() {
}

verClave() {
  this.vermiClave = !this.vermiClave
}

verClave2() {
  this.vermiClave2 = !this.vermiClave2
}

verClave3() {
  this.vermiClave3 = !this.vermiClave3
}
}

