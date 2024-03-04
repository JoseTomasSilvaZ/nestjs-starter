import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ZodPipe } from 'src/pipes/zod.pipe';
import { SignInDto, signInSchema } from './dto/sign-in.dto';
import { SignUpDto, signUpSchema } from './dto/sign-up.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @UsePipes(new ZodPipe(signInSchema))
  @Post('sign-in')
  async signIn(@Body() signInData: SignInDto) {
    return this.authService.signIn(signInData);
  }
  @UsePipes(new ZodPipe(signUpSchema))
  @Post('sign-up')
  async signUp(@Body() signUpData: SignUpDto) {
    return this.authService.signUp(signUpData);
  }
}
