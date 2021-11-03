import { Module } from '@nestjs/common';
import { CommunityService } from './community.service';
import { CommunityController } from './community.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CommunitySchema } from './schemas/community.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Community', schema: CommunitySchema }]),
  ],
  providers: [CommunityService],
  controllers: [CommunityController],
  exports: [CommunityService],
})
export class CommunityModule {}
