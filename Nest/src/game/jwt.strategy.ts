import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'boumboum',
    });
  }

async validate(payload: any) {
    try {
    console.log('vali/JWT payload: ', payload);

    return payload;
  } catch (error) {
    console.error('Erreur lors de la validation du JWT :', error);
    throw new UnauthorizedException('Invalid token');
  }
}
}
