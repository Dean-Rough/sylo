export interface ServerConfig {
  port: number;
  host: string;
  corsOrigins: string[];
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  serviceRoleKey: string;
}

export interface JwtConfig {
  secret: string;
  expiration: string;
}

export interface AiChatCoreConfig {
  url: string;
}

export interface GoogleApiConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string[];
}

export interface LoggingConfig {
  level: 'error' | 'warn' | 'info' | 'debug';
}

export interface RateLimitConfig {
  window: string;
  max: number;
}

export interface CacheConfig {
  ttl: number;
}

export interface AppConfig {
  nodeEnv: string;
  server: ServerConfig;
  supabase: SupabaseConfig;
  jwt: JwtConfig;
  aiChatCore: AiChatCoreConfig;
  googleApi: GoogleApiConfig;
  logging?: LoggingConfig;
  rateLimit?: RateLimitConfig;
  cache?: CacheConfig;
}