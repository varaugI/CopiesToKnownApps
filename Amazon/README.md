# Amazon storefront study

This is a high-fidelity, fictional Amazon shopping interface implemented with a React + TypeScript
client and a Node.js backend-for-frontend (BFF). The previous local React/Vite + Java/Spring copy is
preserved unchanged at `../Amazon-ReactVite`.

## Why this stack

Amazon is a large distributed system, so no public source supports describing all of Amazon.com with
one framework. The closest first-party evidence for the customer-facing shopping experience is
Amazon's current Shopping Design engineering material: its front-end role names HTML, CSS, and
JavaScript; JavaScript frameworks such as React; and TypeScript and Node as preferred technologies.
This copy therefore uses React, TypeScript, and Node while making no claim about Amazon's private
production build tools or every downstream service.

- [Amazon Jobs: Front-End Engineer, Shopping Design](https://www.amazon.jobs/en/jobs/10462490/front-end-engineer-shopping-design)
- [Amazon Builders' Library FAQ](https://aws.amazon.com/builders-library/faqs/)

Vite is used only as local compilation tooling. The Node BFF intentionally uses the standard library
so the service boundary remains easy to inspect.

## Included experience

- Responsive Amazon-style global header, department navigation, hero, category cards, deal rail,
  recommendation grid, Prime banner, and footer
- Search and department filtering with an empty state and reset path
- Rotating hero promotions and category shortcuts
- Product-detail dialog with pricing, ratings, delivery, and feature information
- Account and delivery-location popovers
- Cart drawer with quantity controls, subtotal calculation, and a demo-only checkout
- Shared catalog used by both the browser and Node service
- BFF endpoints for health, products, deals, cart state, and demo checkout

All products, prices, accounts, and transactions are fictional. No payment is processed.

## Run and verify

```powershell
npm install
npm run build
npm test
npm start
```

The production app runs at `http://127.0.0.1:4001`. During client-only development, run `npm run dev`
and `npm start` in separate terminals; Vite proxies `/api` to the Node service.

### API routes

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | Service and catalog health |
| `GET` | `/api/products?q=&category=` | Searchable catalog |
| `GET` | `/api/deals` | Discount-ranked deal set |
| `GET` | `/api/cart` | Current in-memory demo cart |
| `POST` | `/api/cart` | Validate and add a cart item |
| `DELETE` | `/api/cart/:productId` | Remove a cart item |
| `POST` | `/api/checkout` | Clear the demo cart and return a fake confirmation |

