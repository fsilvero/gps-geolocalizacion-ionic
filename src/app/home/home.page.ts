import { Component } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Geolocation, Position } from '@capacitor/geolocation';

type LocationState = 'idle' | 'loading' | 'success' | 'error';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  state: LocationState = 'idle';
  message = 'Pulsa el botón para consultar la ubicación de este dispositivo.';
  position: Position | null = null;

  async getLocation(): Promise<void> {
    this.state = 'loading';
    this.message = 'Buscando una señal de ubicación…';

    try {
      const granted = await this.ensureLocationPermission();
      if (!granted) {
        this.state = 'error';
        this.message = 'Permiso denegado. Habilita el acceso a la ubicación en los ajustes de la aplicación y vuelve a intentarlo.';
        return;
      }

      this.position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 0,
      });
      this.state = 'success';
      this.message = 'Ubicación obtenida correctamente.';
    } catch (error: unknown) {
      this.position = null;
      this.state = 'error';
      this.message = this.describeError(error);
    }
  }

  get readAt(): Date | null {
    return this.position ? new Date(this.position.timestamp) : null;
  }

  private async ensureLocationPermission(): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) {
      return true;
    }

    let permissions = await Geolocation.checkPermissions();
    if (permissions.location === 'granted' || permissions.coarseLocation === 'granted') {
      return true;
    }

    permissions = await Geolocation.requestPermissions();
    return permissions.location === 'granted' || permissions.coarseLocation === 'granted';
  }

  private describeError(error: unknown): string {
    const code = typeof error === 'object' && error !== null && 'code' in error
      ? String(error.code)
      : '';

    if (code === 'OS-PLUG-GLOC-0003') {
      return 'Permiso denegado. Habilita el acceso a la ubicación en los ajustes de la aplicación y vuelve a intentarlo.';
    }
    if (code === 'OS-PLUG-GLOC-0007' || code === 'OS-PLUG-GLOC-0009' || code === 'OS-PLUG-GLOC-0016') {
      return 'La ubicación está desactivada. Activa Ubicación/GPS en el teléfono y vuelve a intentarlo.';
    }
    if (code === 'OS-PLUG-GLOC-0010') {
      return 'La consulta tardó demasiado. Inténtalo otra vez en un lugar con mejor señal.';
    }

    const detail = error instanceof Error ? error.message : '';
    return detail
      ? `No se pudo obtener la ubicación. ${detail}`
      : 'No se pudo obtener la ubicación. Comprueba que el GPS esté activo e inténtalo nuevamente.';
  }
}
