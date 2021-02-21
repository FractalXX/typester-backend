import { IsNumber, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';
import { mixin } from '@nestjs/common';

export const ListQueryParams = (maxElements: number) => {
  class MixinQueryParams {
    /**
     * The index of the first element to return.
     */
    @IsNumber()
    @Min(0)
    @Transform(value => Number(value))
    offset: number;

    /**
     * The limit of returned elements.
     */
    @IsNumber()
    @Min(1)
    @Max(maxElements)
    @Transform(value => Number(value))
    limit: number;
  }
  const queryParams = mixin(MixinQueryParams);
  return queryParams;
};
