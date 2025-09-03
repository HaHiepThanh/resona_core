import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  UseInterceptors,
  UploadedFile, BadRequestException,
} from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { PlaylistTrackDto, CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdateThumbnailDto, UpdateTitleDto } from './dto/update-playlist.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { uuid } from '@supabase/supabase-js/dist/main/lib/helpers';
import { supabase } from '../../utils/supbabase';

@Controller('playlist')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @Post('create/:userId')
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Param('userId') userId: string,
    @Body() createPlaylistDto: CreatePlaylistDto,
    @UploadedFile() thumbnail: Express.Multer.File,
  ) {
    return this.playlistService.createPlaylist(
      createPlaylistDto,
      userId,
      thumbnail,
    );
  }


  @Post('add-track')
  addTrack(@Body() trackDto: PlaylistTrackDto) {
    const { playlistId, trackId } = trackDto;
    return this.playlistService.addTrackToPlaylist(playlistId, trackId);
  }

  @Post('favorite/:userId/:songId')
  addToFavorite(
    @Param('userId') userId: string,
    @Param('songId') songId: string,
  ) {
    return this.playlistService.addToFavorite(songId, userId);
  }

  @Get(':userId')
  getUserPlaylists(@Param('userId') userId: string) {
    return this.playlistService.getFavoritePlaylistByUserId(userId);
  }

  @Get('search')
  searchPlaylists(@Query('search') query: string) {
    return this.playlistService.searchPlaylists(query);
  }

  @Delete('delete')
  delete(@Param('id') id: string) {
    return this.playlistService.deletePlaylist(id);
  }

  @Delete('remove-track')
  removeTrack(@Body() deleteTrackDto: PlaylistTrackDto) {
    const { playlistId, trackId } = deleteTrackDto;
    return this.playlistService.removeTrackFromPlaylist(playlistId, trackId);
  }

  @Put('update-title')
  updateTitle(
    @Query()
    params: UpdateTitleDto,
  ) {
    return this.playlistService.updatePlaylistTitle(params);
  }

  @Put('update-thumbnail')
  @UseInterceptors(FileInterceptor('file'))
  updateThumbnail(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UpdateThumbnailDto,
  ) {
    return this.playlistService.updatePlaylistThumbnailWithFile(
      body.playlistId,
      file,
    );
  }

  @Get('all-tracks/:id')
  async getTracks(@Param('id') id: string) {
    return this.playlistService.getPlaylistTracksWithDetails(id);
  }

  @Get('all-playlists/:uid')
  async getPlaylist(@Param('uid') uid: string) {
    return this.playlistService.getAllPlaylistsByUser(uid);
  }
}
