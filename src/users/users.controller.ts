import { Body, Controller, Post } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { OffsetPaginationRequest } from '../system/pagination/offset-pagination-request';
import { User } from '../system/database/entities/user.entity';
import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

class MatchInput {
  @Type(() => Number)
  page: number;
  @Type(() => Number)
  size: number;
  @IsOptional()
  @IsString()
  username: string;
  @IsOptional()
  @IsString()
  full_name: string;
  @IsOptional()
  @IsString()
  country: string;
}

@Controller('users')
export class UsersController {
  constructor(private readonly dataSource: DataSource) {}

  /**
   * Correct input of country
   */
  @Post('match')
  find(@Body() input: MatchInput) {
    const qb = this.dataSource
      .createQueryBuilder(User, 'users')
      .offset(OffsetPaginationRequest.getOffset(input.page, input.size))
      .limit(input.size);

    if (input.country) {
      qb.andWhere('country = :country', {
        country: input.country,
      });
    }

    if (input.username) {
      qb.addSelect('levenshtein(username, :username)', 'username_distance')
        .setParameter('username', input.username)
        .orWhere(
          '(1 - (levenshtein(username, :username)::float / length(:username))) >= 0.7',
        )
        .addOrderBy('username_distance', 'ASC');
    }

    if (input.full_name) {
      qb
        // .addSelect('levenshtein(full_name, :full_name)', 'full_name_distance')
        .orWhere(
          '(1 - (levenshtein(full_name, :full_name)::float / length(:full_name))) >= 0.7',
        )
        .setParameter('full_name', input.full_name);
    }

    return qb.getRawMany();
  }
}
