import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Talk } from './talk.entity';
import { TalkRepository } from './talks.repository';
import { TalkService } from './talk.service';
import { TalkController } from './talk.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Talk, TalkRepository])],
  providers: [TalkService],
  controllers: [TalkController],
})
export class TalksModule {}
