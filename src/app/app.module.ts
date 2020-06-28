import { BrowserModule, Title  } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEsMX from '@angular/common/locales/es-MX';
import { AppComponent } from './app.component';
import { MaterialModule } from './material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { LlamadaAtencionComponent } from './llamada-atencion/llamada-atencion.component';
import { DialogoComponent } from './dialogo/dialogo.component';
import { GestionApisService } from './services/gestion-apis.service';
import { LlamadasMmcallService } from './services/llamadas-mmcall.service';
import { APP_BASE_HREF, LocationStrategy, HashLocationStrategy} from '@angular/common';
import { LlamadaMapa1Component } from './llamada-mapa1/llamada-mapa1.component';
import { ComunicacionService } from './services/comunicacion.service';
import { DxChartModule } from 'devextreme-angular';
import { DxDataGridModule } from 'devextreme-angular';
import 'hammerjs';
import 'rxjs';
import { LlamadaMapa2Component } from './llamada-mapa2/llamada-mapa2.component';
import { LlamadaMapa3Component } from './llamada-mapa3/llamada-mapa3.component';
import { FlexLayoutModule } from '@angular/flex-layout';  
import { LlamadaMapa4Component } from './llamada-mapa4/llamada-mapa4.component';
import { LlamadaReporteComponent } from './llamada-reporte/llamada-reporte.component';
import { DialogoLlamadaComponent } from './dialogo-llamada/dialogo-llamada.component';
import { MensajeFlotanteComponent } from './mensaje-flotante/mensaje-flotante.component';
import { DialogoCambioComponent } from './dialogo-cambio/dialogo-cambio.component';
import { ReporteMapa1Component } from './reporte-mapa1/reporte-mapa1.component';
import { ReporteMapa2Component } from './reporte-mapa2/reporte-mapa2.component';
import { ReporteMapa3Component } from './reporte-mapa3/reporte-mapa3.component';
import { DialogoCierreComponent } from './dialogo-cierre/dialogo-cierre.component';
import { ReporteGrafica1Component } from './reporte-grafica1/reporte-grafica1.component';
import { ReporteGrafica2Component } from './reporte-grafica2/reporte-grafica2.component';
import { ReporteGrafica3Component } from './reporte-grafica3/reporte-grafica3.component';
import { Panel1Component } from './panel1/panel1.component';
import { Panel2Component } from './panel2/panel2.component';
import { Panel3Component } from './panel3/panel3.component';
import { DatePipe } from '@angular/common';
import { DialogoCTComponent } from './dialogo-ct/dialogo-ct.component';
import { DialogoFiltroComponent } from './dialogo-filtro/dialogo-filtro.component';
import { DialogoTablasComponent } from './dialogo-tablas/dialogo-tablas.component';
import { DialogoNuevaComponent } from './dialogo-nueva/dialogo-nueva.component';
import { ReporteGrafica4Component } from './reporte-grafica4/reporte-grafica4.component';
import { DialogoGraficaComponent } from './dialogo-grafica/dialogo-grafica.component';
import { Panel4Component } from './panel4/panel4.component';
import { DialogoConfiguracionComponent } from './dialogo-configuracion/dialogo-configuracion.component';
import { DialogoParosComponent } from './dialogo-paros/dialogo-paros.component';
import { DetalleParosComponent } from './detalle-paros/detalle-paros.component';
import { PagersComponent } from './pagers/pagers.component';
import { DialogoPagerComponent } from './dialogo-pager/dialogo-pager.component';
import { DialogoParteComponent } from './dialogo-parte/dialogo-parte.component';
import { PartesComponent } from './partes/partes.component';
import { CelulasComponent } from './celulas/celulas.component';
import { DialogoCelulasComponent } from './dialogo-celulas/dialogo-celulas.component'  
import { DxColorBoxModule } from 'devextreme-angular';
import { DialogoAreasComponent } from './dialogo-areas/dialogo-areas.component';
import { AreasComponent } from './areas/areas.component';
import { FallasComponent } from './fallas/fallas.component';
import { DialogoFallasComponent } from './dialogo-fallas/dialogo-fallas.component';
import { DialogoHistoricoComponent } from './dialogo-historico/dialogo-historico.component';
import { DialogoGeneralesComponent } from './dialogo-generales/dialogo-generales.component';
import { GeneralesComponent } from './generales/generales.component';
import { MaquinasComponent } from './maquinas/maquinas.component';
import { DialogoMaquinasComponent } from './dialogo-maquinas/dialogo-maquinas.component';
import { DialogoTurnosComponent } from './dialogo-turnos/dialogo-turnos.component';
import { TurnosComponent } from './turnos/turnos.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { DialogoUsuariosComponent } from './dialogo-usuarios/dialogo-usuarios.component';
import { PoliticasComponent } from './politicas/politicas.component';
import { DialogoPoliticasComponent } from './dialogo-politicas/dialogo-politicas.component';
import { RolesComponent } from './roles/roles.component';
import { DialogoRolesComponent } from './dialogo-roles/dialogo-roles.component';
import { PoliticaComponent } from './politica/politica.component';
import { InicioSesionComponent } from './inicio-sesion/inicio-sesion.component';
import { BlankComponent } from './blank/blank.component';
import { CambioClaveComponent } from './cambio-clave/cambio-clave.component';
import { NuevaClaveComponent } from './nueva-clave/nueva-clave.component';
import { SolicitarTecnicoComponent } from './solicitar-tecnico/solicitar-tecnico.component';
import { DialogoReproductorComponent } from './dialogo-reproductor/dialogo-reproductor.component';
import { ReproductorComponent } from './reproductor/reproductor.component';
import { ReproductorMttrComponent } from './reproductor-mttr/reproductor-mttr.component';
import { ReproductorMtbfComponent } from './reproductor-mtbf/reproductor-mtbf.component';
import { ReproductorParetoComponent } from './reproductor-pareto/reproductor-pareto.component';
import { DialogoCancelarComponent } from './dialogo-cancelar/dialogo-cancelar.component';
import { ReproductorCelulasComponent } from './reproductor-celulas/reproductor-celulas.component';
import { ReproductorMaquinasComponent } from './reproductor-maquinas/reproductor-maquinas.component';
import { ReproductorAreasComponent } from './reproductor-areas/reproductor-areas.component';
import { ReproductorImagenesComponent } from './reproductor-imagenes/reproductor-imagenes.component';
import { ReproductorImagenesParesComponent } from './reproductor-imagenes-pares/reproductor-imagenes-pares.component';
import { GraficasComponent } from './graficas/graficas.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full', data:  { state: 'home' } },
  { path: 'home', component: BlankComponent, data:  { state: 'home' } },
  { 
      path: 'llamada', component: LlamadaAtencionComponent, data: { state: 'home' },
      children: [
        {path: '', redirectTo: 'maquinasgeneral', pathMatch: 'full', data:  { state: 'llamada' } },
        {path: 'maquinasgeneral', component: LlamadaMapa1Component, data:  { state: 'llamada' } },
        {path: 'celulas', component: LlamadaMapa2Component, data:  { state: 'llamada2' } },
        {path: 'maquinas', component: LlamadaMapa1Component, data:  { state: 'llamada3' } },
        {path: 'fallasgeneral', component: LlamadaMapa4Component, data:  { state: 'llamada4' } },
        {path: 'responsables', component: LlamadaMapa3Component, data:  { state: 'llamada5' } },
        {path: 'fallas', component: LlamadaMapa4Component, data:  { state: 'llamada6' } },
        {path: 'reporte', component: LlamadaReporteComponent, data:  { state: 'llamada7' } },
      ],
    },
    { 
      path: 'respuesta', component: ReporteMapa1Component, data:  { state: 'home' },
      children: [
        {path: '', redirectTo: 'fallasporatender', pathMatch: 'full', data:  { state: 'respuesta2' } },
        {path: 'fallasporatender', component: ReporteMapa2Component, data:  { state: 'respuesta2' } },
        {path: 'fallasatendidas', component: ReporteMapa3Component, data:  { state: 'respuesta3' } },
      ],
    },
    { 
      path: 'graficas', component: ReporteGrafica1Component, data:  { state: 'home' },
      children: [
        {path: '', redirectTo: 'mttrgeneral', pathMatch: 'full', data:  { state: 'graficas2' } },
        {path: 'mttrgeneral', component: ReporteGrafica2Component, data:  { state: 'graficas2' } },
        {path: 'mtbfgeneral', component: ReporteGrafica3Component, data:  { state: 'graficas2' } },
        {path: 'paretos', component: ReporteGrafica4Component, data:  { state: 'graficas2' } },
      ],
    },
    { 
      path: 'panel', component: Panel1Component, data:  { state: 'home' },
      children: [
        {path: '', redirectTo: 'panelcelula', pathMatch: 'full', data:  { state: 'panel2' } },
        {path: 'panelcelula', component: Panel2Component, data:  { state: 'panel2' } },
        {path: 'panelmaquina', component: Panel3Component, data:  { state: 'panel3' } },
        {path: 'panelarea', component: Panel4Component, data:  { state: 'panel4' } },
      ],
    },

    { 
      path: 'paros', component: DetalleParosComponent, data:  { state: 'detalleParos' },
    },

    { 
      path: 'pagers', component: PagersComponent, data:  { state: 'pagers' },
    },

    { 
      path: 'partes', component: PartesComponent, data:  { state: 'partes' },
    },
    
    { 
      path: 'celulas', component: CelulasComponent, data:  { state: 'celulas' },
    },

    { 
      path: 'areas', component: AreasComponent, data:  { state: 'areas' },
    },

    { 
      path: 'fallas', component: FallasComponent, data:  { state: 'fallas' },
    },

    { 
      path: 'tgenerales', component: GeneralesComponent, data:  { state: 'tgenerales' },
    },

    { 
      path: 'maquinas', component: MaquinasComponent, data:  { state: 'maquinas' },
    },
    
    { 
      path: 'turnos', component: TurnosComponent, data:  { state: 'turnos' },
    },

    { 
      path: 'usuarios', component: UsuariosComponent, data:  { state: 'usuarios' },
    },

    { 
      path: 'politicas', component: PoliticaComponent, data:  { state: 'politicas' },
    },
    { 
      path: 'roles', component: RolesComponent, data:  { state: 'roles' },
    },

    { 
      path: 'reproductor', component: ReproductorComponent, data:  { state: 'reproductor' },
      children: [
        { 
          path: 'reproductormttr', component:ReproductorMttrComponent, data:  { state: 'reproductormttr' },
        },
    
        { 
          path: 'reproductormtbf', component:ReproductorMtbfComponent, data:  { state: 'reproductormttr' },
        },
    
        { 
          path: 'reproductorpareto', component:ReproductorParetoComponent, data:  { state: 'reproductormttr' },
        },
        { 
          path: 'reproductorcelulas', component:ReproductorCelulasComponent, data:  { state: 'reproductorcelulas' },
        },
        { 
          path: 'reproductormaquinas', component:ReproductorMaquinasComponent, data:  { state: 'reproductormaquinas' },
        },
        { 
          path: 'reproductorareas', component:ReproductorAreasComponent, data:  { state: 'reproductorareas' },
        },
        { 
          path: 'reproductorimagenes', component:ReproductorImagenesComponent, data:  { state: 'reproductorimagenes' },
        },
        { 
          path: 'reproductorimagenespares', component:ReproductorImagenesParesComponent, data:  { state: 'reproductorimagenepares' },
        },
      ],
    },

    


    { path: '*', component: BlankComponent },
];

registerLocaleData(localeEsMX, 'es-MX');


@NgModule({
  declarations: [
    AppComponent,
    LlamadaAtencionComponent,
    DialogoComponent,
    LlamadaMapa1Component,
    LlamadaMapa2Component,
    LlamadaMapa3Component,
    LlamadaMapa4Component,
    LlamadaReporteComponent,
    DialogoLlamadaComponent,
    MensajeFlotanteComponent,
    DialogoCambioComponent,
    ReporteMapa1Component,
    ReporteMapa2Component,
    ReporteMapa3Component,
    DialogoCierreComponent,
    ReporteGrafica1Component,
    ReporteGrafica2Component,
    ReporteGrafica3Component,
    Panel1Component,
    Panel2Component,
    Panel3Component,
    DialogoCTComponent,
    DialogoFiltroComponent,
    DialogoTablasComponent,
    DialogoNuevaComponent,
    ReporteGrafica4Component,
    DialogoGraficaComponent,
    Panel4Component,
    DialogoConfiguracionComponent,
    DialogoParosComponent,
    DetalleParosComponent,
    PagersComponent,
    DialogoPagerComponent,
    DialogoParteComponent,
    PartesComponent,
    CelulasComponent,
    DialogoCelulasComponent,
    DialogoAreasComponent,
    AreasComponent,
    FallasComponent,
    DialogoFallasComponent,
    DialogoHistoricoComponent,
    DialogoGeneralesComponent,
    GeneralesComponent,
    MaquinasComponent,
    DialogoMaquinasComponent,
    DialogoTurnosComponent,
    TurnosComponent,
    UsuariosComponent,
    DialogoUsuariosComponent,
    PoliticasComponent,
    DialogoPoliticasComponent,
    RolesComponent,
    DialogoRolesComponent,
    PoliticaComponent,
    InicioSesionComponent,
    BlankComponent,
    CambioClaveComponent,
    NuevaClaveComponent,
    SolicitarTecnicoComponent,
    DialogoReproductorComponent,
    ReproductorComponent,
    ReproductorMttrComponent,
    ReproductorMtbfComponent,
    ReproductorParetoComponent,
    DialogoCancelarComponent,
    ReproductorCelulasComponent,
    ReproductorMaquinasComponent,
    ReproductorAreasComponent,
    ReproductorImagenesComponent,
    ReproductorImagenesParesComponent,
    GraficasComponent,
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    DxChartModule,
    DxDataGridModule,
    DxColorBoxModule
  ],
  entryComponents: [DialogoComponent, DialogoCierreComponent, DialogoCTComponent, DialogoLlamadaComponent, 
    MensajeFlotanteComponent, DialogoCambioComponent, DialogoFiltroComponent, DialogoTablasComponent, DialogoNuevaComponent,
    DialogoGraficaComponent, DialogoConfiguracionComponent, DialogoParosComponent, DialogoPagerComponent, DialogoParteComponent, DialogoCelulasComponent,
  DialogoAreasComponent, DialogoFallasComponent, DialogoHistoricoComponent, DialogoGeneralesComponent, DialogoMaquinasComponent,
  DialogoTurnosComponent, DialogoUsuariosComponent, DialogoPoliticasComponent, DialogoRolesComponent, InicioSesionComponent, CambioClaveComponent, NuevaClaveComponent, SolicitarTecnicoComponent,
  DialogoReproductorComponent, DialogoCancelarComponent ], 
  providers: [Title, GestionApisService, LlamadasMmcallService, ComunicacionService, 
    { provide: APP_BASE_HREF, useValue: './' } , DatePipe, { provide: LOCALE_ID, useValue: 'es-MX' },
    { provide: LocationStrategy, useClass: HashLocationStrategy }],
  bootstrap: [AppComponent]
})
export class AppModule { }


