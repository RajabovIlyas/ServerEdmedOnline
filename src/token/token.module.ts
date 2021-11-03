import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenSchema } from './schemas/user-token.schema';
import { configModule } from '../configure.root';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Token', schema: TokenSchema }]),
    configModule,
  ],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
