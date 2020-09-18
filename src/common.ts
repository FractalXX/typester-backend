import { IsNumber, Min, Max } from "class-validator";
import { Transform } from "class-transformer";

/**
 * Defines default query parameters for pagination.
 */
export class ListQueryParams {

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
  @Max(50)
  @Transform(value => Number(value))
  limit: number;
}