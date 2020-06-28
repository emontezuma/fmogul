import { Component, OnInit, HostListener } from '@angular/core';
import { ComunicacionService } from '../services/comunicacion.service';
import { Subscription }   from 'rxjs';


export class repImagen {
  imagen: string
}

@Component({
  selector: 'app-reproductor-imagenes-pares',
  templateUrl: './reproductor-imagenes-pares.component.html',
  styleUrls: ['./reproductor-imagenes-pares.component.css']
})
export class ReproductorImagenesParesComponent implements OnInit {

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
  verImagen01: boolean = false;
  constructor(private comunicacion: ComunicacionService) 
  {

    
  }

  ngOnInit() {
    this.comunicacion.panelActual(100);
   
  }

}
