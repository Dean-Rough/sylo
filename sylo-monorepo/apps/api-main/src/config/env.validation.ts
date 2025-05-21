import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNumber, IsString, IsUrl, IsOptional, validateSync, IsBoolean, Min, Max, Matches } from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariables {
  // Node Environment
  @IsEnum(Environment)
  NODE_ENV: Environment;

  // Server Configuration
  @IsNumber()
  @Min(1)
  @Max(65535)
  PORT: number;

  @IsString()
  HOST: string;

  @IsString()
  CORS_ORIGINS: string;

  // Supabase Configuration
  @IsUrl()
  SUPABASE_URL: string;

  @IsString()
  SUPABASE_ANON_KEY: string;

  @IsString()
  SUPABASE_SERVICE_ROLE_KEY: string;

  // JWT Configuration
  @IsString()
  JWT_SECRET: string;

  @IsString()
  JWT_EXPIRATION: string;

  // AI Chat Core Service
  @IsUrl()
  AI_CHAT_CORE_URL: string;

  // Google API Configuration
  @IsString()
  GOOGLE_CLIENT_ID: string;

  @IsString()
  GOOGLE_CLIENT_SECRET: string;

  @IsString()
  GOOGLE_REDIRECT_URI: string;

  @IsString()
  GOOGLE_API_SCOPES: string;

  // Logging Configuration
  @IsOptional()
  @IsString()
  @IsEnum(['error', 'warn', 'info', 'debug'])
  LOG_LEVEL?: string;

  // Rate Limiting
  @IsOptional()
  @IsString()
  @Matches(/^\d+[smhd]$/, { message: 'Rate limit window must be in format: 10s, 5m, 1h, 1d' })
  RATE_LIMIT_WINDOW?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  RATE_LIMIT_MAX?: number;

  // Cache Configuration
  @IsOptional()
  @IsNumber()
  @Min(0)
  CACHE_TTL?: number;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(
    EnvironmentVariables,
    {
      ...config,
      PORT: config.PORT ? parseInt(config.PORT as string, 10) : undefined,
      RATE_LIMIT_MAX: config.RATE_LIMIT_MAX ? parseInt(config.RATE_LIMIT_MAX as string, 10) : undefined,
      CACHE_TTL: config.CACHE_TTL ? parseInt(config.CACHE_TTL as string, 10) : undefined,
    },
    { enableImplicitConversion: false },
  );
  
  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    console.error(errors.map(error => error.constraints ? Object.values(error.constraints).join(', ') : error.toString()).join('\n'));
    throw new Error(`Environment validation failed: ${errors.map(error => error.constraints ? Object.values(error.constraints).join(', ') : error.toString()).join(', ')}`);
  }
  
  return validatedConfig;
}