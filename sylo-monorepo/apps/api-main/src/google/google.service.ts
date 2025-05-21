import { Injectable, Logger, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, map } from 'rxjs';
import { AxiosError } from 'axios';
import { createReadStream } from 'fs';
import { GoogleCalendarEvent } from './interfaces/google-calendar.interface';
import { GoogleDriveFile } from './interfaces/google-drive.interface';
import * as FormData from 'form-data';
import * as multer from 'multer';

@Injectable()
export class GoogleService {
  private readonly logger = new Logger(GoogleService.name);
  private readonly tokenEndpoint = 'https://oauth2.googleapis.com/token';
  private readonly apiBaseUrl = 'https://www.googleapis.com';

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  /**
   * Exchange authorization code for access and refresh tokens
   */
  async exchangeCodeForTokens(code: string, redirectUri: string) {
    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    const clientSecret = this.configService.get<string>('GOOGLE_CLIENT_SECRET');

    if (!clientId || !clientSecret) {
      throw new Error('Google OAuth credentials not configured');
    }

    try {
      const { data } = await firstValueFrom(
        this.httpService
          .post(this.tokenEndpoint, {
            code,
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: redirectUri,
            grant_type: 'authorization_code',
          })
          .pipe(
            catchError((error: AxiosError) => {
              this.logger.error(`Failed to exchange code for tokens: ${error.message}`);
              throw new UnauthorizedException('Failed to authenticate with Google');
            }),
          ),
      );

      return {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresIn: data.expires_in,
        tokenType: data.token_type,
        idToken: data.id_token,
      };
    } catch (error) {
      this.logger.error(`Error exchanging code for tokens: ${error.message}`);
      throw error;
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(refreshToken: string) {
    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    const clientSecret = this.configService.get<string>('GOOGLE_CLIENT_SECRET');

    try {
      const { data } = await firstValueFrom(
        this.httpService
          .post(this.tokenEndpoint, {
            refresh_token: refreshToken,
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: 'refresh_token',
          })
          .pipe(
            catchError((error: AxiosError) => {
              this.logger.error(`Failed to refresh token: ${error.message}`);
              throw new UnauthorizedException('Failed to refresh Google authentication');
            }),
          ),
      );

      return {
        accessToken: data.access_token,
        expiresIn: data.expires_in,
        tokenType: data.token_type,
        idToken: data.id_token,
      };
    } catch (error) {
      this.logger.error(`Error refreshing access token: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get user's calendar events
   */
  async getCalendarEvents(accessToken: string, timeMin: string, timeMax: string, maxResults = 10) {
    try {
      const { data } = await firstValueFrom(
        this.httpService
          .get(`${this.apiBaseUrl}/calendar/v3/calendars/primary/events`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            params: {
              timeMin,
              timeMax,
              maxResults,
              singleEvents: true,
              orderBy: 'startTime',
            },
          })
          .pipe(
            catchError((error: AxiosError) => {
              this.logger.error(`Failed to fetch calendar events: ${error.message}`);
              throw new UnauthorizedException('Failed to access Google Calendar');
            }),
          ),
      );

      return data;
    } catch (error) {
      this.logger.error(`Error fetching calendar events: ${error.message}`);
      throw error;
    }
  }

  /**
   * Create a calendar event
   */
  async createCalendarEvent(accessToken: string, eventData: any): Promise<GoogleCalendarEvent> {
    try {
      const { data } = await firstValueFrom(
        this.httpService
          .post(`${this.apiBaseUrl}/calendar/v3/calendars/primary/events`, eventData, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          })
          .pipe(
            catchError((error: AxiosError) => {
              this.logger.error(`Failed to create calendar event: ${error.message}`);
              throw new UnauthorizedException('Failed to create Google Calendar event');
            }),
          ),
      );

      return data;
    } catch (error) {
      this.logger.error(`Error creating calendar event: ${error.message}`);
      throw error;
    }
  }

  /**
   * Update a calendar event
   */
  async updateCalendarEvent(accessToken: string, eventId: string, eventData: any): Promise<GoogleCalendarEvent> {
    try {
      const { data } = await firstValueFrom(
        this.httpService
          .patch(`${this.apiBaseUrl}/calendar/v3/calendars/primary/events/${eventId}`, eventData, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          })
          .pipe(
            catchError((error: AxiosError) => {
              this.logger.error(`Failed to update calendar event: ${error.message}`);
              throw new UnauthorizedException('Failed to update Google Calendar event');
            }),
          ),
      );

      return data;
    } catch (error) {
      this.logger.error(`Error updating calendar event: ${error.message}`);
      throw error;
    }
  }

  /**
   * Delete a calendar event
   */
  async deleteCalendarEvent(accessToken: string, eventId: string): Promise<void> {
    try {
      await firstValueFrom(
        this.httpService
          .delete(`${this.apiBaseUrl}/calendar/v3/calendars/primary/events/${eventId}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .pipe(
            catchError((error: AxiosError) => {
              this.logger.error(`Failed to delete calendar event: ${error.message}`);
              throw new UnauthorizedException('Failed to delete Google Calendar event');
            }),
          ),
      );
    } catch (error) {
      this.logger.error(`Error deleting calendar event: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get a specific calendar event
   */
  async getCalendarEvent(accessToken: string, eventId: string): Promise<GoogleCalendarEvent> {
    try {
      const { data } = await firstValueFrom(
        this.httpService
          .get(`${this.apiBaseUrl}/calendar/v3/calendars/primary/events/${eventId}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .pipe(
            catchError((error: AxiosError) => {
              this.logger.error(`Failed to get calendar event: ${error.message}`);
              throw new UnauthorizedException('Failed to access Google Calendar event');
            }),
          ),
      );

      return data;
    } catch (error) {
      this.logger.error(`Error getting calendar event: ${error.message}`);
      throw error;
    }
  }

  /**
   * List files from Google Drive
   */
  async listDriveFiles(accessToken: string, pageSize = 10, folderId?: string, query?: string) {
    try {
      let params: any = {
        pageSize,
        fields: 'files(id, name, mimeType, webViewLink, createdTime, modifiedTime, size, thumbnailLink, parents)',
      };

      // Add folder filter if provided
      if (folderId) {
        params.q = `'${folderId}' in parents`;
      }

      // Add custom query if provided
      if (query) {
        params.q = params.q ? `${params.q} and ${query}` : query;
      }

      const { data } = await firstValueFrom(
        this.httpService
          .get(`${this.apiBaseUrl}/drive/v3/files`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            params,
          })
          .pipe(
            catchError((error: AxiosError) => {
              this.logger.error(`Failed to list Drive files: ${error.message}`);
              throw new UnauthorizedException('Failed to access Google Drive');
            }),
          ),
      );

      return data;
    } catch (error) {
      this.logger.error(`Error listing Drive files: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get file metadata from Google Drive
   */
  async getDriveFileMetadata(accessToken: string, fileId: string) {
    try {
      const { data } = await firstValueFrom(
        this.httpService
          .get(`${this.apiBaseUrl}/drive/v3/files/${fileId}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            params: {
              fields: 'id, name, mimeType, webViewLink, createdTime, modifiedTime, size, thumbnailLink, parents, capabilities',
            },
          })
          .pipe(
            catchError((error: AxiosError) => {
              this.logger.error(`Failed to get Drive file metadata: ${error.message}`);
              throw new UnauthorizedException('Failed to access Google Drive file');
            }),
          ),
      );

      return data;
    } catch (error) {
      this.logger.error(`Error getting Drive file metadata: ${error.message}`);
      throw error;
    }
  }

  /**
   * Download a file from Google Drive
   */
  async downloadDriveFile(accessToken: string, fileId: string) {
    try {
      const { data } = await firstValueFrom(
        this.httpService
          .get(`${this.apiBaseUrl}/drive/v3/files/${fileId}?alt=media`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            responseType: 'arraybuffer',
          })
          .pipe(
            catchError((error: AxiosError) => {
              this.logger.error(`Failed to download Drive file: ${error.message}`);
              throw new UnauthorizedException('Failed to download Google Drive file');
            }),
          ),
      );

      return data;
    } catch (error) {
      this.logger.error(`Error downloading Drive file: ${error.message}`);
      throw error;
    }
  }

  /**
   * Upload a file to Google Drive
   */
  async uploadDriveFile(accessToken: string, file: {
    buffer: Buffer;
    mimetype: string;
    originalname: string;
    size: number
  }, metadata: { name: string; mimeType?: string; folderId?: string }) {
    try {
      const formData = new FormData();
      
      // Add metadata
      const metadataObj: any = {
        name: metadata.name,
      };
      
      if (metadata.folderId) {
        metadataObj.parents = [metadata.folderId];
      }
      
      formData.append('metadata', JSON.stringify(metadataObj), {
        contentType: 'application/json',
      });
      
      // Add file content
      formData.append('file', file.buffer, {
        filename: metadata.name,
        contentType: metadata.mimeType || file.mimetype,
      });

      const { data } = await firstValueFrom(
        this.httpService
          .post(`${this.apiBaseUrl}/upload/drive/v3/files?uploadType=multipart`, formData, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              ...formData.getHeaders(),
            },
          })
          .pipe(
            catchError((error: AxiosError) => {
              this.logger.error(`Failed to upload Drive file: ${error.message}`);
              throw new UnauthorizedException('Failed to upload file to Google Drive');
            }),
          ),
      );

      return data;
    } catch (error) {
      this.logger.error(`Error uploading Drive file: ${error.message}`);
      throw error;
    }
  }

  /**
   * Share a Google Drive file
   */
  async shareDriveFile(accessToken: string, fileId: string, emailAddress: string, role: 'reader' | 'commenter' | 'writer' | 'fileOrganizer' | 'organizer' | 'owner') {
    try {
      const permission = {
        type: 'user',
        role,
        emailAddress,
      };

      const { data } = await firstValueFrom(
        this.httpService
          .post(`${this.apiBaseUrl}/drive/v3/files/${fileId}/permissions`, permission, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            params: {
              sendNotificationEmail: true,
            },
          })
          .pipe(
            catchError((error: AxiosError) => {
              this.logger.error(`Failed to share Drive file: ${error.message}`);
              throw new UnauthorizedException('Failed to share Google Drive file');
            }),
          ),
      );

      return data;
    } catch (error) {
      this.logger.error(`Error sharing Drive file: ${error.message}`);
      throw error;
    }
  }

  /**
   * Create a folder in Google Drive
   */
  async createDriveFolder(accessToken: string, folderName: string, parentFolderId?: string) {
    try {
      const metadata: any = {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
      };

      if (parentFolderId) {
        metadata.parents = [parentFolderId];
      }

      const { data } = await firstValueFrom(
        this.httpService
          .post(`${this.apiBaseUrl}/drive/v3/files`, metadata, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          })
          .pipe(
            catchError((error: AxiosError) => {
              this.logger.error(`Failed to create Drive folder: ${error.message}`);
              throw new UnauthorizedException('Failed to create Google Drive folder');
            }),
          ),
      );

      return data;
    } catch (error) {
      this.logger.error(`Error creating Drive folder: ${error.message}`);
      throw error;
    }
  }

  /**
   * Schedule a meeting with automatic calendar event creation
   */
  async scheduleMeeting(
    accessToken: string,
    meetingData: {
      summary: string;
      description?: string;
      location?: string;
      startDateTime: string;
      endDateTime: string;
      attendees: { email: string; displayName?: string }[];
      conferenceData?: boolean;
    }
  ): Promise<GoogleCalendarEvent> {
    try {
      const eventData: any = {
        summary: meetingData.summary,
        description: meetingData.description,
        location: meetingData.location,
        start: {
          dateTime: meetingData.startDateTime,
          timeZone: 'UTC',
        },
        end: {
          dateTime: meetingData.endDateTime,
          timeZone: 'UTC',
        },
        attendees: meetingData.attendees,
        reminders: {
          useDefault: true,
        },
      };

      // Add Google Meet conference if requested
      if (meetingData.conferenceData) {
        eventData.conferenceData = {
          createRequest: {
            requestId: `meeting-${Date.now()}`,
            conferenceSolutionKey: {
              type: 'hangoutsMeet',
            },
          },
        };
      }

      const { data } = await firstValueFrom(
        this.httpService
          .post(`${this.apiBaseUrl}/calendar/v3/calendars/primary/events`, eventData, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            params: {
              conferenceDataVersion: meetingData.conferenceData ? 1 : 0,
              sendUpdates: 'all',
            },
          })
          .pipe(
            catchError((error: AxiosError) => {
              this.logger.error(`Failed to schedule meeting: ${error.message}`);
              throw new UnauthorizedException('Failed to schedule meeting');
            }),
          ),
      );

      return data;
    } catch (error) {
      this.logger.error(`Error scheduling meeting: ${error.message}`);
      throw error;
    }
  }
}