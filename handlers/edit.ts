import * as log from "@std/log";
import { Composer } from "grammy/mod.ts";
import * as p from "grammy_parse_mode/mod.ts";
import { Context, linkMessage } from "../utils.ts";
import { channels } from "../data.ts";
import env from "../env.ts";

const composer = new Composer<Context>();

export default composer;

const ecp = composer.on("edited_channel_post");

ecp.use((ctx, next) => {
  if (
    Object.keys(channels.ru).concat(Object.keys(channels.en)).includes(
      String(ctx.chat.id),
    )
  ) {
    return next();
  }
});

ecp.use(async (ctx) => {
  const channel = { ...channels.en, ...channels.ru }[ctx.chat.id];
  const { text, entities } = p.fmt`${
    p.link(
      ctx.msg.message_id,
      linkMessage(ctx.chat.id, ctx.msg.message_id),
    )
  } was edited in ${channel.name}.`;
  try {
    await ctx.api.sendMessage(env.NOTIFICATIONS_CHAT, text, { entities });
    log.info(`Sent notification for an edit in ${channel.name}.`);
  } catch (err) {
    log.warning(
      `Failed to send notification for an edit in ${channel.name}: ${err}`,
    );
  }
});
