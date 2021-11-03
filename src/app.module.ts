import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { TokenModule } from './token/token.module';
import { configModule } from './configure.root';
import { FileModule } from './file/file.module';
import { MailModule } from './mail/mail.module';
import { CourseModule } from './course/course.module';
import { MorganModule } from 'nest-morgan';
import { CommunityModule } from './community/community.module';
import { ChatModule } from './chat/chat.module';
import { PostModule } from './post/post.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URL_V2, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    configModule,
    UserModule,
    AuthModule,
    TokenModule,
    FileModule,
    MailModule,
    CourseModule,
    MorganModule,
    CommunityModule,
    ChatModule,
    PostModule,
  ],
})
export class AppModule {}
