import { Component, OnInit, Inject } from '@angular/core';
import { ComunicacionService } from '../services/comunicacion.service';
import { GestionApisService } from '../services/gestion-apis.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogoComponent } from '../dialogo/dialogo.component';

@Component({
  selector: 'app-dialogo-tablas',
  templateUrl: './dialogo-tablas.component.html',
  styleUrls: ['./dialogo-tablas.component.css']
})


export class DialogoTablasComponent implements OnInit {

  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<DialogoTablasComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private comunicacion: ComunicacionService, private gestionBD: GestionApisService ) {
    let camposcab={accion: 50000, consulta: this.comunicacion.recuperConsultaActual()};  
      this.gestionBD.consultasBD(camposcab).subscribe((datacab: any[])=>{
        this.miConsulta = datacab;
        if (datacab)
        //Se recupera el detalle por célula
        {let campos={accion: 50000 + this.tablaFiltro, tabla: 0, consulta: 0};  
            this.tabla = this.tablaFiltro;
            if (this.tablaFiltro==10) {
              this.titFiltro = "FILTRAR CELULAS";
              campos.accion = 50010;
              campos.tabla = this.tabla;
              this.todosRegs = "Todas las células";
              campos.consulta = this.comunicacion.recuperConsultaActual();
              if (this.miConsulta.filtrocel=="0") {
                this.tRegistros = "1";
              }
              else {
                this.tRegistros = "2";
              }
            }
            else if (this.tablaFiltro==20) {
              this.titFiltro = "FILTRAR MAQUINAS";
              this.todosRegs = "Todas las máquinas";
              campos.tabla = this.tabla;
              campos.consulta = this.comunicacion.recuperConsultaActual();
              if (this.miConsulta.filtromaq=="0") {
                this.tRegistros = "1";
              }
              else {
                this.tRegistros = "2";
              }
            }
            else if (this.tablaFiltro==30) {
              this.titFiltro = "FILTRAR ÁREAS";
              this.todosRegs = "Todas las áreas";
              campos.tabla = this.tabla;
              campos.consulta = this.comunicacion.recuperConsultaActual();
              if (this.miConsulta.filtroare=="0") {
                this.tRegistros = "1";
              }
              else {
                this.tRegistros = "2";
              }
            }
            else if (this.tablaFiltro==40) {
              this.titFiltro = "FILTRAR FALLAS";
              this.todosRegs = "Todas las fallas";
              campos.tabla = this.tabla;
              campos.consulta = this.comunicacion.recuperConsultaActual();
              if (this.miConsulta.filtrofal=="0") {
                this.tRegistros = "1";
              }
              else {
                this.tRegistros = "2";
              }
            }
            else if (this.tablaFiltro==50) {
              this.titFiltro = "FILTRAR TIPOS DE MÁQUINA";
              this.todosRegs = "Todas los tipos/máq";
              campos.tabla = this.tabla;
              campos.consulta = this.comunicacion.recuperConsultaActual();
              if (this.miConsulta.filtromti=="0") {
                this.tRegistros = "1";
              }
              else {
                this.tRegistros = "2";
              }
            }
            else if (this.tablaFiltro==60) {
              this.titFiltro = "FILTRAR MAQUINAS (AGRUPADOR 1)";
              this.todosRegs = "Todas los grupos/maq";
              campos.tabla = this.tabla;
              campos.consulta = this.comunicacion.recuperConsultaActual();
              if (this.miConsulta.filtroma1=="0") {
                this.tRegistros = "1";
              }
              else {
                this.tRegistros = "2";
              }
            }
            else if (this.tablaFiltro==70) {
              this.titFiltro = "FILTRAR MAQUINAS (AGRUPADOR 2)";
              this.todosRegs = "Todas los grupos/maq";
              campos.tabla = this.tabla;
              campos.consulta = this.comunicacion.recuperConsultaActual();
              if (this.miConsulta.filtroma2=="0") {
                this.tRegistros = "1";
              }
              else {
                this.tRegistros = "2";
              }
            }
            else if (this.tablaFiltro==80) {
              this.titFiltro = "FILTRAR FALLAS (AGRUPADOR 2)";
              this.todosRegs = "Todas los grupos/falla";
              campos.tabla = this.tabla;
              campos.consulta = this.comunicacion.recuperConsultaActual();
              if (this.miConsulta.filtrofa1=="0") {
                this.tRegistros = "1";
              }
              else {
                this.tRegistros = "2";
              }
            }
            else if (this.tablaFiltro==90) {
              this.titFiltro = "FILTRAR FALLAS (AGRUPADOR 2)";
              this.todosRegs = "Todas los grupos/falla";
              campos.tabla = this.tabla;
              campos.consulta = this.comunicacion.recuperConsultaActual();
              if (this.miConsulta.filtrofa2=="0") {
                this.tRegistros = "1";
              }
              else {
                this.tRegistros = "2";
              }
            }
            else if (this.tablaFiltro==95) {
              this.titFiltro = "FILTRAR TÉCNICOS";
              this.todosRegs = "Todas los técnicos";
              campos.tabla = this.tabla;
              campos.consulta = this.comunicacion.recuperConsultaActual();
              if (this.miConsulta.filtrotec=="0") {
                this.tRegistros = "1";
              }
              else {
                this.tRegistros = "2";
              }
            }
            this.todaTablaAntes = this.tRegistros ;
            this.gestionBD.consultasBD(campos).subscribe((data: any[])=>{
            this.datos = data;     
            //Se llena la tabla de selecciones
              let hallado: number = -1;
              hallado=this.datos.findIndex(c => c.sel !=0);
              if (hallado<0)
              {
                this.datos.forEach((arreglo, index) => {
                  this.datos[index].sel = "1";
                });
            }
        });
      }
      else
      {

        if (this.tablaFiltro==10) {
          this.titFiltro = "FILTRAR CELULAS";
          this.todosRegs = "Todas las células";
          this.tRegistros = "1";
        }
        else if (this.tablaFiltro==20) {
          this.titFiltro = "FILTRAR MAQUINAS";
          this.todosRegs = "Todas las máquinas";
          this.tRegistros = "1";
        }
        else if (this.tablaFiltro==30) {
          this.titFiltro = "FILTRAR ÁREAS";
          this.todosRegs = "Todas las áreas";
          this.tRegistros = "1";
        }
        else if (this.tablaFiltro==40) {
          this.titFiltro = "FILTRAR FALLAS";
          this.todosRegs = "Todas las fallas";
          this.tRegistros = "1";
        }
        else if (this.tablaFiltro==50) {
          this.titFiltro = "FILTRAR TIPOS DE MÁQUINA";
          this.todosRegs = "Todos los tipos/máq";
          this.tRegistros = "1";
        }
        else if (this.tablaFiltro==60) {
          this.titFiltro = "FILTRAR MAQUINAS (AGRUPADOR 1)";
          this.todosRegs = "Todos los grupos/maq";
          this.tRegistros = "1";
        }
        else if (this.tablaFiltro==70) {
          this.titFiltro = "FILTRAR MAQUINAS (AGRUPADOR 2)";
          this.todosRegs = "Todos los grupos/maq";
          this.tRegistros = "1";
        }
        else if (this.tablaFiltro==80) {
          this.titFiltro = "FILTRAR FALLAS (AGRUPADOR 2)";
          this.todosRegs = "Todos los grupos/falla";
          this.tRegistros = "1";
        }
        else if (this.tablaFiltro==90) {
          this.titFiltro = "FILTRAR FALLAS (AGRUPADOR 2)";
          this.todosRegs = "Todos los grupos/falla";
          this.tRegistros = "1";
        }
        else if (this.tablaFiltro==95) {
          this.titFiltro = "FILTRAR TÉCNICOS";
          this.todosRegs = "Todos los técnicos";
          this.tRegistros = "1";
        }

        let campos={accion: 50000 + this.tablaFiltro, tabla: this.tablaFiltro, consulta: 0};  
        this.todaTablaAntes = this.tRegistros ;
            this.gestionBD.consultasBD(campos).subscribe((data: any[])=>{
            this.datos = data;     
            //Se llena la tabla de selecciones
              let hallado: number = -1;
              hallado=this.datos.findIndex(c => c.sel !=0);
              if (hallado<0)
              {
                this.datos.forEach((arreglo, index) => {
                  this.datos[index].sel = "1";
                });
            }
        })
      }
    });
  }

  todosRegs: string = ""
  datos: any = [];
  tabla: number = 0;
  miConsulta: any = "";
  tRegistros: string = "1";
  titFiltro: string = "";
  tablaFiltro: number = this.comunicacion.recuperTablaFiltro();
  selecciones: any = [];
  todaTablaAntes: string = ""; 
  miSeleccion: string = "1";
  verBuscar: boolean = false;
  
  ngOnInit() {
  }

  seleccion(event: any) {
    if (event.value==1) {
      this.datos.forEach((arreglo, index) => {
        this.datos[index].sel = "1";
      });
    }
    else {
      this.datos.forEach((arreglo, index) => {
        this.datos[index].sel = "0";
      });
    }
  }

  buscar() {
    this.datos.forEach((arreglo, index) => {
      this.datos[index].sel = "1";
    });
  }

  validar() {
    
    let eConsulta = this.comunicacion.recuperConsultaActual();
    if (this.selecciones.length>0 && this.tRegistros=="2") {
    //Se eliminan los registros
      let consulta0 = "insert into consultas_cab (usuario) values(" + this.comunicacion.rUsuario().id + ");";
      let consulta1 = "delete from consultas_det where consulta = " + eConsulta + " and tabla = " + this.tabla + ";"
      let consulta2 = "insert into consultas_det values("
      let consulta3 = "";
      
      let yaHaySel : boolean = false;
        this.selecciones.forEach((seleccion, index) => {
          if (yaHaySel) {
            consulta2 = consulta2 + ",("
          } 
          yaHaySel = true
          consulta2 = consulta2 + eConsulta + ", " + this.tabla + ", " + seleccion + ")" 
        })
        this.tabla = this.tablaFiltro;
        if (this.tabla==10) {
          consulta3 = "update consultas_cab set filtrocel = " + this.selecciones.length + " where id = " + eConsulta
          if (eConsulta=0) {
            
          }
        }
        else if (this.tabla==20) {
          consulta3 = "update consultas_cab set filtromaq = " + this.selecciones.length + " where id = " + eConsulta
        }
        else if (this.tabla==30) {
          consulta3 = "update consultas_cab set filtroare = " + this.selecciones.length + " where id = " + eConsulta
        }
        else if (this.tabla==40) {
          consulta3 = "update consultas_cab set filtrofal = " + this.selecciones.length + " where id = " + eConsulta
        }
        else if (this.tabla==50) {
          consulta3 = "update consultas_cab set filtromti = " + this.selecciones.length + " where id = " + eConsulta
        }
        else if (this.tabla==60) {
          consulta3 = "update consultas_cab set filtroma1 = " + this.selecciones.length + " where id = " + eConsulta
        }
        else if (this.tabla==70) {
          consulta3 = "update consultas_cab set filtroma2 = " + this.selecciones.length + " where id = " + eConsulta
        }
        else if (this.tabla==80) {
          consulta3 = "update consultas_cab set filtrofa1 = " + this.selecciones.length + " where id = " + eConsulta
        }
        else if (this.tabla==90) {
          consulta3 = "update consultas_cab set filtrofa2 = " + this.selecciones.length + " where id = " + eConsulta
        }
        else if (this.tabla==95) {
          consulta3 = "update consultas_cab set filtrotec = " + this.selecciones.length + " where id = " + eConsulta
        }
        if (yaHaySel) {
          let agregar={accion: 50030, consulta: consulta1};  
          this.gestionBD.escribirBD(agregar).subscribe((data: any) =>{
            agregar={accion: 50030, consulta: consulta2};  
            this.gestionBD.escribirBD(agregar).subscribe(() =>{
              if (eConsulta == 0)
              {
                agregar={accion: 50030, consulta: consulta0};  
                this.gestionBD.escribirBD(agregar).subscribe(() =>{
                  agregar={accion: 50030, consulta: consulta3};  
                  this.gestionBD.escribirBD(agregar).subscribe(() =>{
                  let consulta2 = "SELECT max(id) AS ultima from consultas_cab where usuario = " + this.comunicacion.rUsuario().id ;
                  let camposcab={accion: 50100, consulta: consulta2};  
                    this.gestionBD.consultasBD(camposcab).subscribe((data: any) =>{
                      this.comunicacion.consultaActual(data.ultima);
                      this.dialogRef.close();
                    });             
                  });
                });  
              }
              else{
                agregar={accion: 50030, consulta: consulta3};  
                this.gestionBD.escribirBD(agregar).subscribe(() =>{
                  this.dialogRef.close();  
                });
              } 
            });
          });
      }
      else {
        this.comunicacion.iconoDialogo("propioFiltrar");
        const dialogRef = this.dialog.open(DialogoComponent, {
          width: '570px', height: '270px', data: { botones: 1, cabecera: 'FILTRO INCORRECTO', contenido: 'Debe seleccionar al menos un valor.', boton1: 'Intentar de nuevo', tipoMensaje: 'ALARMA' }
        });
    
      };
    }
    else
    {
      if (this.todaTablaAntes != this.tRegistros) {
        //Se guarda la consulta
        let estaConsulta: string = "";
        if (this.tRegistros=="1") {
          if (this.tabla == 10) {
            estaConsulta = "update consultas_cab set filtrocel = 0 where id = " + eConsulta
          }
          else if (this.tabla == 20) {
            estaConsulta = "update consultas_cab set filtromaq = 0 where id = " + eConsulta
          }
          else if (this.tabla == 20) {
            estaConsulta = "update consultas_cab set filtromaq = 0 where id = " + eConsulta
          }
          else if (this.tabla == 30) {
            estaConsulta = "update consultas_cab set filtroare = 0 where id = " + eConsulta
          }
          else if (this.tabla == 40) {
            estaConsulta = "update consultas_cab set filtrofal = 0 where id = " + eConsulta
          }
          else if (this.tabla == 50) {
            estaConsulta = "update consultas_cab set filtromti = 0 where id = " + eConsulta
          }
          else if (this.tabla == 60) {
            estaConsulta = "update consultas_cab set filtroma1 = 0 where id = " + eConsulta
          }
          else if (this.tabla == 70) {
            estaConsulta = "update consultas_cab set filtroma2 = 0 where id = " + eConsulta
          }
          else if (this.tabla == 80) {
            estaConsulta = "update consultas_cab set filtrofa1 = 0 where id = " + eConsulta
          }
          else if (this.tabla == 90) {
            estaConsulta = "update consultas_cab set filtrofa2 = 0 where id = " + eConsulta
          }
          else if (this.tabla == 95) {
            estaConsulta = "update consultas_cab set filtrotec = 0 where id = " + eConsulta
          }
        }
        
        else {
          if (this.tabla == 10) {
            estaConsulta = "update consultas_cab as cc set filtrocel = (SELECT COUNT(*) FROM consultas_det AS cd WHERE cd.consulta = cc.id and cd.tabla = 10 ) where cc.id = " + eConsulta
          }
          else if (this.tabla == 20) {
            estaConsulta = "update consultas_cab as cc set filtromaq = (SELECT COUNT(*) FROM consultas_det AS cd WHERE cd.consulta = cc.id and cd.tabla = 20 ) where cc.id = " + eConsulta
          }
          else if (this.tabla == 30) {
            estaConsulta = "update consultas_cab as cc set filtroare = (SELECT COUNT(*) FROM consultas_det AS cd WHERE cd.consulta = cc.id and cd.tabla = 30 ) where cc.id = " + eConsulta
          }
          else if (this.tabla == 40) {
            estaConsulta = "update consultas_cab as cc set filtrofal = (SELECT COUNT(*) FROM consultas_det AS cd WHERE cd.consulta = cc.id and cd.tabla = 40 ) where cc.id = " + eConsulta
          }
          else if (this.tabla == 50) {
            estaConsulta = "update consultas_cab as cc set filtromti = (SELECT COUNT(*) FROM consultas_det AS cd WHERE cd.consulta = cc.id and cd.tabla = 50 ) where cc.id = " + eConsulta
          }
          else if (this.tabla == 60) {
            estaConsulta = "update consultas_cab as cc set filtroma2 = (SELECT COUNT(*) FROM consultas_det AS cd WHERE cd.consulta = cc.id and cd.tabla = 60 ) where cc.id = " + eConsulta
          }
          else if (this.tabla == 70) {
            estaConsulta = "update consultas_cab as cc set filtroma2 = (SELECT COUNT(*) FROM consultas_det AS cd WHERE cd.consulta = cc.id and cd.tabla = 70 ) where cc.id = " + eConsulta
          }
          else if (this.tabla == 80) {
            estaConsulta = "update consultas_cab as cc set filtrofa1 = (SELECT COUNT(*) FROM consultas_det AS cd WHERE cd.consulta = cc.id and cd.tabla = 80 ) where cc.id = " + eConsulta
          }
          else if (this.tabla == 90) {
            estaConsulta = "update consultas_cab as cc set filtrofa2 = (SELECT COUNT(*) FROM consultas_det AS cd WHERE cd.consulta = cc.id and cd.tabla = 90 ) where cc.id = " + eConsulta
          }
          else if (this.tabla == 95) {
            estaConsulta = "update consultas_cab as cc set filtrotec = (SELECT COUNT(*) FROM consultas_det AS cd WHERE cd.consulta = cc.id and cd.tabla = 100 ) where cc.id = " + eConsulta
          }
        } 
      let camposcab={accion: 50030, consulta: estaConsulta};  
        this.gestionBD.escribirBD(camposcab).subscribe((data: any) =>{
        });             
      this.dialogRef.close();
    }
    else {
      this.dialogRef.close();
    }
  }
}
  
  cancelar() {
    this.dialogRef.close();
  }

}
