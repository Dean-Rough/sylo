import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Query,
  Param,
  UseGuards,
  Req,
  UnauthorizedException,
  Logger,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GoogleService } from './google.service';
import { Request } from 'express';
import { CreateCalendarEventDto } from './dto/create-calendar-event.dto';
import { UpdateCalendarEventDto } from './dto/update-calendar-event.dto';
import { ScheduleMeetingDto } from './dto/schedule-meeting.dto';
import { ShareFileDto } from './dto/share-file.dto';
import { CreateFolderDto } from './dto/create-folder.dto';
import { ExchangeCodeDto } from './dto/exchange-code.dto';

@Controller('google')
export class GoogleController {
  private readonly logger = new Logger(GoogleController.name);

  constructor(private readonly googleService: GoogleService) {}

  @Post('auth/exchange-code')
  async exchangeCode(@Body() exchangeCodeDto: ExchangeCodeDto) {
    try {
      const { code, redirectUri } = exchangeCodeDto;
      return await this.googleService.exchangeCodeForTokens(code, redirectUri);
    } catch (error) {
      this.logger.error(`Error exchanging code: ${error.message}`);
      throw error;
    }
  }

  @Post('auth/refresh-token')
  async refreshToken(@Body() body: { refreshToken: string }) {
    try {
      return await this.googleService.refreshAccessToken(body.refreshToken);
    } catch (error) {
      this.logger.error(`Error refreshing token: ${error.message}`);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('calendar/events')
  async getCalendarEvents(
    @Req() req: Request,
    @Query('timeMin') timeMin: string,
    @Query('timeMax') timeMax: string,
    @Query('maxResults') maxResults: number,
  ) {
    try {
      const accessToken = this.extractAccessToken(req);
      return await this.googleService.getCalendarEvents(accessToken, timeMin, timeMax, maxResults);
    } catch (error) {
      this.logger.error(`Error getting calendar events: ${error.message}`);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('calendar/events')
  async createCalendarEvent(@Req() req: Request, @Body() createEventDto: CreateCalendarEventDto) {
    try {
      const accessToken = this.extractAccessToken(req);
      return await this.googleService.createCalendarEvent(accessToken, createEventDto);
    } catch (error) {
      this.logger.error(`Error creating calendar event: ${error.message}`);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('calendar/events/:eventId')
  async getCalendarEvent(@Req() req: Request, @Param('eventId') eventId: string) {
    try {
      const accessToken = this.extractAccessToken(req);
      return await this.googleService.getCalendarEvent(accessToken, eventId);
    } catch (error) {
      this.logger.error(`Error getting calendar event: ${error.message}`);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch('calendar/events/:eventId')
  async updateCalendarEvent(
    @Req() req: Request,
    @Param('eventId') eventId: string,
    @Body() updateEventDto: UpdateCalendarEventDto
  ) {
    try {
      const accessToken = this.extractAccessToken(req);
      return await this.googleService.updateCalendarEvent(accessToken, eventId, updateEventDto);
    } catch (error) {
      this.logger.error(`Error updating calendar event: ${error.message}`);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('calendar/events/:eventId')
  async deleteCalendarEvent(@Req() req: Request, @Param('eventId') eventId: string) {
    try {
      const accessToken = this.extractAccessToken(req);
      await this.googleService.deleteCalendarEvent(accessToken, eventId);
      return { success: true, message: 'Calendar event deleted successfully' };
    } catch (error) {
      this.logger.error(`Error deleting calendar event: ${error.message}`);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('calendar/meetings')
  async scheduleMeeting(@Req() req: Request, @Body() scheduleMeetingDto: ScheduleMeetingDto) {
    try {
      const accessToken = this.extractAccessToken(req);
      return await this.googleService.scheduleMeeting(accessToken, scheduleMeetingDto);
    } catch (error) {
      this.logger.error(`Error scheduling meeting: ${error.message}`);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('drive/files')
  async listDriveFiles(
    @Req() req: Request,
    @Query('pageSize') pageSize: number,
    @Query('folderId') folderId?: string,
    @Query('query') query?: string
  ) {
    try {
      const accessToken = this.extractAccessToken(req);
      return await this.googleService.listDriveFiles(accessToken, pageSize, folderId, query);
    } catch (error) {
      this.logger.error(`Error listing drive files: ${error.message}`);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('drive/files/:fileId')
  async getDriveFileMetadata(@Req() req: Request, @Param('fileId') fileId: string) {
    try {
      const accessToken = this.extractAccessToken(req);
      return await this.googleService.getDriveFileMetadata(accessToken, fileId);
    } catch (error) {
      this.logger.error(`Error getting drive file metadata: ${error.message}`);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('drive/files/:fileId/download')
  async downloadDriveFile(@Req() req: Request, @Param('fileId') fileId: string) {
    try {
      const accessToken = this.extractAccessToken(req);
      return await this.googleService.downloadDriveFile(accessToken, fileId);
    } catch (error) {
      this.logger.error(`Error downloading drive file: ${error.message}`);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('drive/files/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadDriveFile(
    @Req() req: Request,
    @UploadedFile() file: any,
    @Body() metadata: { name: string; mimeType?: string; folderId?: string }
  ) {
    try {
      const accessToken = this.extractAccessToken(req);
      return await this.googleService.uploadDriveFile(accessToken, file, metadata);
    } catch (error) {
      this.logger.error(`Error uploading drive file: ${error.message}`);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('drive/files/:fileId/share')
  async shareDriveFile(
    @Req() req: Request,
    @Param('fileId') fileId: string,
    @Body() shareFileDto: ShareFileDto
  ) {
    try {
      const accessToken = this.extractAccessToken(req);
      return await this.googleService.shareDriveFile(
        accessToken,
        fileId,
        shareFileDto.emailAddress,
        shareFileDto.role
      );
    } catch (error) {
      this.logger.error(`Error sharing drive file: ${error.message}`);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('drive/folders')
  async createDriveFolder(
    @Req() req: Request,
    @Body() createFolderDto: CreateFolderDto
  ) {
    try {
      const accessToken = this.extractAccessToken(req);
      return await this.googleService.createDriveFolder(
        accessToken,
        createFolderDto.name,
        createFolderDto.parentFolderId
      );
    } catch (error) {
      this.logger.error(`Error creating drive folder: ${error.message}`);
      throw error;
    }
  }

  private extractAccessToken(req: Request): string {
    // This assumes the access token is passed in the request headers or body
    // Adjust according to your actual token storage/retrieval strategy
    const accessToken = req.headers['x-google-access-token'] as string;
    
    if (!accessToken) {
      throw new UnauthorizedException('Google access token not provided');
    }
    
    return accessToken;
  }
}