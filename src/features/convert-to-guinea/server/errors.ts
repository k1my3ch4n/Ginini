export class ConvertError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = new.target.name;
  }
}

export class InvalidImageError extends ConvertError {
  constructor(message: string) {
    super(400, message);
  }
}

export class FaceNotDetectedError extends ConvertError {
  constructor() {
    super(422, "얼굴이 잘 보이는 사진을 올려주세요.");
  }
}

export class AnalysisFailedError extends ConvertError {
  constructor(message = "이미지 분석에 실패했습니다. 다시 시도해 주세요.") {
    super(502, message);
  }
}

export class GenerationQuotaError extends ConvertError {
  constructor() {
    super(402, "API 크레딧이 부족합니다.");
  }
}

export class GenerationFailedError extends ConvertError {
  constructor(message = "이미지 생성에 실패했습니다. 다시 시도해 주세요.") {
    super(502, message);
  }
}
