/**
 * Store global para capturar erros 402 (auto-registro necessário)
 * Usado para comunicação entre o interceptor axios e componentes React
 */

export interface AutoRegistrationEvent {
  email: string;
  password: string;
  name: string;
}

type Listener = (event: AutoRegistrationEvent) => void;

class AutoRegistrationStore {
  private listeners: Set<Listener> = new Set();

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  dispatch(event: AutoRegistrationEvent): void {
    this.listeners.forEach((listener) => listener(event));
  }
}

export const autoRegistrationStore = new AutoRegistrationStore();
