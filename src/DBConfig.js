export const DBConfig = {
    name: "MyDB",
    version: 3.1,
    objectStoresMeta: [
      {
        store: "goal",
        storeConfig: { keyPath: "id", autoIncrement: true },
        storeSchema: [
          { name: "name", keypath: "name", options: { unique: false } },
          { name: "endTime", keypath: "endTime", options: { unique: false } },
          { name: "totalDistance", keypath: "totalDistance", options: { unique: false } },
          { name: "currentDistance", keypath: "currentDistance", options: { unique: false } },
          { name: "type", keypath: "type", options: { unique: false } },
          { name: "status", keypath: "status", options: { unique: false } },
        ],
      },
      {
        store: "activity",
        storeConfig: { keyPath: "id", autoIncrement: true },
        storeSchema: [
            { name: "type", keypath: "type", options: { unique: false } },
            { name: "time", keypath: "time", options: { unique: false } },
            { name: "totalDistance", keypath: "totalDistance", options: { unique: false } },
            { name: "path", keypath: "path", options: { unique: false } },
            { name: "createTime", keypath: "createTime", options: { unique: false } },
        ],
      },
    ],
};