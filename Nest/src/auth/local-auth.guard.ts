// local-auth.guard.ts
import { Injectable, UnauthorizedException, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  canActivate(context: ExecutionContext) {
    //console.log('LocalAuthGuard - Checking authentication...');
    //console.log('context: ', context);
    //const httpContext = context.switchToHttp();
    //const request = httpContext.getRequest();
    //const response = httpContext.getResponse();
    //const method = context.getHandler();

    //console.log('Request Object:', request);
    //console.log('Response Object:', response);
    //console.log('Handler Method:', method);
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    //console.log('User is:', user);
    //console.log('Err is:', err);
    //console.log('LocalAuthGuard - Authentication result:', user, info);

    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
