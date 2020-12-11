declare namespace NodeJS {
  export interface ProcessEnv {
    CORS_ORIGIN: string;
    ACCESS_TOKEN_PRIVATE_KEY: string;
    REFRESH_TOKEN_PRIVATE_KEY: string;
    SMS_USER_API_KEY: string;
    SMS_SECRET_KEY: string;
    SMS_ENDPOINT: string;
    CHANGE_PASSWORD_EXPIRED_TIME:string;
  }
}
