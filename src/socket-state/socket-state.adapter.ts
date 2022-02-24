// import { IoAdapter } from '@nestjs/platform-socket.io';
// import { ServerOptions } from 'socket.io';
// import { createAdapter } from '@socket.io/redis-adapter';
// import { createClient } from 'redis';
//
// export class RedisIoAdapter extends IoAdapter {
//   private adapterConstructor: ReturnType<typeof createAdapter>;
//
//   async connectToRedis(): Promise<void> {
//     const pubClient = createClient({ url: `redis://localhost:6379` });
//     const subClient = pubClient.duplicate();
//
//     await Promise.all([pubClient.connect(), subClient.connect()]);
//
//     this.adapterConstructor = createAdapter(pubClient, subClient);
//   }
//
//   createIOServer(port: number, options?: ServerOptions): any {
//     const server = super.createIOServer(port, options);
//     server.adapter(this.adapterConstructor);
//     return server;
//   }
// }

import { INestApplicationContext, WebSocketAdapter } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import socketio from 'socket.io';

import { RedisPropagatorService } from '../redis-propagator/redis-propagator.service';

import { SocketStateService } from './socket-state.service';

interface TokenPayload {
  readonly userId: string;
}

export interface AuthenticatedSocket extends socketio.Socket {
  auth: TokenPayload;
}

export class SocketStateAdapter extends IoAdapter implements WebSocketAdapter {
  public constructor(
    private readonly app: INestApplicationContext,
    private readonly socketStateService: SocketStateService,
    private readonly redisPropagatorService: RedisPropagatorService,
  ) {
    super(app);
  }

  public create(
    port: number,
    options: socketio.ServerOptions,
  ): socketio.Server {
    const server = super.createIOServer(port, options);
    this.redisPropagatorService.injectSocketServer(server);

    server.use(async (socket: AuthenticatedSocket, next) => {
      const token =
        socket.handshake.query?.token ||
        socket.handshake.headers?.authorization;

      if (!token) {
        socket.auth = null;

        // not authenticated connection is still valid
        // thus no error
        return next();
      }

      try {
        // fake auth
        socket.auth = {
          userId: '1234',
        };

        return next();
      } catch (e) {
        return next(e);
      }
    });

    return server;
  }

  public bindClientConnect(server: socketio.Server, callback): void {
    server.on('connection', (socket: AuthenticatedSocket) => {
      if (socket.auth) {
        this.socketStateService.add(socket.auth.userId, socket);

        socket.on('disconnect', () => {
          this.socketStateService.remove(socket.auth.userId, socket);

          socket.removeAllListeners('disconnect');
        });
      }

      callback(socket);
    });
  }
}
