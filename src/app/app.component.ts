import { Component, OnInit } from '@angular/core';
import { inject } from '@vercel/analytics';
import { injectSpeedInsights } from '@vercel/speed-insights';
import { environment } from './environments/environment';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'cuentoneta-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    CommonModule,
    FooterComponent,
    HeaderComponent,
    NgOptimizedImage,
    RouterModule,
  ],
})
export class AppComponent implements OnInit {
  constructor() {
    // Importa y configura el paquete de analytics de Vercel.
    inject({
      mode: environment.environment === 'production' ? 'production' : 'development',
    });
  }

  ngOnInit(): void {
    // Invoca a injectSpeedInsights aquí para asegurarse de que se ejecute en el lado del cliente.
    injectSpeedInsights();
  }
}
