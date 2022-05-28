import { IsNotEmpty, IsString } from "class-validator";

export class IngestCsvRequestDto {
  @IsNotEmpty()
  file: string; //csv file contents
}
