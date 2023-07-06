export class ResponseBoolDto {
  success: boolean;

  constructor(success: boolean) {
    this.success = success;
  }
}

export class ResponseDto<T> {
  content: T | null;

  constructor(data: T | null) {
    this.content = data;
  }
}
