import { Bot, InlineKeyboard } from "grammy";
import { ChatGPTAPI } from "chatgpt";
import dotenv from "dotenv";
dotenv.config();

//Create a new bot
const bot = new Bot("5733310708:AAHzFw8QZET4g60jZ79otUC1UJMxXuLkfZA");

const api = {};
const conversation = {};

//This handler sends a menu with the inline buttons we pre-assigned above
bot.command("restart", async (ctx) => {
  let name = ctx.from.username;
  api[name] = new ChatGPTAPI({ sessionToken: process.env.SESSION_TOKEN });
  await api[name].ensureAuth();
  conversation[name] = api[name].getConversation();
});


//This function would be added to the dispatcher as a handler for messages coming from the Bot API
bot.on("message", async (ctx) => {
  //Print to console
  console.log(
    `${ctx.from.username} wrote ${
      "text" in ctx.message ? ctx.message.text : ""
    }`,
  );

  let name = ctx.from.username;
  if(!(name in api)){
    api[name] = new ChatGPTAPI({ sessionToken: process.env.SESSION_TOKEN });
    await api[name].ensureAuth();
    conversation[name] = api[name].getConversation();
  }

  if(ctx.message.text){
    let response = await conversation[name].sendMessage(ctx.message.text);
    await ctx.reply(response, {parse_mode: "Markdown"});
  }
});

//Start the Bot
bot.start();
