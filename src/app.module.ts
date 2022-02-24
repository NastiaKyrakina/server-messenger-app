import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { UsersSharedModule } from './users-shared/users-shared.module';
import { TalksModule } from './talk/talks.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(),
    AuthModule,
    PassportModule.register({}),
    UsersSharedModule,
    UsersModule,
    TalksModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

// run migrations
// docker exec -t -i 91f62dfd84f4 /bin/sh
// npx typeorm migration:generate -n Talk -d src/migrations
//  node --require ts-node/register ./node_modules/typeorm/cli.js migrations:run
