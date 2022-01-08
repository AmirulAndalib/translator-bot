import * as log from "https://deno.land/std@0.119.0/log/mod.ts";
import { LogRecord } from "https://deno.land/std@0.119.0/log/mod.ts";

import env from "./env.ts";

const formatter = (logRecord: LogRecord) => {
  const date = new Date();

  return `[${date.toDateString()} ${date.toLocaleTimeString()}] [${logRecord.levelName}] ${logRecord.msg}`;
};

export const setup = () =>
  log.setup({
    handlers: {
      console: new log.handlers.ConsoleHandler("DEBUG", {
        formatter,
      }),
      file: new log.handlers.FileHandler("DEBUG", {
        filename: env.LOG_FILE,
        formatter,
      }),
    },
    loggers: {
      default: {
        level: "DEBUG",
        handlers: ["console", "file"],
      },
    },
  });
