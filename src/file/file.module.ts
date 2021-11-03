import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [AuthModule, UserModule],
  controllers: [FileController],
})
export class FileModule {}
