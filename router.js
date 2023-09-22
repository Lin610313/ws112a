import { Application, Router } from "https://deno.land/x/oak/mod.ts";

// Define your room data
const room = new Map([
  ["e320", {
    教室: "e320",
    功能: "多媒體教室",
  }],
  ["e319", {
    教室: "e319",
    功能: "嵌入式實驗室",
  }],
]);

const router = new Router();

router
  .get("/", (context) => {
    context.response.body = "網頁";
  })
  .get("/nqu/", (context) => {
    context.response.body = `
      <html>
        <body>
          <a href="https://www.nqu.edu.tw/">NQU</a>
        </body>
      </html>`;
  })
  .get("/nqu/csie/", (context) => {
    context.response.body = `
      <html>
        <body>
          <a href="https://csie.nqu.edu.tw/">NQU/CSIE</a>
        </body>
      </html>`;
  })
  .get("/to/nqu/", (context) => {
    context.response.redirect('https://www.nqu.edu.tw/');
  })
  .get("/to/nqu/csie/", (context) => {
    context.response.redirect('https://csie.nqu.edu.tw/');
  })
  .get("/room/:id", (context) => {
    const roomId = context.params.id;
    const roomInfo = room.get(roomId);

    if (roomInfo) {
      context.response.body = JSON.stringify(roomInfo, null, 2);
    } else {
      context.response.status = 404;
      context.response.body = "Room not found";
    }
  });

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

const port = 8000;
console.log(`Server started on http://127.0.0.1:${port}`);
await app.listen({ port });
