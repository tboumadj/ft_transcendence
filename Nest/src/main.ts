import { config } from 'dotenv';
config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import CrossOriginResourcePolicyMiddleware from 'cross-origin-resource-policy';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import * as passport from 'passport';
import * as express from 'express';
import * as session from 'express-session';
import { MulterModule } from '@nestjs/platform-express';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cors from 'cors';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // app.use(cors({
  //   credentials: true,
  // }));
  // app.use((req, res, next) => {
  //   res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  //   next();
 // });
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: [
      // "http://"+ process.env.LOCAL_HOST,
      // "http://"+ process.env.LOCAL_HOST + ":3000/",
      // "http://"+ process.env.LOCAL_HOST + ":8080",
      // "http://"+ process.env.LOCAL_HOST + ":8081",
      // "http://"+ process.env.LOCAL_HOST + ":9000",
      "http://"+ process.env.LOCAL_IP,
      "http://"+ process.env.LOCAL_IP + ":3000/",
      "http://"+ process.env.LOCAL_IP + ":8080",
      "http://"+ process.env.LOCAL_IP + ":8081",
      "http://"+ process.env.LOCAL_IP + ":9000",
      // "http://localhost/",
      // "http://localhost:3000/",
      // "http://localhost:9000",
      // "http://localhost:8080",
      // "http://localhost:8081",
      "https://api.intra.42.fr/",
      "https://signin.intra.42.fr/",
    ],
    // origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
    app.useStaticAssets(join(__dirname, '../uploadAvatar',), { 
    prefix: '/api/uploadAvatar',
  });
  //app.useStaticAssets('app/uploadAvatar/', {prefix: 'api/uploadAvatar/'});
  // app.use(MulterModule.register({
  //   dest: './uploadAvatar',
  // }));
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.use(express.json());
  app.use(session({ 
    name: 'connect.sid',
    secret: 'boumboum',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',}, 
    }));
  app.use(passport.initialize());
  app.use(passport.session());
  //app.use(helmet());
  await app.listen(3000);
}
bootstrap();
