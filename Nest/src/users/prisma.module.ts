import { MiddlewareConsumer, NestModule, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { PrismaService } from './prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { UsersController, UpdatePController } from './users.controller';
import { UsersService } from './users.service';
import { ProfileService } from 'src/auth/profile.service';
import { AuthMiddleware } from 'src/auth/jwt-auth.guard';
import { TwofMiddleware } from 'src/auth/twof-auth.guard';


@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'boumboum',
      signOptions: { expiresIn: '1h' },
    }),
    PrismaModule,
  ],
  providers: [AuthService, PrismaService, ProfileService, UsersService, TwofMiddleware, AuthMiddleware, JwtStrategy],
  exports: [PrismaService],
  controllers: [UsersController, UpdatePController],
})
export class PrismaModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('update');
  }
}
