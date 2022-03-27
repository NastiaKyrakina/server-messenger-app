import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { TalkListQuery, TalkListQueryExtended } from '../models/query';
import { from, Observable } from 'rxjs';
import { Talk, TalkType } from './entities/talk.entity';
import { TalksService } from './services/talks.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateMessageBody, RemoveMessageData, TalkData, UserTalkDeleteData } from '../models/talk';
import { UsersService } from '../users-shared/users.service';
import { UserStatus, UserTalk } from './entities/user-talk.entity';
import { UserTalksService } from './services/user-talks.service';
import { MessageService } from './services/message.service';
import { Message } from './entities/message.entity';

@ApiTags('talks')
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
  findAll(@Query() query: TalkListQueryExtended): Observable<Talk[]> {
    return from(this.talksService.findWithParams(query));
  }

  @Get('/public')
  findAllPublic(@Query() query: TalkListQuery): Observable<Talk[]> {
    return from(
      this.talksService.findWithParams({ ...query, type: TalkType.public }),
    );
  }

  @Get(':talkId')
  getTalk(@Param('talkId') talkId: string): Observable<Talk> {
    return from(this.talksService.findOne(talkId));
  }

  @Post('')
  async create(@Body() talk: TalkData, @Req() request) {
    const userId = request.user.id;
    return this.userTalksService.createWithUser(talk, userId);
  }

  @Delete(':talkId')
  async removeTalk(@Param('talkId') talkId: string) {
    return this.talksService.delete(talkId);
  }

  @Post('conversation/:opponentId')
  async createConversation(
    @Param('opponentId') opponentId: string,
    @Req() request,
  ) {
    const userId = request.user.id;
    return this.userTalksService.createConversation(userId, opponentId);
  }

  @Post(':talkId/user')
  async addUserToTalk(@Param('talkId') talkId: string, @Req() request) {
    const userId = request.user.id;
    await this.userTalksService.addUserToTalk(talkId, {
      userId,
      status: UserStatus.user,
    });
    return from(this.talksService.findOne(talkId));
  }

  @Delete(':talkId/user/:userId')
  async removeUserFromTalk(
    @Param('talkId') talkId: string,
    @Body() userTalk: UserTalkDeleteData,
  ) {
    // const user = await this.userService.findOne(userTalk.userid);
    // const talk = await this.talksService.findOne(userTalk.talkid);
    // if (!user) {
    //   throw new HttpException(`User not found`, HttpStatus.NOT_FOUND);
    // }
    // if (!talk) {
    //   throw new HttpException(`User task not found`, HttpStatus.NOT_FOUND);
    // }
    // return this.talksService.addUserToTalk({
    //   user,
    //   talk,
    //   status: userTalk.status,
    // });
  }

  @Get('user/talks')
  getUserTalks(@Req() request): Observable<UserTalk[]> {
    return from(this.talksService.getUserTalks(request.user.id));
  }

  @Get(':talkId/messages')
  getTalkMessages(
    @Param('talkId') talkId: string,
    @Req() request,
  ): Observable<Talk> {
    return from(this.messagesService.getTalkMessages({ talkId }));
  }

  @Post(':talkId/messages')
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

  @Delete(':talkId/messages')
  async removeMessageFromTalk(
    @Param('talkId') talkId: string,
    @Req() request,
    @Body() body: RemoveMessageData,
  ) {
    const userId = request.user.id;
    return this.messagesService.removeMessage(userId, body);
  }
}
