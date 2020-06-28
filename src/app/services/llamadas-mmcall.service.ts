import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})


export class LlamadasMmcallService {
  //de prueba a producción
  //API_CALL = "http://localhost:8081/locations/integration/simulate/action=call&code=";
  //API_LATE = "http://localhost:8081/locations/integration/simulate/action=late&code=";
  //API_CANCEL = "http://localhost:8081/locations/integration/simulate/action=cancel&code=";
  //API_TO = "• http://localhost:8081/locations/integration/simulate/action=timeout&code=";
  //API_SMS = "http://localhost:8081/locations/integration/page/number=";
  //Validar si exite en requester en MMCall
  //API_VAL_REQUESTERbkp = "http://localhost:8081/fmogulapis/index.php?accion=";
  
  API_CALL = "/locations/integration/simulate/action=call&code=";
  API_LATE = "/locations/integration/simulate/action=late&code=";
  API_CANCEL ="/locations/integration/simulate/action=cancel&code=";
  API_TO = "/locations/integration/simulate/action=timeout&code=";
  API_SMS = "/locations/integration/page/number=";
  ////Validar si exite en requester en MMCall
  API_VAL_REQUESTER = "/fmogulapis/index.php?accion=";
  
  constructor( private httpClient: HttpClient ) { }

  //revisar el Observable
  llamadaMMCall(campos: any): Observable<any> {
    if (campos.accion==1) {
      return this.httpClient.get(this.API_CALL + campos.requester + "&key=1", {responseType: 'text'});
    }
    else if (campos.accion==2) {
      return this.httpClient.get(this.API_CANCEL + campos.requester, {responseType: 'text'});
      //return  this.httpClient.get(this.API_LATE + campos.requester, {responseType: 'text'});
    }
    else if (campos.accion==3) {
      return this.httpClient.get(this.API_CANCEL + campos.requester, {responseType: 'text'});
    }
    else if (campos.accion==4) {
      return this.httpClient.get<any>(this.API_TO + campos.requester);
    }
    else if (campos.accion==101) {
      this.httpClient.get(this.API_VAL_REQUESTER + "val_requester('" + campos.requester + "')").subscribe();
    }
    else if (campos.accion==5) {
      return this.httpClient.get(this.API_SMS + campos.unipager + "&message=" + campos.detalle, {responseType: 'text'});
    }
    
    
  }

}
