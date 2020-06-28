import { Component, OnInit } from '@angular/core';
import { ComunicacionService } from '../services/comunicacion.service';


@Component({
  selector: 'app-blank',
  templateUrl: './blank.component.html',
  styleUrls: ['./blank.component.css']
})
export class BlankComponent implements OnInit {

  constructor(private comunicacion: ComunicacionService) { 
    this.comunicacion.mostrarEstado.emit("");
  }

  ngOnInit() {
  }

}
