const {
  createBot,
  createProvider,
  createFlow,
  addKeyword,
  addAnswer,
} = require("@bot-whatsapp/bot");

const QRPortalWeb = require("@bot-whatsapp/portal");
const WebWhatsappProvider = require("@bot-whatsapp/provider/web-whatsapp");
const MockAdapter = require("@bot-whatsapp/database/mock");

const flowPrincipal = addKeyword([
  "hola",
  "wey",
  "klk",
  "saludos",
  "bro",
  "broh",
  "eury",
])
  .addAnswer("Hola actualmente te esta respondiendo un *Chatbot*", {
    capture: true,
  })
  .addAnswer(
    "¿Quieres mantener la conversacion?",
    { capture: true },
    (ctx, { fallBack }) => {
      if (!ctx.body.includes("si")) {
        return fallBack();
      }
      console.log("mensaje entrante: ", ctx.body);
    }
  );

const flowConversation = addKeyword(["si", "ok"])
  .addAnswer("Escribe el mensaje que deseas dejarle a *Eury*", {
    capture: true,
  })
  .addAnswer("Perfecto cuando el este disponible le respondera", {
    capture: true,
  });

const Services = ["mal", "bien", "excelente"];

const flowServices = addKeyword(["ok", "bien", "vale"]).addAnswer(
  "Que te parecio mi servicios como asistente?",
  { capture: true },
  (ctx, { fallBack }) => {
    for (const keyServices in Services) {
      if (!ctx.body.includes(keyServices)) {
        addAnswer("Lamento escuchar que tu experiencia no fue la mejor :( ");
        return;
      }
    }
    return fallBack();
  }
);

const FlowSecond = ["no", "si", "por supuesto"];

const flowConversationTwo = ["perfecto", "bien"].addAnswer(
  "hola soy waterbot",
  { capture: true },
  (ctx, { fallBack }) => {
    if (!ctx.body.includes("hey")) {
      return fallBack();
    }
  }
);

const FlowSecundary = addKeyword(["ok"]).addAnswer(
  "Como estuvo tu instacion con migo como asistente",
  { capture: true },
  (ctx, { fallBack }) => {
    for (const flow in FlowSecond) {
      if (ctx.body.includes("no")) {
        addAnswer(flow[FlowSecond]);
      }
      return fallBack();
    }
  }
);

const main = async () => {
  const adapterDB = new MockAdapter();
  const adapterFlow = createFlow([
    flowPrincipal,
    flowConversation,
    flowServices,
    flowConversationTwo,
  ]);
  const adapterProvider = createProvider(WebWhatsappProvider);
  createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  });
  QRPortalWeb();
};

main();
