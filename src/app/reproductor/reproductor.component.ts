import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { ComunicacionService } from '../services/comunicacion.service';
import { GestionApisService } from '../services/gestion-apis.service';
import { Router } from '@angular/router';
import { trigger, animate, style, group, query, transition } from "@angular/animations";

export const routerTransition2 = trigger('routerTransition2', [
  transition('* <=> *', [
    query(':enter, :leave', style({ position: 'absolute', width:'100%' })
      , { optional: true }),
    group([
      query(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('0.5s ease-in-out', style({ opacity: 1, transform: 'translateY(0px)' }))
      ], { optional: true }),
      query(':leave', [
        style({ opacity: 1, transform: 'translateY(0px)' }),
        animate('0.5s ease-in-out', style({ opacity: 0, transform: 'translateY(30px)' }))
      ], { optional: true }),
    ])
  ])
])


export class repImagen {
  imagen: string
}

@Component({
  selector: 'app-reproductor',
  templateUrl: './reproductor.component.html',
  styleUrls: ['./reproductor.component.css'],
  animations: [ routerTransition2 ]
})

export class ReproductorComponent implements OnInit {
  orden: number = 0;
  iconoCronos: string = "./assets/cronos.png";
  esGrafico: boolean = false;
  esPanel: boolean = false;
  esImagen: boolean = false;
  f1: string = "0";
  f2: string = "0";
  f3: string = "0";
  f4: string = "0";
  f5: string = "0";
  f6: string = "0";
  f7: string = "0";
  f8: string = "0";
  f9: string = "0";
  f10: string = "0";

  estatus: boolean = false;
  marquesina: string = "";
  tImagenes: number = 0;
  aImagenes: number = 0;
  d1: number = 0;
  d2: number = 0;
  d3: number = 0;
  d4: number = 0;
  d5: number = 0;
  d6: number = 0;
  d7: number = 0;
  d8: number = 0;
  d9: number = 0;
  d10: number = 0;
  d12: number = 0;
  cronos;
  imagenes: repImagen [];  
  //API_FMOGUL = "http://localhost:8081/fmogulapis/imagenes/";
  API_FMOGUL = "/fmogulapis/imagenes/";
  //de prueba a produccion

  constructor(private router: Router, private gestionBD: GestionApisService, private comunicacion: ComunicacionService) 
  {
    if (this.comunicacion.rUsuario().id==0)
    {this.router.navigateByUrl('/home')} 
   }

cronometro()
{
  if (this.comunicacion.rpanelActual()!=100)
  {
    clearTimeout(this.cronos)
  }
  else
  {
  this.orden = this.orden + 1;
  if (this.orden > 11) 
  {
    this.orden = 1
  };
  let campos={accion: 900};
  this.gestionBD.consultasBD(campos).subscribe((data)=>{
    if (data) {
      if (!data.marquesina)
      {this.marquesina = "";}
      else
      {this.marquesina = data.marquesina;}
      this.comunicacion.conMarquesina(this.marquesina.length>0)


      this.estatus = (data.carpetaimagenes=="S" ? true: false);
      this.d12 = data.duracion;
      let consulta2 = "SELECT * from reproductor where orden = " + this.orden + " and grafica > 0 and duracion > 0";
      let camposcab={accion: 50100, consulta: consulta2};  
      this.gestionBD.consultasBD(camposcab).subscribe((data2) =>{
        if (data2) {
          if (data2.grafica==1001) 
            {
              this.comunicacion.mostrarNota.emit("CÉLULAS ALARMADAS");
              this.router.navigateByUrl('reproductor/reproductorcelulas');
              
              this.cronos= setTimeout(() => {
                this.cronometro()
              }, +data2.duracion * 1000);
            }
          
            else if (data2.grafica==1002) 
            {
              this.comunicacion.mostrarNota.emit("MÁQUINAS ALARMADAS");
              this.router.navigateByUrl('reproductor/reproductormaquinas');
              
              this.cronos= setTimeout(() => {
                this.cronometro()
              }, +data2.duracion * 1000);
            }

            else if (data2.grafica==1003) 
            {
              this.comunicacion.mostrarNota.emit("ÁREAS ALARMADAS");
              this.router.navigateByUrl('reproductor/reproductorareas');
              
              this.cronos= setTimeout(() => {
                this.cronometro()
              }, +data2.duracion * 1000);
            }
          
            else if (data2.grafica>=1 && data2.grafica<=13) 
            {
              this.comunicacion.mostrarNota.emit("GRÁFICAS DE MTTR");
              this.comunicacion.aReproducir(+data2.grafica)
              this.router.navigateByUrl("reproductor/reproductormttr");
              this.comunicacion.reproducirGrafica("MTTR");
              
              this.cronos= setTimeout(() => {
                this.cronometro()
              }, +data2.duracion * 1000);
            }
            else if (data2.grafica>=101 && data2.grafica<=112) 
            {
              this.comunicacion.mostrarNota.emit("GRÁFICAS DE MTBF");
              this.comunicacion.aReproducir(+data2.grafica)
              this.router.navigateByUrl("reproductor/reproductormtbf");
              this.comunicacion.reproducirGrafica("MTBF");
              
              this.cronos=setTimeout(() => {
                this.cronometro()
              }, +data2.duracion * 1000);
            }
            else if (data2.grafica>=201 && data2.grafica<=213) 
            {
              this.comunicacion.mostrarNota.emit("GRÁFICAS DE PARETO");
              this.comunicacion.aReproducir(+data2.grafica)
              this.router.navigateByUrl("reproductor/reproductorpareto");
              this.comunicacion.reproducirGrafica("PARETO");
              
              this.cronos=setTimeout(() => {
                this.cronometro()
              }, +data2.duracion * 1000);
            }
            else
            {
              this.cronometro();
            }
          }
          else if (this.orden==11)
          {
            this.aImagenes = 0;
            this.imagenes = [];
            let camposcab={accion: 990099};  
            this.gestionBD.consultasBD(camposcab).subscribe((data2: any []) =>{
              if (data2) {
                clearTimeout(this.cronos)
                data2.forEach((elemento, index) => {
                  if (index==0)
                  {this.imagenes.push({imagen: this.API_FMOGUL + elemento});}
                  this.imagenes.push({imagen: this.API_FMOGUL + elemento});
                  if (index==data2.length-1)
                  {
                    console.log("Lista de imagenes: " + data2)
                    this.tImagenes=data2.length+1;
                    this.mostrarImagenes();
                  }
                })
              }
              else
              {
                this.cronometro();     
              }
            })
            if (this.tImagenes==0)
            {
              this.cronometro();     
            }
            
          }
          else
        {
          this.cronometro();
        }
      })
    }
  })
  }
}

mostrarImagenes()
{
  if (this.comunicacion.rpanelActual()!=100)
  {
    clearTimeout(this.cronos)
  }
  else
  {
  this.aImagenes = this.aImagenes + 1;
  if (this.aImagenes <= this.tImagenes)
  {
    this.comunicacion.reproducirImagenes(this.imagenes[this.aImagenes - 1].imagen);
      this.router.navigateByUrl("reproductor/reproductorimagenes");
      if (this.aImagenes==1)
      this.cronos=setTimeout(() => {
        this.mostrarImagenes()
      }, 50);
      else
      {this.cronos=setTimeout(() => {
        this.mostrarImagenes()
      }, +this.d12 * 1000);}
  }
  else 
  {
    this.cronometro();
  }
}
}

irCronos() {
    window.open("http://www.mmcallmexico.mx/  ", "_blank");
  }

getState(outlet)
  {
    return outlet.activatedRouteData.state;
  }

  ngOnInit() {
    this.comunicacion.panelActual(100);
    setTimeout(() => {
      this.cronometro()
  }, 500);
  }

}
