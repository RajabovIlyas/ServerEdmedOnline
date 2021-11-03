import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';
import { ConfigService } from '@nestjs/config';
import { TokenService } from '../token/token.service';
import { SocialNetworkDto } from './dto/auth.dto';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
  ) {
    super({
      clientID: configService.get<string>('CLIENT_ID_FB'),
      clientSecret: configService.get<string>('CLIENT_SECRET_FB'),
      callbackURL:
        configService.get<string>('SERVER_URL') + '/api/auth/facebook/callback',
      scope: 'email',
      profileFields: ['id', 'email', 'name', 'picture.type(large)'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: any, user: any, info?: any) => void,
  ): Promise<any> {
    const { name, emails, photos } = profile;
    const user: SocialNetworkDto = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
    };

    done(null, user);
  }
}
