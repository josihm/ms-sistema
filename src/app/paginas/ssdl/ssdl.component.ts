import { Component, OnInit } from '@angular/core';
import { GenerarPDFServiceSDL } from 'src/app/recursos/servicios/generar-pdfSSDL.service';
import { GenerarPDFServiceSSIn } from 'src/app/recursos/servicios/generar-pdfSSIn.service';

@Component({
  selector: 'app-ssdl',
  templateUrl: './ssdl.component.html',
  styleUrls: ['./ssdl.component.scss']
})
export class SsdlComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  pruebaPdf():void {
    //GenerarPDFServiceSDL.generaPDF_SDL();
    GenerarPDFServiceSSIn.generaPDF_SIn();
  }
}
