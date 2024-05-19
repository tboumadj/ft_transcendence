// auth.module.ts
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { AuthController, JwtController, ProfileController } from './auth.controller';
import { PrismaModule } from '../users/prisma.module';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthMiddleware } from './jwt-auth.guard';
import { TwofMiddleware } from './twof-auth.guard';
import { ProfileService } from './profile.service';
import { UsersService } from 'src/users/users.service';
//import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'boumboum',
      signOptions: { expiresIn: '1h' },
    }),
    PrismaModule,
  ],
  controllers: [AuthController, JwtController, ProfileController],
  providers: [AuthService, UsersService, ProfileService, LocalAuthGuard, AuthMiddleware, TwofMiddleware, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('auth/profile');
    consumer.apply(AuthMiddleware).forRoutes('auth/checkJWT');
    //consumer.apply(TwofMiddleware).forRoutes('auth/login');
  }
}
