import { Injectable } from '@angular/core';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private client: Client;
  private isConnected = false;
  private connectionSubject = new Subject<boolean>();

  constructor() {
    this.client = new Client({
      brokerURL: environment.wsUrl,
      reconnectDelay: 3000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        this.isConnected = true;
        this.connectionSubject.next(true);
      },
      onDisconnect: () => {
        this.isConnected = false;
        this.connectionSubject.next(false);
      },
      onStompError: () => {
        this.isConnected = false;
        this.connectionSubject.next(false);
      },
      onWebSocketClose: () => {
        this.isConnected = false;
        this.connectionSubject.next(false);
      }
    });

    try {
      this.client.activate();
    } catch {
      // conexion silenciosa
    }
  }

  // escucha eventos en un topico stomp especifico
  listen<T = any>(topic: string): Observable<T> {
    return new Observable<T>(observer => {
      let sub: StompSubscription | null = null;

      const subscribeToTopic = () => {
        if (!this.isConnected || !this.client.connected) return;
        try {
          sub = this.client.subscribe(topic, (message: IMessage) => {
            try {
              const parsed = JSON.parse(message.body);
              observer.next(parsed);
            } catch {
              observer.next(message.body as unknown as T);
            }
          });
        } catch {
          // error silencioso
        }
      };

      if (this.isConnected && this.client.connected) {
        subscribeToTopic();
      }

      const connSub = this.connectionSubject.subscribe(connected => {
        if (connected && !sub) {
          subscribeToTopic();
        } else if (!connected) {
          sub = null;
        }
      });

      return () => {
        connSub.unsubscribe();
        if (sub) {
          try {
            sub.unsubscribe();
          } catch {
            // cleanup silencioso
          }
        }
      };
    });
  }

  // eventos generales para administracion y cocina
  onAdminEvents(): Observable<any> {
    return this.listen('/topic/admin');
  }

  // eventos de cambio de estado de pedidos para clientes
  onOrderStatusEvents(): Observable<any> {
    return this.listen('/topic/orders/status');
  }

  // eventos especificos de un pedido
  onSingleOrderStatus(orderId: number): Observable<any> {
    return this.listen(`/topic/orders/${orderId}/status`);
  }
}
