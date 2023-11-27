import { Application, Router, send } from "https://deno.land/x/oak/mod.ts";
 
const peoples = new Map();
peoples.set("Mary", {
  account: "Mary",
  password: "123456",
});
peoples.set("Jary", {
  account: "Jary",
  password: "654321",
});

const router = new Router();
router
  .get("/", (ctx) => {
    ctx.response.body = "Home";
  })
  .get("/public/(.*)", async (ctx) => {
    let wpath = ctx.params[0]
    //console.log('wpath=', wpath)
    await send(ctx, wpath, {
      root: Deno.cwd()+"/public/",
      index: "index.html",
    })
  })
  .post("/people/login", async (ctx) => {
    const body = ctx.request.body()
    if (body.type === "form") {
      const pairs = await body.value
      //console.log('pairs=', pairs)
      const params = {}
      for (const [key, value] of pairs) {
        params[key] = value
      }
      console.log('params=', params)
      let account = params['account']
      let password = params['password']
      //console.log(`account=${account} password=${password}`)
      ctx.response.type = 'text/html'
      if (peoples.has(account) && peoples.get(account).password == password) {
        ctx.response.body = `
          <h1>Login success</h1>
          <h2><a href="/public/index.html">Enter the system</a></h2>`
      } else {
        ctx.response.body = `
          <h1>Login failed, please check whether the account number and password are correct.</h1>`
      }
    }
  })
  .post("/people/sign_up", async (ctx) => {
    const body = ctx.request.body()
    if (body.type === "form") {
      const pairs = await body.value
      console.log('pairs=', pairs)
      const params = {}
      for (const [key, value] of pairs) {
        params[key] = value
      }
      console.log('params=', params)
      let account = params['account']
      let password = params['password']
      console.log(`account=${account} password=${password}`)
      if (peoples.get(account)) {
        ctx.response.body = `
        <h1>Sign up failed</h1>
        <h2>Account has been used</h2>`
      } else {
        peoples.set(account, {account, password})
        ctx.response.type = 'text/html'
        ctx.response.body = `
        <h1>Sign up success</h1>
        <h2><a href="/public/login.html">Login the system</a></h2>`
      }
    }
  });
  

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

console.log('start at : http://127.0.0.1:8000')

await app.listen({ port: 8000 });
