// import { INestApplication } from '@nestjs/common';
// import { SocketStateService } from './socket-state/socket-state.service';
// import { RedisPropagatorService } from './redis-propagator/redis-propagator.service';
// import { SocketStateAdapter } from './socket-state/socket-state.adapter';
//
// export const initAdapters = (app: INestApplication): INestApplication => {
//   const socketStateService = app.get(SocketStateService);
//   const redisPropagatorService = app.get(RedisPropagatorService);
//
//   app.useWebSocketAdapter(
//     new SocketStateAdapter(app, socketStateService, redisPropagatorService),
//   );
//
//   return app;
// };
