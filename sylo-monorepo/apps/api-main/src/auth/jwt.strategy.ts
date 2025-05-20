import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { passportJwtSecret, ExpressJwtOptions } from 'jwks-rsa';

interface JwtPayload {
  sub: string;
  email?: string;
  role?: string;
  // Add other properties from your Supabase JWT payload if needed
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    const supabaseUrl = configService.get<string>('SUPABASE_URL');
    if (!supabaseUrl) {
      throw new Error('SUPABASE_URL is not configured.');
    }

    // Explicitly type the options for jwks-rsa
    const jwksOptions: ExpressJwtOptions = {
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `${supabaseUrl}/auth/v1/.well-known/jwks.json`,
    };

    // Explicitly type the options for passport-jwt Strategy
    const strategyOptions: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKeyProvider: passportJwtSecret(jwksOptions),
      ignoreExpiration: false, // Default is false, explicitly set for clarity
    };

    super(strategyOptions);
  }

  // The validate method can be async if you need to perform async operations (e.g., DB lookup)
  // For now, it's synchronous as we are just returning parts of the payload.
  validate(payload: JwtPayload): {
    userId: string;
    email?: string;
    role?: string;
  } {
    // The payload is already validated by passport-jwt based on the JWKS.
    // This method is for extracting user information or performing further checks.
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}