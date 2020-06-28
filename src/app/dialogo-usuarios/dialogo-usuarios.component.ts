import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, } from '@angular/material';
import { ComunicacionService } from '../services/comunicacion.service';
import { FormControl, Validators } from '@angular/forms';
import { GestionApisService } from '../services/gestion-apis.service';
import { MatDialog } from '@angular/material';
import { DialogoComponent } from '../dialogo/dialogo.component';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';


@Component({
  selector: 'app-dialogo-usuarios',
  templateUrl: './dialogo-usuarios.component.html',
  styleUrls: ['./dialogo-usuarios.component.css']
})
export class DialogoUsuariosComponent implements OnInit {

  perfil1 = new FormControl('', [Validators.required]);
  nombre1 = new FormControl('', [Validators.required]);
  color1 = new FormControl('', [Validators.required]);
  prefijo1 = new FormControl('', [Validators.required]);
  correo1 = new FormControl('', [Validators.required]);
  imagen1 = new FormControl('', [Validators.required]);
  estatusantes: string = "I";
  estatus: boolean = true;  
  tecnico: boolean = true;  
  idParo: string = "";
  prefijo: string = "";
  nombre: string = "";
  referencia: string = "";
  secuencia: string = "";
  colorhexa: string = "";
  imagen: string = "./assets/icons/usuario.svg";
  modificador: string = "";
  creador: string = "";
  fcreacion: string = "";
  fmodificacion: string = "";
  fuingreso: string = "";
  fucambio: string = "";
  estaRol: string = "";
  correo: string = "";
  estaPol: string = "";
  estaCia: string = "";
  estaPlanta: string = "";
  estaDpto: string = "";
  estaPuesto: string = "";

  hayError1: boolean = false;
  hayError2: boolean = false;
  hayError3: boolean = false;
  hayError4: boolean = false;
  hayError5: boolean = false;
  hayError6: boolean = false;
  
  estaCelula: string = "";
  esteParo: string = "0";
  estaArea: string = "";
  esteParo2: string = "0";
  tablas1: any = [];
  tablas2: any = [];
  tablas3: any = [];
  tablas4: any = [];
  tablas5: any = [];
  tablas6: any = [];
  
  constructor(public snackBar: MatSnackBar, public dialogRef: MatDialogRef<DialogoUsuariosComponent>, @Inject(MAT_DIALOG_DATA) public datos: any, public dialog: MatDialog, private comunicacion: ComunicacionService, private gestionBD: GestionApisService) {
      let consulta2 = "SELECT id, nombre FROM permisos WHERE estatus = 'A'";
      let camposcab={accion: 50300, consulta: consulta2};  
      this.gestionBD.consultasBD(camposcab).subscribe((data: any []) =>{
        this.tablas1 = data;
      });
      consulta2 = "SELECT id, nombre FROM politicas WHERE estatus = 'A'";
      camposcab={accion: 50300, consulta: consulta2};  
      this.gestionBD.consultasBD(camposcab).subscribe((data: any []) =>{
        this.tablas2 = data;
      });
      consulta2 = "SELECT id, prefijo FROM generales WHERE tabla = 400 and estatus = 'A'";
      camposcab={accion: 50300, consulta: consulta2};  
      this.gestionBD.consultasBD(camposcab).subscribe((data: any []) =>{
        this.tablas3 = data;
      });
      consulta2 = "SELECT id, prefijo FROM generales WHERE tabla = 700 and estatus = 'A'";
      camposcab={accion: 50300, consulta: consulta2};  
      this.gestionBD.consultasBD(camposcab).subscribe((data: any []) =>{
        this.tablas4 = data;
      });
      consulta2 = "SELECT id, prefijo FROM generales WHERE tabla = 300 and estatus = 'A'";
      camposcab={accion: 50300, consulta: consulta2};  
      this.gestionBD.consultasBD(camposcab).subscribe((data: any []) =>{
        this.tablas5 = data;
      });
      consulta2 = "SELECT id, prefijo FROM generales WHERE tabla = 600 and estatus = 'A'";
      camposcab={accion: 50300, consulta: consulta2};  
      this.gestionBD.consultasBD(camposcab).subscribe((data: any []) =>{
        this.tablas6 = data;
      });
      this.idParo = '' + datos.id;
      if (datos.id > 0)
      {
        let consulta1 = "SELECT usuarios.*, a.nombre as tcreador, b.nombre as tmodificador FROM usuarios LEFT JOIN usuarios AS a ON usuarios.creado = a.id LEFT JOIN usuarios AS b ON usuarios.modificado = b.id WHERE usuarios.id = " + this.idParo;
        let camposcab={accion: 50100, consulta: consulta1};  
        this.gestionBD.consultasBD(camposcab).subscribe((data) =>{
          this.nombre = data.nombre;
          this.prefijo = data.prefijo;
          this.estatus = (data.estatus =="A" ? true : false);
          this.tecnico = (data.tecnico =="S" ? true : false);
          this.estatusantes = data.estatus;
          this.referencia = data.referencia;
          this.colorhexa = data.colorhexa;
          this.imagen = data.imagen;
          this.correo = data.email;
          if (!this.correo) {this.correo=""};
          if (!this.referencia) {this.referencia=""};
          if (!this.prefijo) {this.prefijo=""};
          if (!this.nombre) {this.nombre=""};
          this.modificador = data.tmodificador;
          this.creador = data.tcreador;
          this.fcreacion = this.comunicacion.convertirFecha(2,data.creacion,"dd-MM-yyyy hh:mm a");
          this.fmodificacion = this.comunicacion.convertirFecha(2,data.modificacion,"dd-MM-yyyy hh:mm a");
          this.fucambio = this.comunicacion.convertirFecha(2,data.ultimocambio,"dd-MM-yyyy");
          this.fuingreso = this.comunicacion.convertirFecha(2,data.ultmasalida,"dd-MM-yyyy hh:mm:ss a");
          this.estaRol = data.rol;
          this.estaPol = data.politica;
          this.estaDpto = data.departamento;
          this.estaPuesto = data.puesto;
          this.estaCia = data.compania;
          this.estaPlanta = data.planta;
      });
    }
  }

  cancelar(){
    this.datos.accion = 0;
    this.dialogRef.close(this.datos);
  }
  
  eliminar() {
    const dialogRef = this.dialog.open(DialogoComponent, {
      width: '570px', height: '270px', data: { botones: 2, cabecera: 'INACTIVAR USUARIO', contenido: 'Esta acción inactivará esta usuario y no podrá iniciar sesión en el sistema. ¿Está seguro de esta acción?', boton1: 'Si, lo inactivaré', boton2: 'No, lo pensaré mejor', tipoMensaje: 'NORMAL' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result)
      {
      }
      else if (result == 1)
      {
        let consulta1 = "update usuarios set estatus = 'I' WHERE id = " + this.idParo;
        let camposcab={accion: 50030, consulta: consulta1};  
        this.gestionBD.escribirBD(camposcab).subscribe((data: any) =>{
          this.estatus = false;
          this.datos.accion = -1;
          this.dialogRef.close(this.datos);
        });
      }
    
  })
  }

  inicializar() {
    const dialogRef = this.dialog.open(DialogoComponent, {
      width: '570px', height: '270px', data: { botones: 2, cabecera: 'INICIALIZAR CONTRASEÑA DE USUARIO', contenido: 'Esta acción inicializará la contraseña de ete usuario y le pedirá el cambio en su nuevo inicio de sesión. ¿Está seguro de esta acción?', boton1: 'Si, la inicializaré', boton2: 'No, lo pensaré mejor', tipoMensaje: 'NORMAL' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result)
      {
      }
      else if (result == 1)
      {
        let consulta1 = "update usuarios set inicializada = 'S' WHERE id = " + this.idParo;
        let camposcab={accion: 50030, consulta: consulta1};  
        this.gestionBD.escribirBD(camposcab).subscribe((data: any) =>{
          this.estatus = false;
          this.datos.accion = -1;
          this.dialogRef.close(this.datos);
          this.toast('custom-class', 'La contraseña del usuario ha sido inicializada', 3000 );
        });
      }
    
  })
  }
  
  copiar() {
    this.idParo="0";
    this.secuencia="0";
    this.modificador="";
    this.creador="";
    this.fcreacion="";
    this.fmodificacion="";
  }
  
  validar(){
    this.hayError1=false;
    this.hayError2=false;
    this.hayError3=false;
    this.hayError4=false;
    this.hayError5=false;
    this.hayError6=false;

    if (!this.colorhexa) {this.colorhexa="white"};
    if (!this.estaPlanta) {this.estaPlanta="0"};
    if (!this.estaCia) {this.estaCia="0"};
    if (!this.estaPuesto) {this.estaPuesto="0"};
    if (!this.estaDpto) {this.estaDpto="0"};
    if (!this.referencia)  
    {this.hayError1 =true}
    if (!this.nombre)  
    {this.hayError2 =true}
    if (!this.correo)  
    {this.hayError3 =true}
    if (!this.estaRol)  
    {this.hayError4 =true}
    if (!this.estaPol)  
    {this.hayError5 =true}
    if (!this.prefijo)  
    {this.hayError6 =true}
    if (!this.hayError1 && !this.hayError2 && !this.hayError3 && !this.hayError4 && !this.hayError5 && !this.hayError6)
    {
      let consulta1 = "SELECT nombre, id from usuarios where referencia = '" + this.referencia + "' and id <> " + this.idParo;
        let camposcab={accion: 50100, consulta: consulta1};  
        this.gestionBD.consultasBD(camposcab).subscribe((data) =>{
          if (!data)
          {
            this.agregarUsuario();
          }
          else
          {
            const dialogRef = this.dialog.open(DialogoComponent, {
              width: '570px', height: '270px', data: { botones: 1, cabecera: 'NO SE GUARDO EL REGISTRO', contenido: "No se guardó el registro porque ya existe un usuario con ese mismo perfil. El nombre del usuario es: '" + data.nombre + "' y su ID es: " + data.id, boton1: 'Aceptar', tipoMensaje: 'ALARMA' }
            });
            dialogRef.afterClosed().subscribe(result => {
          })
        }
      });
    }
  }

  agregarUsuario()
  {
    let consulta1 = "";
    let usuario = this.comunicacion.rUsuario().id;
    let fecha = this.comunicacion.convertirFecha(1,"","yyyy/MM/dd HH:mm:ss");
    if (this.idParo=="0") {
      consulta1 = "insert into usuarios (referencia, nombre, rol, departamento, puesto, planta, compania, imagen, colorhexa, prefijo, politica, email, inicializada, estatus, tecnico, creacion, modificacion, creado, modificado) VALUES ('" + this.referencia + "', '" +  this.nombre + "', " + this.estaRol + ", " +  this.estaDpto + ", " +  this.estaPuesto + ", " +  this.estaPlanta + ", " +  this.estaCia + ", '" + this.imagen + "', '" + this.colorhexa + "', '" + this.prefijo + "', " +  this.estaPol + ", '" + this.correo + "', 'S', 'A', '" + (this.tecnico ? "S" : "N") + "', '" + fecha + "', '" + fecha + "', " + usuario + ", " + usuario + ");"
    }
    else {
      consulta1 = "update usuarios set email = '" + this.correo + "', imagen = '" + this.imagen + "', colorhexa = '" + this.colorhexa + "', planta = " + this.estaPlanta + ", compania = " + this.estaCia + ", departamento = " + this.estaDpto + ", politica = " + this.estaPol + ", rol = " + this.estaRol + ", puesto = " + this.estaPuesto + ", estatus = '" + (this.estatus ? "A" : "I") + "', tecnico = '" + (this.tecnico ? "S" : "N") + "', referencia = '" + this.referencia + "', nombre = '" + this.nombre + "', prefijo = '" + this.prefijo + "', modificado = " + usuario + ", modificacion = '" + fecha + "' WHERE id = " + this.idParo;
    }
    let camposcab={accion: 50030, consulta: consulta1};  
    this.gestionBD.escribirBD(camposcab).subscribe((data2: any) =>{
      this.datos.accion = 1;
      this.dialogRef.close(this.datos);
    });
  
  }
  
  ngOnInit() {
  }
  
  prefijos() {
    this.prefijo = this.nombre.substring(0, 30);
  }

  toast(clase: string, mensaje: string, duracion: number) {
    let config = new MatSnackBarConfig();
      config.panelClass = [clase];
      config.duration = duracion;
      config.verticalPosition='bottom';
      this.snackBar.open(mensaje, null, config);
  }

  }
  