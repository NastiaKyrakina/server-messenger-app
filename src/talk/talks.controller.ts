import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TalkListQuery, TalkListQueryExtended } from '../models/query';
import { from, Observable, ObservedValueOf } from 'rxjs';
import { Talk, TalkType } from './entities/talk.entity';
import { TalksService } from './services/talks.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateMessageBody, RemoveMessageData, TalkData } from '../models/talk';
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
  @ApiOperation({ summary: 'Find all talks' })
  findAll(@Query() query: TalkListQueryExtended): Observable<Talk[]> {
    return from(this.talksService.findWithParams(query));
  }

  @Get('/public')
  @ApiOperation({ summary: 'Find all public talks' })
  findAllPublic(@Query() query: TalkListQuery): Observable<Talk[]> {
    return from(
      this.talksService.findWithParams({ ...query, type: TalkType.public }),
    );
  }

  @Get(':talkId')
  @ApiOperation({ summary: 'Get talk by ID' })
  getTalk(@Param('talkId') talkId: string): Observable<Talk> {
    return from(this.talksService.findOne(talkId));
  }

  @Post('')
  @ApiOperation({ summary: 'Create talk' })
  async createTalk(@Body() talk: TalkData, @Req() request) {
    const userId = request.user.id;
    return this.userTalksService.createWithUser(talk, userId);
  }

  @Delete(':talkId')
  @ApiOperation({
    summary: `Remove talk. Talk will be removed if this is private talk or deleted by admin.
      Otherwise user will be only removed from talk`,
  })
  async removeTalk(@Param('talkId') talkId: string, @Req() request) {
    const talk = await this.talksService.findOne(talkId);
    const userId = request.user.id;
    if (talk.type === TalkType.private) {
      return this.talksService.delete(talkId);
    }
    const userInTalk = await this.talksService.getUserInTalk(talkId, userId);
    if (userInTalk && userInTalk.status === UserStatus.admin) {
      return this.talksService.delete(talkId);
    }
    return this.userTalksService.removeUserFromTalk(talkId, userId);
  }

  @Post('conversation/:opponentId')
  @ApiOperation({
    summary: `Create conversation with user`,
  })
  async createConversation(
    @Param('opponentId') opponentId: string,
    @Req() request,
  ) {
    const userId = request.user.id;
    return this.userTalksService.createConversation(userId, opponentId);
  }

  @Get('conversation/:opponentId')
  @ApiOperation({
    summary: `Get conversation with user`,
  })
  getConversation(
    @Param('opponentId') opponentId: string,
    @Req() request,
  ): Observable<ObservedValueOf<Promise<UserTalk | null>>> {
    const userId = request.user.id;
    return from(this.talksService.getUserConversation(userId, opponentId));
  }

  @Post(':talkId/user')
  @ApiOperation({
    summary: `Add user to talk`,
  })
  async addUserToTalk(@Param('talkId') talkId: string, @Req() request) {
    const userId = request.user.id;
    await this.userTalksService.addUserToTalk(talkId, {
      userId,
      status: UserStatus.user,
    });
    return from(this.talksService.findOne(talkId));
  }

  @Delete(':talkId/user/:userId')
  @ApiOperation({
    summary: `Remove user from talk`,
  })
  async removeUserFromTalk(
    @Param('talkId') talkId: string,
    @Param('userId') userId: string,
  ) {
    return this.userTalksService.removeUserFromTalk(talkId, userId);
  }

  @Get('user/talks')
  @ApiOperation({
    summary: `Get current user talks`,
  })
  getUserTalks(@Req() request): Observable<UserTalk[]> {
    return from(this.talksService.getUserTalks(request.user.id));
  }

  @Get(':talkId/user/:userId')
  @ApiOperation({
    summary: `Check if user in talk and get user status in talk`,
  })
  getTalkUser(
    @Param('talkId') talkId: string,
    @Param('userId') userId: string,
  ): Observable<ObservedValueOf<Promise<UserTalk | null>>> {
    return from(this.talksService.getUserInTalk(talkId, userId));
  }

  @Get(':talkId/messages')
  @ApiOperation({
    summary: `Get talk messages`,
  })
  getTalkMessages(
    @Param('talkId') talkId: string,
    @Req() request,
  ): Observable<Talk> {
    return from(this.messagesService.getTalkMessages({ talkId }));
  }

  @Post(':talkId/messages')
  @ApiOperation({
    summary: `Add message to talk`,
  })
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
  @ApiOperation({
    summary: `Remove message from talk`,
  })
  async removeMessageFromTalk(
    @Param('talkId') talkId: string,
    @Req() request,
    @Body() body: RemoveMessageData,
  ) {
    const userId = request.user.id;
    return this.messagesService.removeMessage(userId, body);
  }
}
