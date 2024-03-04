import { BadRequestException, PipeTransform } from '@nestjs/common';
import { ZodSchema } from 'zod';

export class ZodPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}
  transform(value: unknown) {
    try {
      return this.schema.parse(value);
    } catch (error) {
      throw new BadRequestException('Validation failed (zod)');
    }
  }
}
