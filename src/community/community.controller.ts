import {
  Body,
  Controller, Delete, Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CommunityService } from './community.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateCommunityDto } from './dto/create.community.dto';

@ApiTags('Сообщество')
@Controller('community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createCourse(@Request() req, @Body() body: CreateCommunityDto) {
    const data = new CreateCommunityDto({ ...body, creator: req.userId });
    return this.communityService.create(data);
  }



  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.communityService.getById(id);
  }
}
