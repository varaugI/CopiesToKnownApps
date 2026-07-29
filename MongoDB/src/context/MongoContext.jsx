import React, { createContext, useContext, useState, useEffect } from "react";
import { INITIAL_DATABASES } from "../data/mockMongoData";

const MongoContext = createContext();

export const MongoProvider = ({ children }) => {
  const [activeView, setActiveView] = useState("documents");

  const [databases, setDatabases] = useState(() => {
    const saved = localStorage.getItem("mg_databases");
    return saved ? JSON.parse(saved) : INITIAL_DATABASES;
  });

  useEffect(() => {
    localStorage.setItem("mg_databases", JSON.stringify(databases));
  }, [databases]);

  const [activeDbId, setActiveDbId] = useState("db_prod");
  const [activeCollId, setActiveCollId] = useState("coll_users");
  const [queryFilter, setQueryFilter] = useState("{}");

  const activeDb = databases.find((d) => d.id === activeDbId) || databases[0];
  const activeColl =
    activeDb.collections.find((c) => c.id === activeCollId) || activeDb.collections[0];

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);

  const openCollection = (dbId, collId) => {
    setActiveDbId(dbId);
    setActiveCollId(collId);
    setQueryFilter("{}");
    setActiveView("documents");
  };

  const insertDocument = (docObj) => {
    const newDoc = {
      _id: "65f1a2b" + Math.random().toString(16).substring(2, 18),
      ...docObj
    };

    setDatabases((prev) =>
      prev.map((db) => {
        if (db.id === activeDbId) {
          return {
            ...db,
            collections: db.collections.map((c) => {
              if (c.id === activeCollId) {
                return {
                  ...c,
                  documentsCount: c.documentsCount + 1,
                  documents: [newDoc, ...c.documents]
                };
              }
              return c;
            })
          };
        }
        return db;
      })
    );
  };

  const deleteDocument = (docId) => {
    setDatabases((prev) =>
      prev.map((db) => {
        if (db.id === activeDbId) {
          return {
            ...db,
            collections: db.collections.map((c) => {
              if (c.id === activeCollId) {
                return {
                  ...c,
                  documentsCount: Math.max(0, c.documentsCount - 1),
                  documents: c.documents.filter((d) => d._id !== docId)
                };
              }
              return c;
            })
          };
        }
        return db;
      })
    );
  };

  return (
    <MongoContext.Provider
      value={{
        activeView,
        setActiveView,
        databases,
        activeDb,
        activeColl,
        openCollection,
        queryFilter,
        setQueryFilter,
        insertDocument,
        deleteDocument,
        isEditModalOpen,
        setIsEditModalOpen,
        editingDoc,
        setEditingDoc
      }}
    >
      {children}
    </MongoContext.Provider>
  );
};

export const useMongo = () => useContext(MongoContext);
