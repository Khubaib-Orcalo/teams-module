import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { GatewaySessionManager } from './gateway.session';

@Module({
  controllers: [ChatController],
  providers: [
    ChatService,
    ChatGateway,
    {
      provide: 'SESSION_MANAGER',
      useClass: GatewaySessionManager,
    },
  ]
})
export class ChatModule {}
