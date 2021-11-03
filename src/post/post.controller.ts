import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreatePostDto } from './dto/create.post.dto';
import { ApiTags } from '@nestjs/swagger';
import { CommunityService } from '../community/community.service';
import { PostService } from './post.service';
import { CreateCommentDto } from './dto/create.comment.dto';

@ApiTags('Посты')
@Controller('post')
export class PostController {
  constructor(
    private readonly communityService: CommunityService,
    private readonly postService: PostService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Put('like/:id')
  async setLike(@Request() req, @Param('id') id: string) {
    return this.postService.setLike(req.userId, id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('add-comment/:id')
  async addComment(@Request() req, @Param('id') id: string) {
    const data = new CreateCommentDto({ ...req.body, sender: req.userId });
    return this.postService.addComment(id, data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('remove-comment/:id')
  async removeComment(@Request() req, @Param('id') id: string) {
    const { idComment } = req.body;
    const data = await this.postService.getById(id);
    await this.communityService.checkCreator(req.userId, data.createdCommunity);
    return this.postService.removeComment(id, idComment);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async addPost(@Request() req, @Body() body: CreatePostDto) {
    const { createdCommunity } = req.body;
    await this.communityService.checkCreator(req.userId, createdCommunity);
    const post = new CreatePostDto({ ...body, sender: req.userId });
    return this.postService.addPost(post);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async delete(@Request() req, @Param('id') id: string) {
    const { createdCommunity } = req.body;
    await this.communityService.checkCreator(req.userId, createdCommunity);
    return this.postService.deletePost(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('community/:id')
  async getByCommunity(@Request() req, @Param('id') id: string) {
    const { page = '1', max = '10' }: { page: string; max: string } = req.query;
    return this.postService.getPostByCommunity(
      id,
      req.userId,
      Number.parseInt(page),
      Number.parseInt(max),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('comment/:id')
  async getComment(@Request() req, @Param('id') id: string) {
    const { page = '1', max = '10' }: { page: string; max: string } = req.query;
    return this.postService.getComment(
      id,
      Number.parseInt(page),
      Number.parseInt(max),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('who-like/:id')
  async whoLike(@Request() req, @Param('id') id: string) {
    const { page = '1', max = '10' }: { page: string; max: string } = req.query;
    return this.postService.whoLike(
      id,
      Number.parseInt(page),
      Number.parseInt(max),
    );
  }
}
