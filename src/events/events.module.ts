import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { TalksModule } from '../talk/talks.module';

@Module({
  providers: [EventsGateway],
  imports: [TalksModule],
})
export class EventsModule {}
