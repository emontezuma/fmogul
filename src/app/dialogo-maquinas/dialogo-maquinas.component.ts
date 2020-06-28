import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { ComunicacionService } from '../services/comunicacion.service';
import { GestionApisService } from '../services/gestion-apis.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { DialogoComponent } from '../dialogo/dialogo.component';

@Component({
  selector: 'app-dialogo-maquinas',
  templateUrl: './dialogo-maquinas.component.html',
  styleUrls: ['./dialogo-maquinas.component.css']
})
export class DialogoMaquinasComponent implements OnInit {

  nparoSel = new FormControl('', [Validators.required]);
  tiempoParo1 =   new FormControl('', [Validators.required, Validators.min(0), Validators.max(999999)]);
  columnas: string[] = [];
  
  
  
  prefijo1 = new FormControl('', [Validators.required]);
  nombre1 = new FormControl('', [Validators.required]);
  referencia1 = new FormControl('', [Validators.required]);
  color1 = new FormControl('', [Validators.required]);
  imagen1 = new FormControl('', [Validators.required]);
  secuencia1 =   new FormControl('', [Validators.required, Validators.min(0), Validators.max(999999)]);
  lunes1 = new FormControl('', [Validators.required, Validators.min(0), Validators.max(999999)]);
  martes1 = new FormControl('', [Validators.required, Validators.min(0), Validators.max(999999)]);
  miercoles1 = new FormControl('', [Validators.required, Validators.min(0), Validators.max(999999)]);
  jueves1 = new FormControl('', [Validators.required, Validators.min(0), Validators.max(999999)]);
  viernes1 = new FormControl('', [Validators.required, Validators.min(0), Validators.max(999999)]);
  sabado1 = new FormControl('', [Validators.required, Validators.min(0), Validators.max(999999)]);
  domingo1 = new FormControl('', [Validators.required, Validators.min(0), Validators.max(999999)]);
  

  lunes: string = "";
   martes: string = "";
   miercoles: string = "";
   jueves: string = "";
   viernes: string = "";
   sabado: string = "";
   domingo: string = "";
   
  secuenciaantes: string = "0";
  estatusantes: string = "I";
  estatus: boolean = true;  
  personal: boolean = false;  
  idParo: string = "";
  prefijo: string = "";
  nombre: string = "";
  referencia: string = "";
  secuencia: string = "";
  colorhexa: string = "";
  imagen: string = "./assets/icons/maquinas.svg";
  modificador: string = "";
  creador: string = "";
  fcreacion: string = "";
  fmodificacion: string = "";

  hayError1: boolean = false;
  hayError2: boolean = false;
  hayError3: boolean = false;
  hayError4: boolean = false;

  
  estaCelula: string = "";
  esteParo: string = "0";
  estaArea: string = "0";
  esteParo2: string = "0";
  maquinas: any = [];
  nParos: any = [];
  areas: any = [];
  nParos2: any = [];
  
  constructor(public dialogRef: MatDialogRef<DialogoMaquinasComponent>, @Inject(MAT_DIALOG_DATA) public datos: any, public dialog: MatDialog, private comunicacion: ComunicacionService, private gestionBD: GestionApisService) {
      let consulta2 = "SELECT id, prefijo FROM celulas WHERE estatus = 'A' order by prefijo";
      let camposcab={accion: 50300, consulta: consulta2};  
      this.gestionBD.consultasBD(camposcab).subscribe((data: any []) =>{
        this.maquinas = data;
      });
      consulta2 = "SELECT id, prefijo FROM generales WHERE tabla = 100 and estatus = 'A' order by prefijo";
      camposcab={accion: 50300, consulta: consulta2};  
      this.gestionBD.consultasBD(camposcab).subscribe((data: any []) =>{
        this.areas = data;
      });
      consulta2 = "SELECT id, prefijo FROM generales WHERE tabla = 1000 and estatus = 'A' order by prefijo";
      camposcab={accion: 50300, consulta: consulta2};  
      this.gestionBD.consultasBD(camposcab).subscribe((data: any []) =>{
        this.nParos = data;
      });
      consulta2 = "SELECT id, prefijo FROM generales WHERE tabla = 2000 and estatus = 'A' order by prefijo";
      camposcab={accion: 50300, consulta: consulta2};  
      this.gestionBD.consultasBD(camposcab).subscribe((data: any []) =>{
        this.nParos2 = data;
      });
      this.idParo = '' + datos.id;
      if (datos.id > 0)
      {
        let consulta1 = "SELECT * from maquinas left join disponibilidad on maquinas.id = disponibilidad.maquina where maquinas.id = " + this.idParo;
        let camposcab={accion: 50100, consulta: consulta1};  
        this.gestionBD.consultasBD(camposcab).subscribe((data) =>{
          this.nombre = data.nombre;
          this.prefijo = data.prefijo;
          this.estatus = (data.estatus =="A" ? true : false);
          this.estatusantes = data.estatus;
          this.referencia = data.referencia;
          this.colorhexa = data.colorhexa;
          this.referencia = data.referencia;
          this.secuencia = data.secuencia;
          this.secuenciaantes=this.secuencia;
          this.imagen = data.imagen;
          this.modificador = data.tmodificador;
          this.creador = data.tcreador;
          this.fcreacion = this.comunicacion.convertirFecha(2,data.creacion,"dd-MM-yyyy hh:mm a");
          this.fmodificacion = this.comunicacion.convertirFecha(2,data.modificacion,"dd-MM-yyyy hh:mm a");
          this.esteParo = data.clasificacion1;
          this.esteParo2 = data.clasificacion2;
          this.estaCelula = data.celula;
          this.estaArea = data.tipo;
          if (!data.lunes) 
          {this.personal=false}
          else {
            this.personal=true;
          }
          this.lunes = data.lunes;
          this.martes = data.martes;
          this.miercoles = data.miercoles;
          this.jueves = data.jueves;
          this.viernes = data.viernes;
          this.sabado = data.sabado;
          this.domingo = data.domingo;
      });
    }
  }

  cancelar(){
    this.datos.accion = 0;
    this.dialogRef.close(this.datos);
  }
  
  eliminar() {
    const dialogRef = this.dialog.open(DialogoComponent, {
      width: '570px', height: '270px', data: { botones: 2, cabecera: 'INACTIVAR MÁQUINA', contenido: 'Esta acción inactivará esta máquina y no estará disponible en el sistema. ¿Está seguro de esta acción?', boton1: 'Si, la inactivaré', boton2: 'No, lo pensaré mejor', tipoMensaje: 'NORMAL' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result)
      {
      }
      else if (result == 1)
      {
        let consulta1 = "update maquinas set estatus = 'I' WHERE id = " + this.idParo;
        let camposcab={accion: 50030, consulta: consulta1};  
        this.gestionBD.escribirBD(camposcab).subscribe((data: any) =>{
          this.estatus = false;
          this.datos.accion = -1;
          this.dialogRef.close(this.datos);
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
    this.secuenciaantes ="0";
  }
  
  validar(){
    this.hayError1=false;
    this.hayError2=false;
    this.hayError3=false;
    if (this.nombre =="" || !this.nombre)
      {this.hayError1 =true}
    if (this.prefijo =="" || !this.prefijo)
      {this.hayError2 =true;}
      if (this.estaCelula =="" || !this.estaCelula)
      {this.hayError3 =true;}
    if (!this.hayError1 && !this.hayError2 && !this.hayError3)
    {
      if (!this.lunes) {this.lunes ="0"};
      if (!this.martes) {this.martes ="0"};
      if (!this.miercoles) {this.miercoles ="0"};
      if (!this.jueves) {this.jueves ="0"};
      if (!this.viernes) {this.viernes ="0"};
      if (!this.sabado) {this.sabado ="0"};
      if (!this.domingo) {this.domingo ="0"};
      if (!this.colorhexa) {this.colorhexa="white"};
      let consulta10 = "";
      let consulta0 = "";
      let consulta1 = "SELECT max(secuencia) as maxid from maquinas";
        let camposcab={accion: 50100, consulta: consulta1};  
        this.gestionBD.consultasBD(camposcab).subscribe((data) =>{
        let usuario = this.comunicacion.rUsuario().id;
  
        let fecha = this.comunicacion.convertirFecha(1,"","yyyy/MM/dd HH:mm:ss");
        let tiporeg: boolean = true;
        if (this.idParo=="0") {
          consulta1 = "insert into maquinas (secuencia, referencia, nombre, imagen, colorhexa, prefijo, estatus, creacion, modificacion, creado, modificado, celula, tipo, clasificacion1, clasificacion2) VALUES (" + (+data.maxid + 1) + ", '" + this.referencia + "', '" + this.nombre +  "', '" + this.imagen + "', '" + this.colorhexa + "', '" + this.prefijo + "', 'A', '" + fecha + "', '" + fecha + "', " + usuario + ", " + usuario + ", " + this.estaCelula + ", " + this.estaArea + ", " + this.esteParo + ", " + this.esteParo2 + ");"
        }
        else {
          consulta1 = "update maquinas set estatus = '" + (this.estatus ? "A" : "I") + "', nombre = '" + this.nombre + "', prefijo = '" + this.prefijo + "', referencia = '" + this.referencia + "', colorhexa = '" + this.colorhexa + "', imagen = '" + this.imagen + "', modificado = " + usuario + ", modificacion = '" + fecha + "', celula = " + this.estaCelula + ", tipo = " + this.estaArea + ", clasificacion1 = " + this.esteParo + ", clasificacion2 = "  + this.esteParo2 + " WHERE id = " + this.idParo;
          tiporeg = false;
        }
        camposcab={accion: 50030, consulta: consulta1};  
        this.gestionBD.escribirBD(camposcab).subscribe((data2: any) =>{
          //Se obtiene el número de la máquina
          let consulta1 = "SELECT max(id) as ultid from maquinas";
          let camposcab={accion: 50100, consulta: consulta1};  
          this.gestionBD.consultasBD(camposcab).subscribe((datault) =>{
            if (this.idParo=="0") {this.idParo=datault.ultid}
            if (this.personal)
            {
              consulta10 = "INSERT INTO disponibilidad (maquina, lunes, martes, miercoles, jueves, viernes, sabado, domingo) VALUES (" + this.idParo + ", " + this.lunes + ", " + this.martes + ", " + this.miercoles + ", " + this.jueves + ", " + this.viernes + ", " + this.sabado + ", " + this.domingo + ")"
            }
            else{
              consulta10 = "DELETE FROM disponibilidad WHERE maquina = " + this.idParo
            }
            if (!tiporeg && this.secuencia != this.secuenciaantes && this.secuencia!="0") 
            {
              if (+this.secuencia>+data.maxid) {
                consulta1 = "update maquinas set secuencia = " + data.maxid + " WHERE id = " + this.idParo;
                consulta0 = "update maquinas set secuencia = secuencia - 1  WHERE secuencia <= " + this.secuencia + " and secuencia > " + this.secuenciaantes + " AND id <> " + this.idParo;  
              }
              else
              {
                if (+this.secuencia > +this.secuenciaantes)
                {
                  consulta0 = "update maquinas set secuencia = secuencia - 1  WHERE secuencia <= " + this.secuencia + " and secuencia > " + this.secuenciaantes + " AND id <> " + this.idParo;  
                }
                else
                {
                  consulta0 = "update maquinas set secuencia = secuencia + 1  WHERE secuencia >= " + this.secuencia + " and secuencia < " + this.secuenciaantes  + " AND id <> " + this.idParo;
                }
                consulta1 = "update maquinas set secuencia = " + this.secuencia + " WHERE id = " + this.idParo;
              }
              camposcab={accion: 50030, consulta: consulta1};  
                this.gestionBD.escribirBD(camposcab).subscribe((data: any) =>{
                  if (consulta0.length>0)
                  {
                    camposcab={accion: 50030, consulta: consulta0};  
                    this.gestionBD.escribirBD(camposcab).subscribe((data: any) =>{
                      if (consulta10.length>0)
                      {
                        camposcab={accion: 50030, consulta: "DELETE FROM disponibilidad WHERE maquina = " + this.idParo};  
                        this.gestionBD.escribirBD(camposcab).subscribe((data: any) =>{
                          camposcab={accion: 50030, consulta: consulta10};  
                          this.gestionBD.escribirBD(camposcab).subscribe((data: any) =>{
                          this.datos.accion = 1;
                          this.dialogRef.close(this.datos);
                        }) 
                      })      
                    }
                    else {
                      this.datos.accion = 1;
                      this.dialogRef.close(this.datos);
                    }
                  })      
                  }
                  else {
                    if (consulta10.length>0)
                      {
                        camposcab={accion: 50030, consulta: "DELETE FROM disponibilidad WHERE maquina = " + this.idParo};  
                        this.gestionBD.escribirBD(camposcab).subscribe((data: any) =>{
                          camposcab={accion: 50030, consulta: consulta10};  
                          this.gestionBD.escribirBD(camposcab).subscribe((data: any) =>{
                          this.datos.accion = 1;
                          this.dialogRef.close(this.datos);
                        }) 
                      })      
                    }
                    else {
                      this.datos.accion = 1;
                      this.dialogRef.close(this.datos);
                    }      
                  }
                })
              
            }
            else
            {
              if (consulta10.length>0)
                  {
                    camposcab={accion: 50030, consulta: "DELETE FROM disponibilidad WHERE maquina = " + this.idParo};  
                    this.gestionBD.escribirBD(camposcab).subscribe((data: any) =>{
                      camposcab={accion: 50030, consulta: consulta10};  
                      this.gestionBD.escribirBD(camposcab).subscribe((data: any) =>{
                      this.datos.accion = 1;
                      this.dialogRef.close(this.datos);
                    }) 
                  })      
                }
                else {
                  this.datos.accion = 1;
                  this.dialogRef.close(this.datos);
                }  
            }
        });
      });
      })
    }
  }
  
  ngOnInit() {
  }
  
    prefijos() {
      this.prefijo = this.nombre.substring(0, 30);
    }
  
  }
  
  