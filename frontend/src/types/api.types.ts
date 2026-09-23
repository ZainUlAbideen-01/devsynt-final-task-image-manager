export interface ImageType {
  _id: string;
  public_id: string;
  url: string;
}

export interface SignupRequest {
  firstname?: string;
  lastname?: string;
  email?: string;
  password?: string;
}

export interface LoginRequest {
  email?: string;
  password?: string;
}

export interface ForgotPasswordRequest {
  email?: string;
}

export interface ResetPasswordRequest {
  password?: string;
}

export interface UploadImageRequest {
  image: File;
}
