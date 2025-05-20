import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { AiChatCoreService } from './ai-chat-core.service';
import { AiChatCoreController } from './ai-chat-core.controller';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
  ],
  controllers: [AiChatCoreController],
  providers: [AiChatCoreService],
  exports: [AiChatCoreService],
})
export class AiChatCoreModule {}