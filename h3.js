// Import required modules
import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import * as render from './render.js';

// Initialize an array to store contacts
const contacts = [
  { id: 0, name: 'Ann', tel: '0912345678' },
  { id: 1, name: 'Ben', tel: '0934567890' }
];

// Create a new Router instance
const router = new Router();

// Define routes and their associated handlers
router
  .get('/', listContacts)
  .get('/contact/new', renderNewContactForm)
  .get('/contact/:id', showContact)
  .post('/contact', createContact);

// Create an Oak Application instance
const app = new Application();

// Register Oak middleware for routing
app.use(router.routes());
app.use(router.allowedMethods());

// Define route handlers

// List all contacts
async function listContacts(ctx) {
  ctx.response.body = await render.list(contacts);
}

// Render the form for adding a new contact
async function renderNewContactForm(ctx) {
  ctx.response.body = await render.newcontact();
}

// Show details of a specific contact by ID
async function showContact(ctx) {
  const id = ctx.params.id;
  const contact = contacts[id];
  if (!contact) {
    ctx.throw(404, 'Invalid contact id');
  }
  ctx.response.body = await render.show(contact);
}

// Create a new contact
async function createContact(ctx) {
  const body = ctx.request.body();
  if (body.type === "form") {
    const pairs = await body.value();
    const contact = {};
    for (const [key, value] of pairs) {
      contact[key] = value;
    }
    const id = contacts.push(contact) - 1;
    contact.created_at = new Date();
    contact.id = id;
    ctx.response.redirect('/');
  }
}

// Start the server
const port = 8000;
console.log(`Server is running on http://127.0.0.1:${port}`);
await app.listen({ port });
