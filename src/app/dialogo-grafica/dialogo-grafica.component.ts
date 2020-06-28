import { Component, OnInit, Inject } from '@angular/core';
import { ComunicacionService } from '../services/comunicacion.service';
import { GestionApisService } from '../services/gestion-apis.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-dialogo-grafica',
  templateUrl: './dialogo-grafica.component.html',
  styleUrls: ['./dialogo-grafica.component.css']
})
export class DialogoGraficaComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogoGraficaComponent>, @Inject(MAT_DIALOG_DATA) public datos: any, public dialog: MatDialog, private comunicacion: ComunicacionService, private gestionBD: GestionApisService) { 
    this.buscarGrafica();

  }

  fuentes: any = [
    {id: "8", nombre: "8px"},
    {id: "9", nombre: "9px"},
    {id: "10", nombre: "10px"},
    {id: "11", nombre: "11px"},
    {id: "12", nombre: "12px"},
    {id: "13", nombre: "13px"},
    {id: "14", nombre: "14px"},
    {id: "15", nombre: "15px"},
    {id: "16", nombre: "16px"},
    {id: "17", nombre: "17px"},
    {id: "18", nombre: "18px"},
    {id: "19", nombre: "19px"},
    {id: "20", nombre: "20px"},
    {id: "21", nombre: "21px"},
    {id: "22", nombre: "22px"},
    {id: "23", nombre: "23px"},
    {id: "24", nombre: "24px"},
    {id: "25", nombre: "25px"},
    {id: "26", nombre: "26px"},
    {id: "27", nombre: "27px"},
    {id: "28", nombre: "28px"},
    {id: "29", nombre: "29px"},
    {id: "30", nombre: "30px"},
  ];

  margenes: any = [
    {id: "0", nombre: "0px"},
    {id: "5", nombre: "5px"},
    {id: "10", nombre: "10px"},
    {id: "20", nombre: "20px"},
    {id: "20", nombre: "30px"},
    {id: "40", nombre: "40px"},
    {id: "50", nombre: "50px"},
  ];

  titulo1 = new FormControl('', [Validators.required]);
  titulo2 = new FormControl('');
  titulo3 = new FormControl('');
  titulo4 = new FormControl('');
  ancho1 = new FormControl('', [Validators.required, Validators.min(0), Validators.max(99999)]);
  alto1 = new FormControl('', [Validators.required, Validators.min(0), Validators.max(99999)]);
  barras1 = new FormControl('', [Validators.required, Validators.min(0), Validators.max(99)]);
  pct1 = new FormControl('', [Validators.required, Validators.min(0), Validators.max(100)]);

  hayError01: boolean = false;
  hayError11: boolean = false;
  hayError12: boolean = false;
  hayError13: boolean = false;
  hayError14: boolean = false;
  hayError21: boolean = false;
  hayError22: boolean = false;
  hayError23: boolean = false;
  hayError24: boolean = false;
  hayError31: boolean = false;
  hayError32: boolean = false;
  hayError33: boolean = false;
  hayError34: boolean = false;

  titulo: string = "";
  titulox: string = "";
  tituloy: string = "";
  tituloz: string = "";
  ancho: string = "0";
  alto: string = "0";
  f1: string = "18";
  f2: string = "18";
  f3: string = "18";
  f4: string = "18";
  m1: string = "5";
  m2: string = "5";
  m3: string = "5";
  m4: string = "5";
  barras: string = "20";
  pct: string = "80";
  checked1: boolean = false;
  checked2: boolean = false;
  checked3: boolean = false;
  checked4: boolean = false;
  checked5: boolean = false;
  checked6: boolean = false;
  checked7: boolean = false;
  soloejez: boolean = false;
  
  ngOnInit() {
  }

buscarGrafica() {
  let campos2 = {accion: 4, usuario: this.comunicacion.rUsuario().id, grafica: this.comunicacion.rGrafica()};
  this.gestionBD.consultasBD(campos2).subscribe((data: any)=>{
    if (!data) {
      let campos3 = {accion: 4, usuario: 0, grafica: this.comunicacion.rGrafica()};
      this.gestionBD.consultasBD(campos3).subscribe((data2: any)=>{
        this.llenarDatos(data2);
      })
    }
    else
    {
    this.llenarDatos(data);
    }
  })

}

llenarDatos(datos) {
  this.titulo = datos.texto;
  this.titulox = datos.textox;
  this.tituloy = datos.textoy;
  this.tituloz = datos.textoz;
  if (!this.tituloz) {
    this.tituloz="";
  }
  if (!this.titulo) {
    this.titulo="";
  }
  if (!this.titulox) {
    this.titulox="";
  }
  if (!this.tituloy) {
    this.tituloy="";
  }
  this.f1 = datos.font1;
  this.f2 = datos.font2;
  this.f3 = datos.font3;
  this.f4 = datos.font4;
  this.m1 = datos.margenizq;
  this.m2 = datos.margentop;
  this.m3 = datos.margender;
  this.m4 = datos.margenbot;
  this.ancho = datos.ancho;
  this.alto = datos.alto;
  this.barras = datos.maximo;
  this.pct = datos.maximopct;
  this.checked1 = datos.agrupar=="S";
  this.checked2 = datos.vermesanterior=="S";
  this.checked3 = datos.veranyoanterior=="S";
  this.checked4 = datos.compararmesanyo=="S";
  this.checked5 = datos.verytd=="S";
  this.checked6 = datos.vermtd=="S";
  this.checked7 = datos.filtrarhist=="S";
  this.soloejez = this.comunicacion.rGrafica() > 200;
  
}

cancelar(){
  this.datos.accion = 0;
  this.dialogRef.close(this.datos);
}

validar()
{
  this.hayError01=false;
  this.hayError11=false;
  this.hayError12=false;
  this.hayError13=false;
  this.hayError14=false;
  this.hayError21=false;
  this.hayError22=false;
  this.hayError23=false;
  this.hayError24=false;
  this.hayError31=false;
  this.hayError32=false;
  this.hayError33=false;
  this.hayError34=false;
  let consultaN: string  = this.titulo2.value.replace(/['"]+/g, '');
  consultaN = consultaN.replace(/\\/g, "/")
  this.titulox = consultaN;
  consultaN = this.titulo3.value.replace(/['"]+/g, '');
  consultaN = consultaN.replace(/\\/g, "/")
  this.tituloy = consultaN;
  consultaN = this.titulo4.value.replace(/['"]+/g, '');
  consultaN = consultaN.replace(/\\/g, "/")
  this.tituloz = consultaN;

  if (!this.titulo1) {
    this.hayError01=true;
  }
  else {
    consultaN = this.titulo1.value.replace(/['"]+/g, '');
    consultaN = consultaN.replace(/\\/g, "/")
    this.titulo = consultaN;
  
  }
  if (!this.f1) {
    this.hayError11=true;
  }
  if (!this.f2) {
    this.hayError11=true;
  }
  if (!this.f3) {
    this.hayError11=true;
  }
  if (!this.f4) {
    this.hayError11=true;
  }
  let errores = this.hayError01  || this.hayError11 || this.hayError12 || this.hayError13 || this.hayError14 || this.hayError21 || this.hayError22 || this.hayError23 || this.hayError24 || this.hayError31 || this.hayError32 || this.hayError33 || this.hayError34
  if (!errores)
  {
    if (!this.barras1.value) {this.barras = "0"}
    if (!this.pct1.value) {this.pct = "0"}
    if (!this.ancho1.value) {this.ancho = "0"}
    if (!this.alto1.value) {this.alto = "0"}
    let ma = this.checked2 ? "S" : "N";
    let aa = this.checked3 ? "S" : "N";
    let maa = this.checked4 ? "S" : "N";
    let mtd = this.checked5 ? "S" : "N";
    let ytd = this.checked6 ? "S" : "N";
    let agr = this.checked1 ? "S" : "N";
    let fh = this.checked7 ? "S" : "N";

      //Se gusrda la consulta
      let consultaSQL = "SELECT COUNT(*) as hay from preferencias where usuario = " + this.comunicacion.rUsuario().id + " and grafica = " + this.comunicacion.rGrafica();  ;
      let camposcab={accion: 50100, consulta: consultaSQL};  
      this.gestionBD.consultasBD(camposcab).subscribe((data: any) =>{
        if (data.hay==1)
        {
          consultaSQL = "delete from preferencias where usuario = " + this.comunicacion.rUsuario().id + " and grafica = " + this.comunicacion.rGrafica();
          camposcab={accion: 50030, consulta: consultaSQL};  
          this.gestionBD.escribirBD(camposcab).subscribe((data: any) =>{
            consultaSQL = "insert into preferencias (usuario, grafica, texto, maximo, maximopct, vermesanterior, veranyoanterior, compararmesanyo, verytd, vermtd, agrupar, textox, textoy, textoz, font1, font2, font3, font4, ancho, alto, margenizq, margender, margentop, margenbot, filtrarhist) VALUES (" + this.comunicacion.rUsuario().id + ", " + this.comunicacion.rGrafica() + ", '" + this.titulo1.value + "', " + this.barras + ", " + this.pct + ", '" + ma + "', '" + aa + "', '" + maa  + "', '" + ytd + "', '" + mtd + "', '" + agr + "', '" + this.titulox + "', '" + this.tituloy + "', '" + this.tituloz + "', " + this.f1 + ", " + this.f2 + ", " + this.f3 + ", " + this.f4 + ", "  + this.ancho + ", "  + this.alto + ", " + this.m1 + ", "  + this.m3 + ", " + this.m2 + ", " + this.m4 + ", '" + fh + "')"
            camposcab={accion: 50030, consulta: consultaSQL};  
            this.gestionBD.escribirBD(camposcab).subscribe((data: any) =>{
              this.datos.accion = 1;
              this.dialogRef.close(this.datos);
          });
        });
      }
      else
      {
        consultaSQL = "insert into preferencias (usuario, grafica, texto, maximo, maximopct, vermesanterior, veranyoanterior, compararmesanyo, verytd, vermtd, agrupar, textox, textoy, textoz, font1, font2, font3, font4, ancho, alto, margenizq, margender, margentop, margenbot, filtrarhist) VALUES (" + this.comunicacion.rUsuario().id + ", " + this.comunicacion.rGrafica() + ", '" + this.titulo1.value + "', " + this.barras + ", " + this.pct + ", '" + ma + "', '" + aa + "', '" + maa  + "', '" + ytd + "', '" + mtd + "', '" + agr + "', '" + this.titulox + "', '" + this.tituloy + "', '" + this.tituloz + "', " + this.f1 + ", " + this.f2 + ", " + this.f3 + ", " + this.f4 + ", "  + this.ancho + ", "  + this.alto + ", " + this.m1 + ", "  + this.m3 + ", " + this.m2 + ", " + this.m4 + ", '" + fh + "')"
        camposcab={accion: 50030, consulta: consultaSQL};  
        this.gestionBD.escribirBD(camposcab).subscribe((data: any) =>{
          this.datos.accion = 1;
          this.dialogRef.close(this.datos);
      })
      }
      this.datos.accion = 1;
      this.dialogRef.close(this.datos);

      });
    }
  }

}
