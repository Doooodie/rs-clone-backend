declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PGDATABASE: string;
      PGUSER: string;
      PGPASSWORD: string;
      PGHOST: string;
      PGPORT: number;
      PORT: number;
    }
  }
}

export {};
