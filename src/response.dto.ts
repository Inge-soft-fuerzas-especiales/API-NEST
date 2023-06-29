export class ResponseBoolDto {
  success: boolean;

  constructor(success: boolean) {
    this.success = success;
  }
}

export class ResponseDataDto<T> {
  content: T | null;

  constructor(data: T | null) {
    this.content = data;
  }
}
