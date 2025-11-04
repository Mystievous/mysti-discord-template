declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production";
      TOKEN?: string;
      API_URL?: string;
      INCLUDE_EXAMPLES?: "True" | "False";
      CLIENT_ID?: string;
      GUILD_ID?: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
