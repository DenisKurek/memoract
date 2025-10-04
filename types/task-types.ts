export type Task = {
  id: string;
  title: string;
  description: string;
  datetime: string;
  completionMethod: CompletionMethod;
};

export enum CompletionMethod {
  QR_CODE = "QR_CODE",
  GEOLOCATION = "GEOLOCATION",
  FACE_ID = "FACE_ID",
  PHOTO = "PHOTO",
}
