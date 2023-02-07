import { Injectable } from '@nestjs/common';

export interface IGatewaySessionManager {
  getUserSocket(id: number): any;
  setUserSocket(id: number, socket: any): void;
  removeUserSocket(id: number): void;
  getSockets(): Map<number, any>;
}

@Injectable()
export class GatewaySessionManager implements IGatewaySessionManager {
  private readonly sessions: Map<number, any> = new Map();

  getUserSocket(id: number) {
    return this.sessions.get(id);
  }

  setUserSocket(userId: number, socket: any) {
    this.sessions.set(userId, socket);
  }
  removeUserSocket(userId: number) {
    this.sessions.delete(userId);
  }
  getSockets(): Map<number, any> {
    return this.sessions;
  }
}
