import { Bot, InlineKeyboard } from "grammy";
import { ChatGPTAPI } from "chatgpt";
import dotenv from "dotenv";
dotenv.config();

//Create a new bot
const bot = new Bot("5733310708:AAHzFw8QZET4g60jZ79otUC1UJMxXuLkfZA");

let api = new ChatGPTAPI({ sessionToken: process.env.SESSION_TOKEN });
await api.ensureAuth();
let conversation = api.getConversation();

//This handler sends a menu with the inline buttons we pre-assigned above
bot.command("restart", async (ctx) => {
  api = new ChatGPTAPI({ sessionToken: process.env.SESSION_TOKEN });
  await api.ensureAuth();
  conversation = api.getConversation();
});


//This function would be added to the dispatcher as a handler for messages coming from the Bot API
bot.on("message", async (ctx) => {
  //Print to console
  console.log(
    `${ctx.from.first_name} wrote ${
      "text" in ctx.message ? ctx.message.text : ""
    }`,
  );

  if(ctx.message.text){
    let response = await conversation.sendMessage(ctx.message.text);
    await ctx.reply(response, {parse_mode: "Markdown"});
  }
});

//Start the Bot
bot.start();
