import { Bot, InlineKeyboard } from "grammy";
import { ChatGPTAPI, getOpenAIAuth } from 'chatgpt';
import dotenv from "dotenv";
dotenv.config();

const openAIAuth = await getOpenAIAuth({
  email: process.env.OPENAI_EMAIL,
  password: process.env.OPENAI_PASSWORD
});

//Create a new bot
const bot = new Bot(process.env.BOT_TOKEN);

const api = {};
const conversation = {};

//This handler sends a menu with the inline buttons we pre-assigned above
bot.command("restart", async (ctx) => {
  let name = ctx.from.username;
  api[name] = new ChatGPTAPI({ ...openAIAuth });
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
    api[name] = new ChatGPTAPI({ ...openAIAuth });
    await api[name].ensureAuth();
    conversation[name] = api[name].getConversation();
  }

  if(ctx.message.text){
    let response = "";
    try{
      response = await conversation[name].sendMessage(ctx.message.text);
    }
    catch (err) {
      response = err.stack;
    }
    try{
      await ctx.reply(response, {parse_mode: "Markdown"});
    }
    catch (err) {
      await ctx.reply(response, {});
    }
  }
});

//Start the Bot
bot.start();
