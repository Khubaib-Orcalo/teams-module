import { Bind } from '@nestjs/common'
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway
} from '@nestjs/websockets';
import { NestGateway } from '@nestjs/websockets/interfaces/nest-gateway.interface';

@WebSocketGateway({
  cors: {
    origin: '*'
  }
})
export class ChatGateway implements NestGateway {
  
  afterInit(server: any) {
    console.log('Chat init')
  }

  handleConnection(socket: any) {
    console.log('User Connected')
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
