import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule } from '@nestjs/config'; // Import ConfigModule

@Module({
  imports: [
    ConfigModule, // Add ConfigModule here so ConfigService is available
    PassportModule,
    JwtModule.register({}), // Register JwtModule, options can be empty if not signing tokens here
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, PassportModule], // Export AuthService and PassportModule for guards
})
export class AuthModule {}
