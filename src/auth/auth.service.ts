import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Prisma } from '@prisma/client';
import { SignUpDto } from './dto/sign-up.dto';
@Injectable()
export class AuthService {
  constructor(
    private prisma: DatabaseService,
    private jwt: JwtService,
  ) {}
  async signIn(signInData: SignInDto) {
    try {
      const { hash, ...rest } = await this.prisma.user.findUniqueOrThrow({
        where: {
          email: signInData.email,
        },
      });

      if (!rest) {
        throw new Error('User not found');
      }

      const isPasswordEqual = await bcrypt.compare(signInData.password, hash);
      if (!isPasswordEqual) {
        throw new Error('Invalid password');
      }

      const token = await this.jwt.signAsync({
        sub: rest.id,
        email: rest.email,
        role: 'default',
      });

      return { ...rest, token };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new NotFoundException();
      }
      throw new Error('Error signing in');
    }
  }
  async signUp(user: SignUpDto) {
    try {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { hash, ...rest } = await this.prisma.user.create({
        data: {
          email: user.email,
          name: user.name,
          hash: hashedPassword,
        },
      });
      return rest;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new HttpException('User already exists', 400);
      }
      throw new Error('Error signing up');
    }
  }
}
