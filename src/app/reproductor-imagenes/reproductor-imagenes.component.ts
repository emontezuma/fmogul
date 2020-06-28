import { Component, OnInit, HostListener } from '@angular/core';
import { ComunicacionService } from '../services/comunicacion.service';
import { Subscription }   from 'rxjs';
import { trigger, style, animate, transition, state } from '@angular/animations';

export class repImagen {
  imagen: string
}


@Component({
  selector: 'app-reproductor-imagenes',
  templateUrl: './reproductor-imagenes.component.html',
  styleUrls: ['./reproductor-imagenes.component.css'],
  animations: [trigger('fade', [
    state('out', style({ opacity: 0, transform: 'translateY(-30px)' })),
    state('in', style({ opacity: 1, transform: 'translateY(0px)' })),
    transition('* <=> *', [
      animate(500)
    ])
  ])]
})

export class ReproductorImagenesComponent implements OnInit {

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.pantallaAncho = window.innerWidth *.9;
    this.pantallaAlto = window.innerHeight *.8;
  }
  subscription: Subscription;
  miImagen: string = "";  
  pantallaAlto: number = 400;
  pantallaAncho: number = 600;
  verAlarmados: boolean = true;
  state: string = ""
  dimagen: string = "";
  constructor(private comunicacion: ComunicacionService) 
  {

    this.subscription = this.comunicacion.reproduccionImagen$.subscribe((data: string) => {
      this.state = "out";
      setTimeout(() => {
        this.mostrarImagen(data);
      }, 300);
      
    })
  }

  mostrarImagen(data)
  {
    this.state = "in";
      this.miImagen = data;
      this.pantallaAncho = window.innerWidth *.9;
      this.pantallaAlto = window.innerHeight *.8;
      var yourImg = document.getElementById('fotografia');
      if(yourImg && yourImg.style) {
        yourImg.style.height = Math.floor(this.pantallaAlto) + 'px';
      }
  }

  ngOnInit() {
    this.state = "in";
    this.comunicacion.panelActual(100);
  }

}

