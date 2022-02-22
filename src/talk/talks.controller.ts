import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ListQuery } from '../models/query';
import { from, Observable } from 'rxjs';
import { Talk } from './entities/talk.entity';
import { TalksService } from './services/talks.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateMessageBody, TalkData, UserTalkData } from '../models/talk';
import { UsersService } from '../users-shared/users.service';
import { UserTalk } from './entities/user-talk.entity';
import { UserTalksService } from './services/user-talks.service';
import { MessageService } from './services/message.service';
import { Message } from './entities/message.entity';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller('talks')
export class TalksController {
  constructor(
    private talksService: TalksService,
    private userService: UsersService,
    private userTalksService: UserTalksService,
    private messagesService: MessageService,
  ) {}

  @Get('')
  findAll(@Query() query: ListQuery): Observable<Talk[]> {
    return from(this.talksService.findAll());
  }

  @Get('get/:id')
  getTalk(@Param('id') id: string): Observable<Talk> {
    return from(this.talksService.findOne(id));
  }

  @Post('')
  async create(@Body() talk: TalkData, @Req() request) {
    const userId = request.user.id;
    return this.talksService.create(talk);
  }

  @Post('conversation/:opponentId')
  async createConversation(
    @Param('opponentId') opponentId: string,
    @Req() request,
  ) {
    const userId = request.user.id;
    return this.userTalksService.createConversation(userId, opponentId);
  }

  @Post('addToTalk')
  async addUserToTalk(@Body() userTalk: UserTalkData) {
    return this.userTalksService.addUserToTalk(userTalk);
  }

  // @Post('conversation')
  // async addUserToTalk(@Body() userTalk: UserTalkData) {
  //   return this.userTalksService.addUserToTalk(userTalk);
  // }

  // @Delete('user/:userId/talk/:tak')
  // async removeUserFromTalk(@Param('id') id: string) {
  //   const user = await this.userService.findOne(userTalk.userid);
  //   const talk = await this.talksService.findOne(userTalk.talkid);
  //   if (!user) {
  //     throw new HttpException(`User not found`, HttpStatus.NOT_FOUND);
  //   }
  //   if (!talk) {
  //     throw new HttpException(`User task not found`, HttpStatus.NOT_FOUND);
  //   }
  //   return this.talksService.addUserToTalk({
  //     user,
  //     talk,
  //     status: userTalk.status,
  //   });
  // }

  @Get('user/talks')
  getUserTalks(@Req() request): Observable<UserTalk[]> {
    return from(this.talksService.getUserTalks(request.user.id));
  }

  @Get('talks/:talkId/messages')
  getTalkMessages(
    @Param('talkId') talkId: string,
    @Req() request,
  ): Observable<Talk> {
    return from(this.messagesService.getTalkMessages({ talkId }));
  }

  @Post('talks/:talkId/messages')
  createTalkMessage(
    @Param('talkId') talkId: string,
    @Req() request,
    @Body() body: CreateMessageBody,
  ): Observable<Message> {
    return from(
      this.messagesService.createMessage({
        talkId,
        userId: request.user.id,
        ...body,
      }),
    );
  }
}
