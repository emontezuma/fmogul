import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
  import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class GestionApisService {

  //de prueba a producción
  API_FMOGUL = "http://localhost:8081/fmogulapis/index.php?";
  //API_FMOGUL = "/fmogulapis/index.php?";
  

  constructor( private httpClient: HttpClient ) {}
     //LLamadas a la BD de Federal Mogul
     consultasBD(campos: any): Observable<any> {      
       
      if (campos.accion==1) {
        return this.httpClient.get<any>(this.API_FMOGUL + "accion=mmcall_buscar_requester&maquina=" + campos.maquina + "&area=" + campos.area);
      }
      else if (campos.accion==2) {
        return this.httpClient.get<any>(this.API_FMOGUL + "accion=mmcall_existe_call&requester='" + campos.requester + "'" );
      }
      else if (campos.accion==3) {
        return this.httpClient.get<any>(this.API_FMOGUL + "accion=buscar_usuario&usuario=" + campos.usuario );
      }
      else if (campos.accion==4) {
        return this.httpClient.get<any>(this.API_FMOGUL + "accion=buscar_grafica_usuario&usuario=" + campos.usuario + "&grafica=" + campos.grafica );
      }
      
      else if (campos.accion==101) {
        return this.httpClient.get<any>(this.API_FMOGUL + "accion=listar_reportes&filtro=" + campos.filtro);
      }
      else if (campos.accion==10) {
        return this.httpClient.get<any>(this.API_FMOGUL + "accion=listar_reportes_alarmas&id=" + campos.id);
      }
      else if (campos.accion==201) {
        return this.httpClient.get<any>(this.API_FMOGUL + "accion=mmcall_hay_requester&requester=" + campos.requester);
      }
      else if (campos.accion==300) {
        return this.httpClient.get<any>(this.API_FMOGUL + "accion=listar_partes&filtro=" + campos.filtro);
      }
      else if (campos.accion==301) {
        return this.httpClient.get<any>(this.API_FMOGUL + "accion=mmcall_listar_pagers");
      }
      else if (campos.accion==302) {
        return this.httpClient.get<any>(this.API_FMOGUL + "accion=listar_pagers");
      }
      
      else if (campos.accion==1001) {
        return this.httpClient.get<any>(this.API_FMOGUL + "accion=listar_fallas&filtro=" + campos.filtro);
      }
      else if (campos.accion==1002) {
        return this.httpClient.get<any>(this.API_FMOGUL + "accion=listar_areas&filtro=" + campos.filtro);
      }
      else if (campos.accion==1003) {
        return this.httpClient.get<any>(this.API_FMOGUL + "accion=listar_fallas_ordenadas&filtro=" + campos.filtro + "&orden=" + campos.orden);
      }
      else if (campos.accion==1004) {
        return this.httpClient.get<any>(this.API_FMOGUL + "accion=listar_turnos&filtro=" + campos.filtro);
      }
      else if (campos.accion==1005) {
        return this.httpClient.get<any>(this.API_FMOGUL + "accion=listar_turno&id=" + campos.id);
      }
      else if (campos.accion==1006) {
        return this.httpClient.get<any>(this.API_FMOGUL + "accion=listar_turno_secuencia&secuencia=" + campos.secuencia);
      }
      else if (campos.accion==900) {
        return this.httpClient.get<any>(this.API_FMOGUL + "accion=listar_parametros");
      }
      else if (campos.accion==10000) {
        return this.httpClient.get<any>(this.API_FMOGUL + "accion=mmcall_requesters");
      }
      else if (campos.accion==10001) {
        return this.httpClient.get<any>(this.API_FMOGUL + "accion=listar_celulas_maquinas&filtro=" + campos.filtro + "&orden=" + campos.orden);
      }
      else if (campos.accion==10002) {
        return this.httpClient.get<any>(this.API_FMOGUL + "accion=listar_celulas&filtro=" + campos.filtro);
      }
      else if (campos.accion==10003) {
        return this.httpClient.get<any>(this.API_FMOGUL + "accion=listar_maquinas&filtro=" + campos.filtro + "&orden=" + campos.orden);
      }
      else if (campos.accion==10004) {
        return this.httpClient.get<any>(this.API_FMOGUL + "accion=listar_areas_fallas&filtro=" + campos.filtro + "&filtro2=" + campos.filtro2 + "&orden=" + campos.orden);
      }
      else if (campos.accion==800) {
        //Primera gráfica
        return this.httpClient.get<any>(this.API_FMOGUL + "accion=indicadores_fecha&desde=" + campos.desde + "&hasta=" + campos.hasta + "&filtroadicional=" + campos.filtroadicional);
      }
      
      else if (campos.accion==901) {
        //Primera gráfica
        return this.httpClient.get<any>(this.API_FMOGUL + "accion=indicadores_por_celula&desde=" + campos.desde + "&hasta=" + campos.hasta + "&filtroadicional=" + campos.filtroadicional);
      }
      else if (campos.accion==902) {
        //Segunda gráfica
        return this.httpClient.get<any>(this.API_FMOGUL + "accion=indicadores_por_maquina&desde=" + campos.desde + "&hasta=" + campos.hasta + "&filtroadicional=" + campos.filtroadicional);
      }
      else if (campos.accion==903) {
        //Segunda gráfica
        return this.httpClient.get<any>(this.API_FMOGUL + "accion=indicadores_por_area&desde=" + campos.desde + "&hasta=" + campos.hasta + "&filtroadicional=" + campos.filtroadicional);
      }
      else if (campos.accion==904) {
        //Segunda gráfica
        return this.httpClient.get<any>(this.API_FMOGUL + "accion=indicadores_por_falla&desde=" + campos.desde + "&hasta=" + campos.hasta + "&filtroadicional=" + campos.filtroadicional);
      }
      else if (campos.accion==905) {
        //Segunda gráfica
        return this.httpClient.get<any>(this.API_FMOGUL + "accion=indicadores_por_maquina_tipo&desde=" + campos.desde + "&hasta=" + campos.hasta + "&filtroadicional=" + campos.filtroadicional);
      }
      else if (campos.accion==906) {
        //Segunda gráfica
        return this.httpClient.get<any>(this.API_FMOGUL + "accion=indicadores_por_maquina_clasificador_1&desde=" + campos.desde + "&hasta=" + campos.hasta + "&filtroadicional=" + campos.filtroadicional);
      }
      else if (campos.accion==907) {
        //Segunda gráfica
        return this.httpClient.get<any>(this.API_FMOGUL + "accion=indicadores_por_maquina_clasificador_2&desde=" + campos.desde + "&hasta=" + campos.hasta + "&filtroadicional=" + campos.filtroadicional);
      }
      else if (campos.accion==908) {
        //Segunda gráfica
        return this.httpClient.get<any>(this.API_FMOGUL + "accion=indicadores_por_falla_clasificador_1&desde=" + campos.desde + "&hasta=" + campos.hasta + "&filtroadicional=" + campos.filtroadicional);
      }
      else if (campos.accion==909) {
        //Segunda gráfica
        return this.httpClient.get<any>(this.API_FMOGUL + "accion=indicadores_por_falla_clasificador_2&desde=" + campos.desde + "&hasta=" + campos.hasta + "&filtroadicional=" + campos.filtroadicional);
      }
      else if (campos.accion==910) {
        //Segunda gráfica
        return this.httpClient.get<any>(this.API_FMOGUL + "accion=indicadores_por_dia&desde=" + campos.desde + "&hasta=" + campos.hasta + "&filtroadicional=" + campos.filtroadicional);
      }
      else if (campos.accion==911) {
        //Segunda gráfica
        return this.httpClient.get<any>(this.API_FMOGUL + "accion=indicadores_por_semana&desde=" + campos.desde + "&hasta=" + campos.hasta + "&filtroadicional=" + campos.filtroadicional);
      }
      else if (campos.accion==912) {
        //Segunda gráfica
        return this.httpClient.get<any>(this.API_FMOGUL + "accion=indicadores_por_mes&desde=" + campos.desde + "&hasta=" + campos.hasta + "&filtroadicional=" + campos.filtroadicional);
      }
      else if (campos.accion==913) {
        //Segunda gráfica
        return this.httpClient.get<any>(this.API_FMOGUL + "accion=indicadores_por_tecnico&desde=" + campos.desde + "&hasta=" + campos.hasta + "&filtroadicional=" + campos.filtroadicional);
      }
      else if (campos.accion==914) {
        //Segunda gráfica
        return this.httpClient.get<any>(this.API_FMOGUL + "accion=indicadores_por_maquina_impacto&desde=" + campos.desde + "&hasta=" + campos.hasta + "&filtroadicional=" + campos.filtroadicional);
      }
      else if (campos.accion==915) {
        //Segunda gráfica
        return this.httpClient.get<any>(this.API_FMOGUL + "accion=indicadores_por_celula_impacto&desde=" + campos.desde + "&hasta=" + campos.hasta + "&filtroadicional=" + campos.filtroadicional);
      }

      else if (campos.accion==1801) {
        //Primera gráfica
        return this.httpClient.get<any>(this.API_FMOGUL + "accion=panel_por_celula&desde=" + campos.desde + "&hasta=" + campos.hasta + "&filtroadicional=" + campos.filtroadicional);
      }
      
      else if (campos.accion==1802) {
        //Primera gráfica
        return this.httpClient.get<any>(this.API_FMOGUL + "accion=ultima_llamada&filtro=" + campos.filtro);
      }

      else if (campos.accion==1803) {
        //Primera gráfica
        return this.httpClient.get<any>(this.API_FMOGUL + "accion=detalle_registro&sql=" + campos.filtro);
      }

      else if (campos.accion==1811) {
        //Primera gráfica
        return this.httpClient.get<any>(this.API_FMOGUL + "accion=panel_por_maquina&desde=" + campos.desde + "&hasta=" + campos.hasta + "&filtroadicional=" + campos.filtroadicional);
      }
      else if (campos.accion==1821) {
        //Primera gráfica
        return this.httpClient.get<any>(this.API_FMOGUL + "accion=panel_por_area&desde=" + campos.desde + "&hasta=" + campos.hasta + "&filtroadicional=" + campos.filtroadicional);
      }
      else if (campos.accion==1901) {
        //Primera gráfica
        return this.httpClient.get<any>(this.API_FMOGUL + "accion=pareto_por_celula&desde=" + campos.desde + "&hasta=" + campos.hasta + "&filtroadicional=" + campos.filtroadicional);
      }
      else if (campos.accion==1902) {
        //Primera gráfica
        return this.httpClient.get<any>(this.API_FMOGUL + "accion=pareto_por_maquina&desde=" + campos.desde + "&hasta=" + campos.hasta + "&filtroadicional=" + campos.filtroadicional);
      }
      else if (campos.accion==1903) {
        //Primera gráfica
        return this.httpClient.get<any>(this.API_FMOGUL + "accion=pareto_por_area&desde=" + campos.desde + "&hasta=" + campos.hasta + "&filtroadicional=" + campos.filtroadicional);
      }
      else if (campos.accion==1904) {
        //Primera gráfica
        return this.httpClient.get<any>(this.API_FMOGUL + "accion=pareto_por_falla&desde=" + campos.desde + "&hasta=" + campos.hasta + "&filtroadicional=" + campos.filtroadicional);
      }
      else if (campos.accion==1905) {
        //Primera gráfica
        return this.httpClient.get<any>(this.API_FMOGUL + "accion=pareto_por_maquina_tipo&desde=" + campos.desde + "&hasta=" + campos.hasta + "&filtroadicional=" + campos.filtroadicional);
      }
      else if (campos.accion==1906) {
        //Primera gráfica
        return this.httpClient.get<any>(this.API_FMOGUL + "accion=pareto_por_maquina_clasificador_1&desde=" + campos.desde + "&hasta=" + campos.hasta + "&filtroadicional=" + campos.filtroadicional);
      }
      else if (campos.accion==1907) {
        //Primera gráfica
        return this.httpClient.get<any>(this.API_FMOGUL + "accion=pareto_por_maquina_clasificador_2&desde=" + campos.desde + "&hasta=" + campos.hasta + "&filtroadicional=" + campos.filtroadicional);
      }
      else if (campos.accion==1908) {
        //Primera gráfica
        return this.httpClient.get<any>(this.API_FMOGUL + "accion=pareto_por_falla_clasificador_1&desde=" + campos.desde + "&hasta=" + campos.hasta + "&filtroadicional=" + campos.filtroadicional);
      }
      else if (campos.accion==1909) {
        //Primera gráfica
        return this.httpClient.get<any>(this.API_FMOGUL + "accion=pareto_por_falla_clasificador_2&desde=" + campos.desde + "&hasta=" + campos.hasta + "&filtroadicional=" + campos.filtroadicional);
      }
      else if (campos.accion==1910) {
        //Primera gráfica
        return this.httpClient.get<any>(this.API_FMOGUL + "accion=pareto_por_dia&desde=" + campos.desde + "&hasta=" + campos.hasta + "&filtroadicional=" + campos.filtroadicional);
      }
      else if (campos.accion==1911) {
        //Primera gráfica
        return this.httpClient.get<any>(this.API_FMOGUL + "accion=pareto_por_semana&desde=" + campos.desde + "&hasta=" + campos.hasta + "&filtroadicional=" + campos.filtroadicional);
      }
      else if (campos.accion==1912) {
        //Primera gráfica
        return this.httpClient.get<any>(this.API_FMOGUL + "accion=pareto_por_mes&desde=" + campos.desde + "&hasta=" + campos.hasta + "&filtroadicional=" + campos.filtroadicional);
      }
      else if (campos.accion==1913) {
        //Primera gráfica
        return this.httpClient.get<any>(this.API_FMOGUL + "accion=pareto_por_tecnico&desde=" + campos.desde + "&hasta=" + campos.hasta + "&filtroadicional=" + campos.filtroadicional);
      }
      
      //Filtros de gráficas
      else if (campos.accion==50000) {
        return this.httpClient.get<any>(this.API_FMOGUL + "accion=recuperar_consulta&consulta=" + campos.consulta);
      }
      else if (campos.accion==50005) {
        return this.httpClient.get<any>(this.API_FMOGUL + "accion=recuperar_consultas&usuario=" + campos.usuario);
      }
      else if (campos.accion==50100) {
        return this.httpClient.get<any>(this.API_FMOGUL + "accion=consulta_suelta_1&sentencia=" + campos.consulta);
      }
      else if (campos.accion==50300) {
        return this.httpClient.get<any>(this.API_FMOGUL + "accion=consulta_suelta_n&sentencia=" + campos.consulta);
      }
      else if (campos.accion>=50010 && campos.accion<=50095) {
        return this.httpClient.get<any>(this.API_FMOGUL + "accion=recuperar_tabla&tabla=" + campos.tabla + "&consulta=" + campos.consulta);
      }
      else if (campos.accion==50200) {
        return this.httpClient.get<any>(this.API_FMOGUL + "accion=consulta_suelta_2&sentencia=" + campos.consulta);
      }
      else if (campos.accion==990099) {
        return this.httpClient.get<any>(this.API_FMOGUL + "accion=ver_carpetas" );
      }
      
    }

    escribirBD(campos: any): Observable<any> {      
       
      if (campos.accion==1) {
        return this.httpClient.post<any>(this.API_FMOGUL + "accion=agregar_reporte", JSON.stringify(campos));
      }
      else if (campos.accion==2) {
        return this.httpClient.get<any>(this.API_FMOGUL + "accion=existe_call&requester='" + campos.requester + "'" );
      }
      else if (campos.accion==3) {
        return this.httpClient.post<any>(this.API_FMOGUL + "accion=cambiar_reporte_late", JSON.stringify(campos));
      }
      else if (campos.accion==4) {
        return this.httpClient.post<any>(this.API_FMOGUL + "accion=cambiar_reporte_cierre", JSON.stringify(campos))
      }
      else  if (campos.accion==5) {
        return this.httpClient.post<any>(this.API_FMOGUL + "accion=agregar_llamada", JSON.stringify(campos))
      }
      else if (campos.accion==6) {
        return this.httpClient.post<any>(this.API_FMOGUL + "accion=cambiar_inicio_reporte", JSON.stringify(campos))
      }
      else if (campos.accion==7) {
        return this.httpClient.post<any>(this.API_FMOGUL + "accion=cambiar_reporte_alarma", JSON.stringify(campos))
      }
      else if (campos.accion==50020) {
        return this.httpClient.post<any>(this.API_FMOGUL + "accion=agregar_detalle_consulta", JSON.stringify(campos))
      }
      else if (campos.accion==50030) {
        return this.httpClient.post(this.API_FMOGUL + "accion=actualizar_consulta_totales", JSON.stringify(campos))
        .pipe(
          catchError(this.erroresBD)
        );
      }
      
    }

    private erroresBD(error: HttpErrorResponse) {
      if (error.error instanceof ErrorEvent) {
        // A client-side or network error occurred. Handle it accordingly.
        return '';
      } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong,
        return  '';
      }
      // return an observable with a user-facing error message
      return throwError(
        '');
    };
}
