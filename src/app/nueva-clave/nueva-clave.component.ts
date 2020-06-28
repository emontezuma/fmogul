import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, } from '@angular/material';
import { ComunicacionService } from '../services/comunicacion.service';
import { FormControl, Validators } from '@angular/forms';
import { GestionApisService } from '../services/gestion-apis.service';
import { MatDialog } from '@angular/material';
import { DialogoComponent } from '../dialogo/dialogo.component';

@Component({
  selector: 'app-nueva-clave',
  templateUrl: './nueva-clave.component.html',
  styleUrls: ['./nueva-clave.component.css']
})
export class NuevaClaveComponent implements OnInit {

  @ViewChild("txtClave2") miEemento2: ElementRef;

  clave21 = new FormControl('', [Validators.required]);
  clave31 = new FormControl('', [Validators.required]);
  clave2: string = "";
  clave3: string = "";
  MensajeError: string ="Campo obligatorio"
  MensajeError2: string ="Campo obligatorio"

  hayError1: boolean = false;
  hayError2: boolean = false;
  hayError3: boolean = false;

  vermiClave2: boolean = false;
  vermiClave3: boolean = false;

  constructor(public dialogRef: MatDialogRef<NuevaClaveComponent>, @Inject(MAT_DIALOG_DATA) public datos: any, public dialog: MatDialog, private comunicacion: ComunicacionService, private gestionBD: GestionApisService) {
  }

validar()
{
  this.hayError1=false;
  this.hayError2=false;
  this.hayError3=false;
  this.MensajeError ="Campo obligatorio"
  this.MensajeError2 ="Campo obligatorio"
  if (!this.clave2 && !this.clave3)
  {
    let consulta1 = "SELECT obligatoria from politicas where id = " + this.comunicacion.rUsuario().politica + " and obligatoria = 'N' and estatus = 'A'"
    let camposcab={accion: 50100, consulta: consulta1};  
    this.gestionBD.consultasBD(camposcab).subscribe((data) =>{
    if (data)
    {
      //Se graba la contraseña
      let fecha = this.comunicacion.convertirFecha(1,"","yyyy/MM/dd");
      let consulta1 = "update usuarios set inicializada = 'N', ultimocambio = '" + fecha + "', contrasena5 = contrasena4, contrasena4 = contrasena3, contrasena3 = contrasena2, contrasena2 = contrasena1, contrasena1 = contrasena, contrasena = '" + this.clave3 + "' WHERE id = " + this.comunicacion.rUsuario().id;
      let camposcab={accion: 50030, consulta: consulta1};  
      this.gestionBD.escribirBD(camposcab).subscribe((data: any) =>{
        this.datos.accion =1;
        this.dialogRef.close(this.datos);   
      })
    }
    else
    {
      this.continuarClave()
    }  
    })
  }
  else
  {
    this.continuarClave()    
  }
}

continuarClave()
{
  if (this.clave2 =="" || !this.clave2)
      {this.hayError2 =true;}
  if (this.clave3 =="" || !this.clave3)
    {this.hayError3 =true;}
  if (!this.hayError2 && !this.hayError3)
    {
    if (this.clave2 != this.clave3 )
    {
      this.hayError3=true;
      this.MensajeError2 ="Confirmación incorrecta!"
      this.miEemento2.nativeElement.focus();
    }
    else {
    let consulta1 = "SELECT * from politicas where id = " + this.comunicacion.rUsuario().politica + " and estatus = 'A'"
      let camposcab={accion: 50100, consulta: consulta1};  
      this.gestionBD.consultasBD(camposcab).subscribe((data) =>{
        if (!data)
          {
              const dialogRef = this.dialog.open(DialogoComponent, {
                width: '470px', height: '250px', data: { botones: 1, cabecera: 'INICIO DE SESIÓN FALLIDA', contenido: 'La política del usuario no existe o no está activa. Comuníquese con el administrador del sistema', boton1: 'Aceptar', boton2: '', tipoMensaje: 'ALARMA' }
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
                          let fecha = this.comunicacion.convertirFecha(1,"","yyyy/MM/dd");
                          let consulta1 = "update usuarios set inicializada = 'N', ultimocambio = '" + fecha + "', contrasena5 = contrasena4, contrasena4 = contrasena3, contrasena3 = contrasena2, contrasena2 = contrasena1, contrasena1 = contrasena, contrasena = '" + this.clave3 + "' WHERE id = " + this.comunicacion.rUsuario().id;
                          let camposcab={accion: 50030, consulta: consulta1};  
                          this.gestionBD.escribirBD(camposcab).subscribe((data: any) =>{
                            this.datos.accion =1;
                            this.dialogRef.close(this.datos);   
                          })
                      }
                    }
                  })
                }
              else
                  {
                    let fecha = this.comunicacion.convertirFecha(1,"","yyyy/MM/dd");
                    let consulta1 = "update usuarios set inicializada = 'N', ultimocambio = '" + fecha + "', contrasena5 = contrasena4, contrasena4 = contrasena3, contrasena3 = contrasena2, contrasena2 = contrasena1, contrasena1 = contrasena, contrasena = '" + this.clave3 + "' WHERE id = " + this.comunicacion.rUsuario().id;
                    let camposcab={accion: 50030, consulta: consulta1};  
                    this.gestionBD.escribirBD(camposcab).subscribe((data: any) =>{
                      this.datos.accion =1;
                      this.dialogRef.close(this.datos);   
                    })
                  }
                }
          }
        }
      });
    }
  }
}

cancelar()
{
  this.datos.accion=0;
  this.comunicacion.aUsuario({id: 0, nombre: "", rol: 0, politica: 0, admin: "", tecnico: ""})
  this.dialogRef.close(this.datos);   
}

ngOnInit() {
}

verClave2() {
  this.vermiClave2 = !this.vermiClave2
}

verClave3() {
  this.vermiClave3 = !this.vermiClave3
}
}

