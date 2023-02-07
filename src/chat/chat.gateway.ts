import { Bind, Inject } from '@nestjs/common'
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect
} from '@nestjs/websockets';
import { Server } from 'socket.io'

// Local Imports
import { IGatewaySessionManager } from './gateway.session';

@WebSocketGateway({
  cors: {
    origin: '*'
  }
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

  constructor(
    @Inject('SESSION_MANAGER') readonly sessions: IGatewaySessionManager
  ) { }

  @WebSocketServer()
  server: Server

  handleConnection(socket: any) {
    console.log('Incoming Connection');
    // console.log(socket.handshake.auth.id)
    console.log(`${socket.handshake.auth.username} connected.`)
    // console.log(this.server.sockets.adapter.nsp.sockets)
    this.sessions.setUserSocket(socket.id, socket);
    socket.broadcast.emit('connected', { id: socket.id, username: socket.handshake.auth.username })
  }

  handleDisconnect(socket: any) {
    console.log('handleDisconnect');
    console.log(`${socket.handshake.auth.username} disconnected.`);
    this.sessions.removeUserSocket(socket.id)
  }

  @SubscribeMessage('getOnlineUsers')
  async handleGetOnlineGroupUsers(
    @MessageBody() data: any,
    @ConnectedSocket() socket: any,
  ) {
    const onlineUsers = [];
    const offlineUsers = [];
    let users = []
    for (let [id, socket] of this.server.sockets.adapter.nsp.sockets) {
      const user = {
        id: id,
        username: socket.handshake.auth.username,
      }
      const item = this.sessions.getUserSocket(user.id);
      item ? onlineUsers.push(user) : offlineUsers.push(user);
      users.push();
    }
    
    socket.emit('onlineUsers', { onlineUsers, offlineUsers });
  }

  @Bind(MessageBody(), ConnectedSocket())
  @SubscribeMessage('ping')
  async connect(
    @MessageBody() data: any,
    @ConnectedSocket() client: any
  ) {
    console.log('ping recieved', data)

    client.broadcast('pong', () => {
      console.log('pong sent')
    })
  }

  @Bind(MessageBody(), ConnectedSocket())
  @SubscribeMessage('ping')
  async ping(
    @MessageBody() data: any,
    @ConnectedSocket() client: any
  ) {
    console.log('ping recieved', data)

    client.broadcast('pong', () => {
      console.log('pong sent')
    })
  }
}
