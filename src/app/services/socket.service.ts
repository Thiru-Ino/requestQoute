import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket!: Socket ;

  constructor() {
    // Connect to the WebSocket server
    this.connect();
  }

  private connect(): void {
    this.socket = io('https://api.qualtros.com/price');
    console.log(this.socket)
  }

  // Method to emit an event to the WebSocket server
  public emit(eventName: string, data: any): void {
    if (!this.socket) {
      this.connect();
    }
    this.socket.emit(eventName, data);
  }

  // Method to listen for events from the WebSocket server
  public on(eventName: string): Observable<any> {
    return new Observable<any>(observer => {
      if (!this.socket) {
        this.connect();
      }
      this.socket.on(eventName, (data: any) => {
        observer.next(data);
      });
    });
  }

  // Method to disconnect from the WebSocket server
  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      // this.socket = null;
    }
  }
}
