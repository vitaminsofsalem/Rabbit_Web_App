import { IsNotEmpty, IsString } from "class-validator";

export class IngestCsvRequestDto {
  @IsNotEmpty()
  fileBase64: string; //csv file contents
}
