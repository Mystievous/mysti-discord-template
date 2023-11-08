declare global {
    namespace NodeJS {
      interface ProcessEnv {
        NODE_ENV: 'development' | 'production';
        TOKEN: string
        CLIENT_ID: string
        GUILD_ID: string
        DB_HOST: string
        DB_DATABASE: string
        DB_USER: string
        DB_PASSWORD: string
      }
    }
  }
  
  // If this file has no import/export statements (i.e. is a script)
  // convert it into a module by adding an empty export statement.
  export {}