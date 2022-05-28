export class IngestCsvEvent {
  type: "INGEST";
  file: string; //csv file contents as base64
}
