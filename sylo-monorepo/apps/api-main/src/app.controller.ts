import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';

// Define an interface for the user object attached to the request
// This should match the return type of JwtStrategy.validate()
interface AuthenticatedUser {
  userId: string;
  email?: string;
  role?: string;
}

// Define a type for the request object that includes the typed user
interface RequestWithUser extends Request {
  user: AuthenticatedUser;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req: RequestWithUser) {
    // req.user is now typed
    return { message: 'This is a protected route', user: req.user };
  }
}
