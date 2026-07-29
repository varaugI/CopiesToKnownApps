export const INITIAL_DATABASES = [
  {
    id: "db_prod",
    name: "production_db",
    size: "14.2 MB",
    collectionsCount: 3,
    collections: [
      {
        id: "coll_users",
        name: "users",
        documentsCount: 3,
        indexesCount: 2,
        size: "4.8 KB",
        documents: [
          {
            _id: "65f1a2b3c4d5e6f7a8b9c0d1",
            name: "Alex Rivera",
            email: "alex@dev.com",
            role: "admin",
            status: "active",
            age: 29,
            tags: ["developer", "staff"],
            createdAt: "2026-07-28T10:00:00Z"
          },
          {
            _id: "65f1a2b3c4d5e6f7a8b9c0d2",
            name: "Sarah Jenkins",
            email: "sarah@acme.com",
            role: "user",
            status: "active",
            age: 34,
            tags: ["designer"],
            createdAt: "2026-07-27T14:30:00Z"
          },
          {
            _id: "65f1a2b3c4d5e6f7a8b9c0d3",
            name: "David Miller",
            email: "david@corp.org",
            role: "manager",
            status: "inactive",
            age: 41,
            tags: ["management"],
            createdAt: "2026-07-25T09:15:00Z"
          }
        ],
        indexes: [
          { name: "_id_", fields: "{ _id: 1 }", unique: true, type: "B-Tree" },
          { name: "email_1", fields: "{ email: 1 }", unique: true, type: "B-Tree" }
        ]
      },
      {
        id: "coll_products",
        name: "products",
        documentsCount: 2,
        indexesCount: 1,
        size: "2.4 KB",
        documents: [
          {
            _id: "65f1a2b3c4d5e6f7a8b9c0p1",
            name: "Apple MacBook Pro 16",
            price: 3499.00,
            category: "Electronics",
            inStock: true
          },
          {
            _id: "65f1a2b3c4d5e6f7a8b9c0p2",
            name: "Sony WH-1000XM5",
            price: 398.00,
            category: "Electronics",
            inStock: true
          }
        ],
        indexes: [
          { name: "_id_", fields: "{ _id: 1 }", unique: true, type: "B-Tree" }
        ]
      },
      {
        id: "coll_orders",
        name: "orders",
        documentsCount: 1,
        indexesCount: 1,
        size: "1.2 KB",
        documents: [
          {
            _id: "65f1a2b3c4d5e6f7a8b9c0o1",
            userId: "65f1a2b3c4d5e6f7a8b9c0d1",
            totalAmount: 3897.00,
            status: "SHIPPED",
            createdAt: "2026-07-28T15:00:00Z"
          }
        ],
        indexes: [
          { name: "_id_", fields: "{ _id: 1 }", unique: true, type: "B-Tree" }
        ]
      }
    ]
  },
  {
    id: "db_analytics",
    name: "analytics_db",
    size: "48.6 MB",
    collectionsCount: 1,
    collections: [
      {
        id: "coll_events",
        name: "events",
        documentsCount: 2,
        indexesCount: 1,
        size: "8.1 KB",
        documents: [
          {
            _id: "65f1a2b3c4d5e6f7a8b9e001",
            event: "page_view",
            path: "/dashboard",
            timestamp: "2026-07-28T16:00:00Z"
          }
        ],
        indexes: [
          { name: "_id_", fields: "{ _id: 1 }", unique: true, type: "B-Tree" }
        ]
      }
    ]
  }
];
