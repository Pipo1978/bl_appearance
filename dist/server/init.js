var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __glob = (map) => (path) => {
  var fn = map[path];
  if (fn)
    return fn();
  throw new Error("Module not found in bundle: " + path);
};
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/server/utils/index.ts
function triggerClientCallback(eventName, playerId, ...args) {
  let key;
  do {
    key = `${eventName}:${Math.floor(Math.random() * (1e5 + 1))}:${playerId}`;
  } while (activeEvents[key]);
  emitNet(`_bl_cb_${eventName}`, playerId, resourceName, key, ...args);
  return new Promise((resolve) => {
    activeEvents[key] = resolve;
  });
}
function onClientCallback(eventName, cb) {
  onNet(`_bl_cb_${eventName}`, async (resource, key, ...args) => {
    const src = source;
    let response;
    try {
      response = await cb(src, ...args);
    } catch (e) {
      console.error(`an error occurred while handling callback event ${eventName}`);
      console.log(`^3${e.stack}^0`);
    }
    emitNet(`_bl_cb_${resource}`, src, key, response);
  });
}
var resourceName, activeEvents, core;
var init_utils = __esm({
  "src/server/utils/index.ts"() {
    resourceName = GetCurrentResourceName();
    activeEvents = {};
    onNet(`_bl_cb_${resourceName}`, (key, ...args) => {
      const resolve = activeEvents[key];
      return resolve && resolve(...args);
    });
    __name(triggerClientCallback, "triggerClientCallback");
    __name(onClientCallback, "onClientCallback");
    core = exports.bl_bridge.core();
  }
});

// node_modules/@overextended/oxmysql/MySQL.js
var require_MySQL = __commonJS({
  "node_modules/@overextended/oxmysql/MySQL.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.oxmysql = void 0;
    var QueryStore = [];
    function assert(condition, message) {
      if (!condition)
        throw new TypeError(message);
    }
    __name(assert, "assert");
    var safeArgs = /* @__PURE__ */ __name((query, params, cb, transaction) => {
      if (typeof query === "number")
        query = QueryStore[query];
      if (transaction) {
        assert(typeof query === "object", `First argument expected object, recieved ${typeof query}`);
      } else {
        assert(typeof query === "string", `First argument expected string, received ${typeof query}`);
      }
      if (params) {
        const paramType = typeof params;
        assert(paramType === "object" || paramType === "function", `Second argument expected object or function, received ${paramType}`);
        if (!cb && paramType === "function") {
          cb = params;
          params = void 0;
        }
      }
      if (cb !== void 0)
        assert(typeof cb === "function", `Third argument expected function, received ${typeof cb}`);
      return [query, params, cb];
    }, "safeArgs");
    var exp = global.exports.oxmysql;
    var currentResourceName = GetCurrentResourceName();
    function execute(method, query, params) {
      return new Promise((resolve, reject) => {
        exp[method](query, params, (result, error) => {
          if (error)
            return reject(error);
          resolve(result);
        }, currentResourceName, true);
      });
    }
    __name(execute, "execute");
    exports2.oxmysql = {
      store(query) {
        assert(typeof query !== "string", `Query expects a string, received ${typeof query}`);
        return QueryStore.push(query);
      },
      ready(callback) {
        setImmediate(async () => {
          while (GetResourceState("oxmysql") !== "started")
            await new Promise((resolve) => setTimeout(resolve, 50));
          callback();
        });
      },
      async query(query, params, cb) {
        [query, params, cb] = safeArgs(query, params, cb);
        const result = await execute("query", query, params);
        return cb ? cb(result) : result;
      },
      async single(query, params, cb) {
        [query, params, cb] = safeArgs(query, params, cb);
        const result = await execute("single", query, params);
        return cb ? cb(result) : result;
      },
      async scalar(query, params, cb) {
        [query, params, cb] = safeArgs(query, params, cb);
        const result = await execute("scalar", query, params);
        return cb ? cb(result) : result;
      },
      async update(query, params, cb) {
        [query, params, cb] = safeArgs(query, params, cb);
        const result = await execute("update", query, params);
        return cb ? cb(result) : result;
      },
      async insert(query, params, cb) {
        [query, params, cb] = safeArgs(query, params, cb);
        const result = await execute("insert", query, params);
        return cb ? cb(result) : result;
      },
      async prepare(query, params, cb) {
        [query, params, cb] = safeArgs(query, params, cb);
        const result = await execute("prepare", query, params);
        return cb ? cb(result) : result;
      },
      async rawExecute(query, params, cb) {
        [query, params, cb] = safeArgs(query, params, cb);
        const result = await execute("rawExecute", query, params);
        return cb ? cb(result) : result;
      },
      async transaction(query, params, cb) {
        [query, params, cb] = safeArgs(query, params, cb, true);
        const result = await execute("transaction", query, params);
        return cb ? cb(result) : result;
      },
      isReady() {
        return exp.isReady();
      },
      async awaitConnection() {
        return await exp.awaitConnection();
      }
    };
  }
});

// src/server/appearance.ts
var import_oxmysql, saveAppearance;
var init_appearance = __esm({
  "src/server/appearance.ts"() {
    import_oxmysql = __toESM(require_MySQL(), 1);
    saveAppearance = /* @__PURE__ */ __name(async (src, frameworkId, appearance) => {
      const clothes = {
        drawables: appearance.drawables,
        props: appearance.props,
        headOverlay: appearance.headOverlay
      };
      const skin = {
        headBlend: appearance.headBlend,
        headStructure: appearance.headStructure,
        hairColor: appearance.hairColor,
        model: appearance.model
      };
      const tattoos = appearance.tattoos || [];
      const result = await import_oxmysql.oxmysql.prepare(
        "INSERT INTO appearance (id, clothes, skin, tattoos) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE clothes = VALUES(clothes), skin = VALUES(skin), tattoos = VALUES(tattoos);",
        [
          frameworkId,
          JSON.stringify(clothes),
          JSON.stringify(skin),
          JSON.stringify(tattoos)
        ]
      );
      return result;
    }, "saveAppearance");
  }
});

// src/server/migrate/esx.ts
var esx_exports = {};
var init_esx = __esm({
  "src/server/migrate/esx.ts"() {
  }
});

// src/server/migrate/fivem.ts
var fivem_exports = {};
__export(fivem_exports, {
  default: () => fivem_default
});
var import_oxmysql2, delay, migrate, fivem_default;
var init_fivem = __esm({
  "src/server/migrate/fivem.ts"() {
    import_oxmysql2 = __toESM(require_MySQL(), 1);
    init_utils();
    init_appearance();
    delay = /* @__PURE__ */ __name((ms) => new Promise((res) => setTimeout(res, ms)), "delay");
    migrate = /* @__PURE__ */ __name(async (src) => {
      const response = await import_oxmysql2.oxmysql.query("SELECT * FROM `players`");
      if (!response)
        return;
      for (const element of response) {
        if (element.skin) {
          await triggerClientCallback("bl_appearance:client:migration:setAppearance", src, {
            type: "fivem",
            data: JSON.parse(element.skin)
          });
          await delay(100);
          const response2 = await triggerClientCallback("bl_appearance:client:getAppearance", src);
          await saveAppearance(src, element.citizenid, response2);
        }
      }
      console.log("Converted " + response.length + " appearances");
    }, "migrate");
    fivem_default = migrate;
  }
});

// src/server/migrate/illenium.ts
var illenium_exports = {};
__export(illenium_exports, {
  default: () => illenium_default
});
var import_oxmysql3, delay2, migrate2, illenium_default;
var init_illenium = __esm({
  "src/server/migrate/illenium.ts"() {
    import_oxmysql3 = __toESM(require_MySQL(), 1);
    init_utils();
    init_appearance();
    delay2 = /* @__PURE__ */ __name((ms) => new Promise((res) => setTimeout(res, ms)), "delay");
    migrate2 = /* @__PURE__ */ __name(async (src) => {
      const response = await import_oxmysql3.oxmysql.query("SELECT * FROM `playerskins` WHERE active = 1");
      if (!response)
        return;
      for (const element of response) {
        if (element.skin) {
          await triggerClientCallback("bl_appearance:client:migration:setAppearance", src, {
            type: "illenium",
            data: JSON.parse(element.skin)
          });
          await delay2(100);
          const response2 = await triggerClientCallback("bl_appearance:client:getAppearance", src);
          await saveAppearance(src, element.citizenid, response2);
        }
      }
      console.log("Converted " + response.length + " appearances");
    }, "migrate");
    illenium_default = migrate2;
  }
});

// src/server/migrate/qb.ts
var qb_exports = {};
__export(qb_exports, {
  default: () => qb_default
});
var import_oxmysql4, delay3, migrate3, qb_default;
var init_qb = __esm({
  "src/server/migrate/qb.ts"() {
    import_oxmysql4 = __toESM(require_MySQL(), 1);
    init_utils();
    init_appearance();
    delay3 = /* @__PURE__ */ __name((ms) => new Promise((res) => setTimeout(res, ms)), "delay");
    migrate3 = /* @__PURE__ */ __name(async (src) => {
      const response = await import_oxmysql4.oxmysql.query("SELECT * FROM `playerskins` WHERE active = 1");
      if (!response)
        return;
      for (const element of response) {
        emitNet("qb-clothes:loadSkin", src, 0, element.model, element.skin);
        await delay3(200);
        const response2 = await triggerClientCallback("bl_appearance:client:getAppearance", src);
        await saveAppearance(src, element.citizenid, response2);
      }
      console.log("Converted " + response.length + " appearances");
    }, "migrate");
    qb_default = migrate3;
  }
});

// src/server/init.ts
init_utils();
var import_oxmysql5 = __toESM(require_MySQL(), 1);
init_appearance();

// import("./migrate/**/*.ts") in src/server/init.ts
var globImport_migrate_ts = __glob({
  "./migrate/esx.ts": () => Promise.resolve().then(() => (init_esx(), esx_exports)),
  "./migrate/fivem.ts": () => Promise.resolve().then(() => (init_fivem(), fivem_exports)),
  "./migrate/illenium.ts": () => Promise.resolve().then(() => (init_illenium(), illenium_exports)),
  "./migrate/qb.ts": () => Promise.resolve().then(() => (init_qb(), qb_exports))
});

// src/server/init.ts
onClientCallback("bl_appearance:server:getOutfits", async (src, frameworkId) => {
  const job = core.GetPlayer(src).job || { name: "unknown", grade: { name: "unknown" } };
  let response = await import_oxmysql5.oxmysql.prepare(
    "SELECT * FROM outfits WHERE player_id = ? OR (jobname = ? AND jobrank <= ?)",
    [frameworkId, job.name, job.grade.name]
  );
  if (!response)
    return [];
  if (!Array.isArray(response)) {
    response = [response];
  }
  const outfits = response.map(
    (outfit) => {
      return {
        id: outfit.id,
        label: outfit.label,
        outfit: JSON.parse(outfit.outfit),
        jobname: outfit.jobname
      };
    }
  );
  return outfits;
});
onClientCallback("bl_appearance:server:renameOutfit", async (src, frameworkId, data) => {
  const id = data.id;
  const label = data.label;
  const result = await import_oxmysql5.oxmysql.update(
    "UPDATE outfits SET label = ? WHERE player_id = ? AND id = ?",
    [label, frameworkId, id]
  );
  return result;
});
onClientCallback("bl_appearance:server:deleteOutfit", async (src, frameworkId, id) => {
  const result = await import_oxmysql5.oxmysql.update(
    "DELETE FROM outfits WHERE player_id = ? AND id = ?",
    [frameworkId, id]
  );
  return result > 0;
});
onClientCallback("bl_appearance:server:saveOutfit", async (src, frameworkId, data) => {
  let jobname = null;
  let jobrank = 0;
  if (data.job) {
    jobname = data.job.name;
    jobrank = data.job.rank;
  }
  const id = await import_oxmysql5.oxmysql.insert(
    "INSERT INTO outfits (player_id, label, outfit, jobname, jobrank) VALUES (?, ?, ?, ?, ?)",
    [frameworkId, data.label, JSON.stringify(data.outfit), jobname, jobrank]
  );
  return id;
});
onClientCallback("bl_appearance:server:grabOutfit", async (src, id) => {
  const response = await import_oxmysql5.oxmysql.prepare(
    "SELECT outfit FROM outfits WHERE id = ?",
    [id]
  );
  return JSON.parse(response);
});
onClientCallback("bl_appearance:server:itemOutfit", async (src, data) => {
  const player = core.GetPlayer(src);
  player.addItem("cloth", 1, data);
});
onClientCallback("bl_appearance:server:importOutfit", async (src, frameworkId, outfitId, outfitName) => {
  const [result] = await import_oxmysql5.oxmysql.query(
    "SELECT label, outfit FROM outfits WHERE id = ?",
    [outfitId]
  );
  if (!result) {
    return { success: false, message: "Outfit not found" };
  }
  const newId = await import_oxmysql5.oxmysql.insert(
    "INSERT INTO outfits (player_id, label, outfit) VALUES (?, ?, ?)",
    [frameworkId, outfitName, result.outfit]
  );
  return { success: true, newId };
});
onClientCallback("bl_appearance:server:saveSkin", async (src, frameworkId, skin) => {
  const result = await import_oxmysql5.oxmysql.update(
    "UPDATE appearance SET skin = ? WHERE id = ?",
    [JSON.stringify(skin), frameworkId]
  );
  return result;
});
onClientCallback(
  "bl_appearance:server:saveClothes",
  async (src, frameworkId, clothes) => {
    const result = await import_oxmysql5.oxmysql.update(
      "UPDATE appearance SET clothes = ? WHERE id = ?",
      [JSON.stringify(clothes), frameworkId]
    );
    return result;
  }
);
onClientCallback("bl_appearance:server:saveAppearance", saveAppearance);
onClientCallback("bl_appearance:server:saveTattoos", async (src, frameworkId, tattoos) => {
  const result = await import_oxmysql5.oxmysql.update(
    "UPDATE appearance SET tattoos = ? WHERE id = ?",
    [JSON.stringify(tattoos), frameworkId]
  );
  return result;
});
onClientCallback("bl_appearance:server:getSkin", async (src, frameworkId) => {
  const response = await import_oxmysql5.oxmysql.prepare(
    "SELECT skin FROM appearance WHERE id = ?",
    [frameworkId]
  );
  return JSON.parse(response);
});
onClientCallback("bl_appearance:server:getClothes", async (src, frameworkId) => {
  const response = await import_oxmysql5.oxmysql.prepare(
    "SELECT clothes FROM appearance WHERE id = ?",
    [frameworkId]
  );
  return JSON.parse(response);
});
onClientCallback("bl_appearance:server:getTattoos", async (src, frameworkId) => {
  const response = await import_oxmysql5.oxmysql.prepare(
    "SELECT tattoos FROM appearance WHERE id = ?",
    [frameworkId]
  );
  return JSON.parse(response) || [];
});
onClientCallback("bl_appearance:server:getAppearance", async (src, frameworkId) => {
  const response = await import_oxmysql5.oxmysql.single(
    "SELECT * FROM appearance WHERE id = ? LIMIT 1",
    [frameworkId]
  );
  if (!response)
    return null;
  let appearance = {
    ...JSON.parse(response.skin),
    ...JSON.parse(response.clothes),
    ...JSON.parse(response.tattoos)
  };
  appearance.id = response.id;
  return appearance;
});
onNet("bl_appearance:server:setroutingbucket", () => {
  SetPlayerRoutingBucket(source.toString(), source);
});
onNet("bl_appearance:server:resetroutingbucket", () => {
  SetPlayerRoutingBucket(source.toString(), 0);
});
RegisterCommand("migrate", async (source2) => {
  source2 = source2 !== 0 ? source2 : parseInt(getPlayers()[0]);
  const bl_appearance = exports.bl_appearance;
  const config = bl_appearance.config();
  const importedModule = await globImport_migrate_ts(`./migrate/${config.previousClothing === "fivem-appearance" ? "fivem" : config.previousClothing}.ts`);
  importedModule.default(source2);
}, false);
core.RegisterUsableItem("cloth", async (source2, slot, metadata) => {
  const player = core.GetPlayer(source2);
  if (player?.removeItem("cloth", 1, slot))
    emitNet("bl_appearance:server:useOutfit", source2, metadata.outfit);
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc3JjL3NlcnZlci91dGlscy9pbmRleC50cyIsICIuLi8uLi9ub2RlX21vZHVsZXMvQG92ZXJleHRlbmRlZC9veG15c3FsL015U1FMLnRzIiwgIi4uLy4uL3NyYy9zZXJ2ZXIvYXBwZWFyYW5jZS50cyIsICIuLi8uLi9zcmMvc2VydmVyL21pZ3JhdGUvZXN4LnRzIiwgIi4uLy4uL3NyYy9zZXJ2ZXIvbWlncmF0ZS9maXZlbS50cyIsICIuLi8uLi9zcmMvc2VydmVyL21pZ3JhdGUvaWxsZW5pdW0udHMiLCAiLi4vLi4vc3JjL3NlcnZlci9taWdyYXRlL3FiLnRzIiwgIi4uLy4uL3NyYy9zZXJ2ZXIvaW5pdC50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy9odHRwczovL2dpdGh1Yi5jb20vb3ZlcmV4dGVuZGVkL294X2xpYi9ibG9iL21hc3Rlci9wYWNrYWdlL3NlcnZlci9yZXNvdXJjZS9jYWxsYmFjay9pbmRleC50c1xyXG5cclxuY29uc3QgcmVzb3VyY2VOYW1lID0gR2V0Q3VycmVudFJlc291cmNlTmFtZSgpXHJcblxyXG5jb25zdCBhY3RpdmVFdmVudHMgPSB7fTtcclxub25OZXQoYF9ibF9jYl8ke3Jlc291cmNlTmFtZX1gLCAoa2V5LCAuLi5hcmdzKSA9PiB7XHJcbiAgICBjb25zdCByZXNvbHZlID0gYWN0aXZlRXZlbnRzW2tleV07XHJcbiAgICByZXR1cm4gcmVzb2x2ZSAmJiByZXNvbHZlKC4uLmFyZ3MpO1xyXG59KTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB0cmlnZ2VyQ2xpZW50Q2FsbGJhY2soZXZlbnROYW1lOiBzdHJpbmcsIHBsYXllcklkOiBzdHJpbmcsIC4uLmFyZ3M6IGFueVtdKSB7XHJcbiAgICBsZXQga2V5OiBzdHJpbmc7XHJcbiAgICBkbyB7XHJcbiAgICAgICAga2V5ID0gYCR7ZXZlbnROYW1lfToke01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqICgxMDAwMDAgKyAxKSl9OiR7cGxheWVySWR9YDtcclxuICAgIH0gd2hpbGUgKGFjdGl2ZUV2ZW50c1trZXldKTtcclxuICAgIGVtaXROZXQoYF9ibF9jYl8ke2V2ZW50TmFtZX1gLCBwbGF5ZXJJZCwgcmVzb3VyY2VOYW1lLCBrZXksIC4uLmFyZ3MpO1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgYWN0aXZlRXZlbnRzW2tleV0gPSByZXNvbHZlO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBvbkNsaWVudENhbGxiYWNrKGV2ZW50TmFtZTogc3RyaW5nLCBjYjogKHBsYXllcklkOiBudW1iZXIsIC4uLmFyZ3M6IGFueVtdKSA9PiBhbnkpIHtcclxuICAgIG9uTmV0KGBfYmxfY2JfJHtldmVudE5hbWV9YCwgYXN5bmMgKHJlc291cmNlOiBzdHJpbmcsIGtleTogc3RyaW5nLCAuLi5hcmdzOiBhbnlbXSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHNyYyA9IHNvdXJjZTtcclxuICAgICAgICBsZXQgcmVzcG9uc2U6IGFueTtcclxuICAgIFxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICByZXNwb25zZSA9IGF3YWl0IGNiKHNyYywgLi4uYXJncyk7XHJcbiAgICAgICAgfSBjYXRjaCAoZTogYW55KSB7XHJcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGBhbiBlcnJvciBvY2N1cnJlZCB3aGlsZSBoYW5kbGluZyBjYWxsYmFjayBldmVudCAke2V2ZW50TmFtZX1gKTtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKGBeMyR7ZS5zdGFja31eMGApO1xyXG4gICAgICAgIH1cclxuICAgIFxyXG4gICAgICAgIGVtaXROZXQoYF9ibF9jYl8ke3Jlc291cmNlfWAsIHNyYywga2V5LCByZXNwb25zZSk7XHJcbiAgICAgIH0pO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgY29yZSA9IGV4cG9ydHMuYmxfYnJpZGdlLmNvcmUoKVxyXG4iLCAidHlwZSBRdWVyeSA9IHN0cmluZyB8IG51bWJlcjtcclxudHlwZSBQYXJhbXMgPSBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiB8IHVua25vd25bXSB8IEZ1bmN0aW9uO1xyXG50eXBlIENhbGxiYWNrPFQ+ID0gKHJlc3VsdDogVCB8IG51bGwpID0+IHZvaWQ7XHJcblxyXG50eXBlIFRyYW5zYWN0aW9uID1cclxuICB8IHN0cmluZ1tdXHJcbiAgfCBbc3RyaW5nLCBQYXJhbXNdW11cclxuICB8IHsgcXVlcnk6IHN0cmluZzsgdmFsdWVzOiBQYXJhbXMgfVtdXHJcbiAgfCB7IHF1ZXJ5OiBzdHJpbmc7IHBhcmFtZXRlcnM6IFBhcmFtcyB9W107XHJcblxyXG5pbnRlcmZhY2UgUmVzdWx0IHtcclxuICBbY29sdW1uOiBzdHJpbmcgfCBudW1iZXJdOiBhbnk7XHJcbiAgYWZmZWN0ZWRSb3dzPzogbnVtYmVyO1xyXG4gIGZpZWxkQ291bnQ/OiBudW1iZXI7XHJcbiAgaW5mbz86IHN0cmluZztcclxuICBpbnNlcnRJZD86IG51bWJlcjtcclxuICBzZXJ2ZXJTdGF0dXM/OiBudW1iZXI7XHJcbiAgd2FybmluZ1N0YXR1cz86IG51bWJlcjtcclxuICBjaGFuZ2VkUm93cz86IG51bWJlcjtcclxufVxyXG5cclxuaW50ZXJmYWNlIFJvdyB7XHJcbiAgW2NvbHVtbjogc3RyaW5nIHwgbnVtYmVyXTogdW5rbm93bjtcclxufVxyXG5cclxuaW50ZXJmYWNlIE94TXlTUUwge1xyXG4gIHN0b3JlOiAocXVlcnk6IHN0cmluZykgPT4gdm9pZDtcclxuICByZWFkeTogKGNhbGxiYWNrOiAoKSA9PiB2b2lkKSA9PiB2b2lkO1xyXG4gIHF1ZXJ5OiA8VCA9IFJlc3VsdCB8IG51bGw+KHF1ZXJ5OiBRdWVyeSwgcGFyYW1zPzogUGFyYW1zIHwgQ2FsbGJhY2s8VD4sIGNiPzogQ2FsbGJhY2s8VD4pID0+IFByb21pc2U8VD47XHJcbiAgc2luZ2xlOiA8VCA9IFJvdyB8IG51bGw+KFxyXG4gICAgcXVlcnk6IFF1ZXJ5LFxyXG4gICAgcGFyYW1zPzogUGFyYW1zIHwgQ2FsbGJhY2s8RXhjbHVkZTxULCBbXT4+LFxyXG4gICAgY2I/OiBDYWxsYmFjazxFeGNsdWRlPFQsIFtdPj5cclxuICApID0+IFByb21pc2U8RXhjbHVkZTxULCBbXT4+O1xyXG4gIHNjYWxhcjogPFQgPSB1bmtub3duIHwgbnVsbD4oXHJcbiAgICBxdWVyeTogUXVlcnksXHJcbiAgICBwYXJhbXM/OiBQYXJhbXMgfCBDYWxsYmFjazxFeGNsdWRlPFQsIFtdPj4sXHJcbiAgICBjYj86IENhbGxiYWNrPEV4Y2x1ZGU8VCwgW10+PlxyXG4gICkgPT4gUHJvbWlzZTxFeGNsdWRlPFQsIFtdPj47XHJcbiAgdXBkYXRlOiA8VCA9IG51bWJlciB8IG51bGw+KHF1ZXJ5OiBRdWVyeSwgcGFyYW1zPzogUGFyYW1zIHwgQ2FsbGJhY2s8VD4sIGNiPzogQ2FsbGJhY2s8VD4pID0+IFByb21pc2U8VD47XHJcbiAgaW5zZXJ0OiA8VCA9IG51bWJlciB8IG51bGw+KHF1ZXJ5OiBRdWVyeSwgcGFyYW1zPzogUGFyYW1zIHwgQ2FsbGJhY2s8VD4sIGNiPzogQ2FsbGJhY2s8VD4pID0+IFByb21pc2U8VD47XHJcbiAgcHJlcGFyZTogPFQgPSBhbnk+KHF1ZXJ5OiBRdWVyeSwgcGFyYW1zPzogUGFyYW1zIHwgQ2FsbGJhY2s8VD4sIGNiPzogQ2FsbGJhY2s8VD4pID0+IFByb21pc2U8VD47XHJcbiAgcmF3RXhlY3V0ZTogPFQgPSBSZXN1bHQgfCBudWxsPihxdWVyeTogUXVlcnksIHBhcmFtcz86IFBhcmFtcyB8IENhbGxiYWNrPFQ+LCBjYj86IENhbGxiYWNrPFQ+KSA9PiBQcm9taXNlPFQ+O1xyXG4gIHRyYW5zYWN0aW9uOiAocXVlcnk6IFRyYW5zYWN0aW9uLCBwYXJhbXM/OiBQYXJhbXMgfCBDYWxsYmFjazxib29sZWFuPiwgY2I/OiBDYWxsYmFjazxib29sZWFuPikgPT4gUHJvbWlzZTxib29sZWFuPjtcclxuICBpc1JlYWR5OiAoKSA9PiBib29sZWFuO1xyXG4gIGF3YWl0Q29ubmVjdGlvbjogKCkgPT4gUHJvbWlzZTx0cnVlPjtcclxufVxyXG5cclxuY29uc3QgUXVlcnlTdG9yZTogc3RyaW5nW10gPSBbXTtcclxuXHJcbmZ1bmN0aW9uIGFzc2VydChjb25kaXRpb246IGJvb2xlYW4sIG1lc3NhZ2U6IHN0cmluZykge1xyXG4gIGlmICghY29uZGl0aW9uKSB0aHJvdyBuZXcgVHlwZUVycm9yKG1lc3NhZ2UpO1xyXG59XHJcblxyXG5jb25zdCBzYWZlQXJncyA9IChxdWVyeTogUXVlcnkgfCBUcmFuc2FjdGlvbiwgcGFyYW1zPzogYW55LCBjYj86IEZ1bmN0aW9uLCB0cmFuc2FjdGlvbj86IHRydWUpID0+IHtcclxuICBpZiAodHlwZW9mIHF1ZXJ5ID09PSAnbnVtYmVyJykgcXVlcnkgPSBRdWVyeVN0b3JlW3F1ZXJ5XTtcclxuXHJcbiAgaWYgKHRyYW5zYWN0aW9uKSB7XHJcbiAgICBhc3NlcnQodHlwZW9mIHF1ZXJ5ID09PSAnb2JqZWN0JywgYEZpcnN0IGFyZ3VtZW50IGV4cGVjdGVkIG9iamVjdCwgcmVjaWV2ZWQgJHt0eXBlb2YgcXVlcnl9YCk7XHJcbiAgfSBlbHNlIHtcclxuICAgIGFzc2VydCh0eXBlb2YgcXVlcnkgPT09ICdzdHJpbmcnLCBgRmlyc3QgYXJndW1lbnQgZXhwZWN0ZWQgc3RyaW5nLCByZWNlaXZlZCAke3R5cGVvZiBxdWVyeX1gKTtcclxuICB9XHJcblxyXG4gIGlmIChwYXJhbXMpIHtcclxuICAgIGNvbnN0IHBhcmFtVHlwZSA9IHR5cGVvZiBwYXJhbXM7XHJcbiAgICBhc3NlcnQoXHJcbiAgICAgIHBhcmFtVHlwZSA9PT0gJ29iamVjdCcgfHwgcGFyYW1UeXBlID09PSAnZnVuY3Rpb24nLFxyXG4gICAgICBgU2Vjb25kIGFyZ3VtZW50IGV4cGVjdGVkIG9iamVjdCBvciBmdW5jdGlvbiwgcmVjZWl2ZWQgJHtwYXJhbVR5cGV9YFxyXG4gICAgKTtcclxuXHJcbiAgICBpZiAoIWNiICYmIHBhcmFtVHlwZSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICBjYiA9IHBhcmFtcztcclxuICAgICAgcGFyYW1zID0gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaWYgKGNiICE9PSB1bmRlZmluZWQpIGFzc2VydCh0eXBlb2YgY2IgPT09ICdmdW5jdGlvbicsIGBUaGlyZCBhcmd1bWVudCBleHBlY3RlZCBmdW5jdGlvbiwgcmVjZWl2ZWQgJHt0eXBlb2YgY2J9YCk7XHJcblxyXG4gIHJldHVybiBbcXVlcnksIHBhcmFtcywgY2JdO1xyXG59O1xyXG5cclxuY29uc3QgZXhwID0gZ2xvYmFsLmV4cG9ydHMub3hteXNxbDtcclxuY29uc3QgY3VycmVudFJlc291cmNlTmFtZSA9IEdldEN1cnJlbnRSZXNvdXJjZU5hbWUoKTtcclxuXHJcbmZ1bmN0aW9uIGV4ZWN1dGUobWV0aG9kOiBzdHJpbmcsIHF1ZXJ5OiBRdWVyeSB8IFRyYW5zYWN0aW9uLCBwYXJhbXM/OiBQYXJhbXMpIHtcclxuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgZXhwW21ldGhvZF0oXHJcbiAgICAgIHF1ZXJ5LFxyXG4gICAgICBwYXJhbXMsXHJcbiAgICAgIChyZXN1bHQsIGVycm9yKSA9PiB7XHJcbiAgICAgICAgaWYgKGVycm9yKSByZXR1cm4gcmVqZWN0KGVycm9yKTtcclxuICAgICAgICByZXNvbHZlKHJlc3VsdCk7XHJcbiAgICAgIH0sXHJcbiAgICAgIGN1cnJlbnRSZXNvdXJjZU5hbWUsXHJcbiAgICAgIHRydWVcclxuICAgICk7XHJcbiAgfSkgYXMgYW55O1xyXG59XHJcblxyXG5leHBvcnQgY29uc3Qgb3hteXNxbDogT3hNeVNRTCA9IHtcclxuICBzdG9yZShxdWVyeSkge1xyXG4gICAgYXNzZXJ0KHR5cGVvZiBxdWVyeSAhPT0gJ3N0cmluZycsIGBRdWVyeSBleHBlY3RzIGEgc3RyaW5nLCByZWNlaXZlZCAke3R5cGVvZiBxdWVyeX1gKTtcclxuXHJcbiAgICByZXR1cm4gUXVlcnlTdG9yZS5wdXNoKHF1ZXJ5KTtcclxuICB9LFxyXG4gIHJlYWR5KGNhbGxiYWNrKSB7XHJcbiAgICBzZXRJbW1lZGlhdGUoYXN5bmMgKCkgPT4ge1xyXG4gICAgICB3aGlsZSAoR2V0UmVzb3VyY2VTdGF0ZSgnb3hteXNxbCcpICE9PSAnc3RhcnRlZCcpIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDUwKSk7XHJcbiAgICAgIGNhbGxiYWNrKCk7XHJcbiAgICB9KTtcclxuICB9LFxyXG4gIGFzeW5jIHF1ZXJ5KHF1ZXJ5LCBwYXJhbXMsIGNiKSB7XHJcbiAgICBbcXVlcnksIHBhcmFtcywgY2JdID0gc2FmZUFyZ3MocXVlcnksIHBhcmFtcywgY2IpO1xyXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgZXhlY3V0ZSgncXVlcnknLCBxdWVyeSwgcGFyYW1zKTtcclxuICAgIHJldHVybiBjYiA/IGNiKHJlc3VsdCkgOiByZXN1bHQ7XHJcbiAgfSxcclxuICBhc3luYyBzaW5nbGUocXVlcnksIHBhcmFtcywgY2IpIHtcclxuICAgIFtxdWVyeSwgcGFyYW1zLCBjYl0gPSBzYWZlQXJncyhxdWVyeSwgcGFyYW1zLCBjYik7XHJcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBleGVjdXRlKCdzaW5nbGUnLCBxdWVyeSwgcGFyYW1zKTtcclxuICAgIHJldHVybiBjYiA/IGNiKHJlc3VsdCkgOiByZXN1bHQ7XHJcbiAgfSxcclxuICBhc3luYyBzY2FsYXIocXVlcnksIHBhcmFtcywgY2IpIHtcclxuICAgIFtxdWVyeSwgcGFyYW1zLCBjYl0gPSBzYWZlQXJncyhxdWVyeSwgcGFyYW1zLCBjYik7XHJcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBleGVjdXRlKCdzY2FsYXInLCBxdWVyeSwgcGFyYW1zKTtcclxuICAgIHJldHVybiBjYiA/IGNiKHJlc3VsdCkgOiByZXN1bHQ7XHJcbiAgfSxcclxuICBhc3luYyB1cGRhdGUocXVlcnksIHBhcmFtcywgY2IpIHtcclxuICAgIFtxdWVyeSwgcGFyYW1zLCBjYl0gPSBzYWZlQXJncyhxdWVyeSwgcGFyYW1zLCBjYik7XHJcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBleGVjdXRlKCd1cGRhdGUnLCBxdWVyeSwgcGFyYW1zKTtcclxuICAgIHJldHVybiBjYiA/IGNiKHJlc3VsdCkgOiByZXN1bHQ7XHJcbiAgfSxcclxuICBhc3luYyBpbnNlcnQocXVlcnksIHBhcmFtcywgY2IpIHtcclxuICAgIFtxdWVyeSwgcGFyYW1zLCBjYl0gPSBzYWZlQXJncyhxdWVyeSwgcGFyYW1zLCBjYik7XHJcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBleGVjdXRlKCdpbnNlcnQnLCBxdWVyeSwgcGFyYW1zKTtcclxuICAgIHJldHVybiBjYiA/IGNiKHJlc3VsdCkgOiByZXN1bHQ7XHJcbiAgfSxcclxuICBhc3luYyBwcmVwYXJlKHF1ZXJ5LCBwYXJhbXMsIGNiKSB7XHJcbiAgICBbcXVlcnksIHBhcmFtcywgY2JdID0gc2FmZUFyZ3MocXVlcnksIHBhcmFtcywgY2IpO1xyXG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgZXhlY3V0ZSgncHJlcGFyZScsIHF1ZXJ5LCBwYXJhbXMpO1xyXG4gICAgcmV0dXJuIGNiID8gY2IocmVzdWx0KSA6IHJlc3VsdDtcclxuICB9LFxyXG4gIGFzeW5jIHJhd0V4ZWN1dGUocXVlcnksIHBhcmFtcywgY2IpIHtcclxuICAgIFtxdWVyeSwgcGFyYW1zLCBjYl0gPSBzYWZlQXJncyhxdWVyeSwgcGFyYW1zLCBjYik7XHJcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBleGVjdXRlKCdyYXdFeGVjdXRlJywgcXVlcnksIHBhcmFtcyk7XHJcbiAgICByZXR1cm4gY2IgPyBjYihyZXN1bHQpIDogcmVzdWx0O1xyXG4gIH0sXHJcbiAgYXN5bmMgdHJhbnNhY3Rpb24ocXVlcnksIHBhcmFtcywgY2IpIHtcclxuICAgIFtxdWVyeSwgcGFyYW1zLCBjYl0gPSBzYWZlQXJncyhxdWVyeSwgcGFyYW1zLCBjYiwgdHJ1ZSk7XHJcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBleGVjdXRlKCd0cmFuc2FjdGlvbicsIHF1ZXJ5LCBwYXJhbXMpO1xyXG4gICAgcmV0dXJuIGNiID8gY2IocmVzdWx0KSA6IHJlc3VsdDtcclxuICB9LFxyXG4gIGlzUmVhZHkoKSB7XHJcbiAgICByZXR1cm4gZXhwLmlzUmVhZHkoKTtcclxuICB9LFxyXG4gIGFzeW5jIGF3YWl0Q29ubmVjdGlvbigpIHtcclxuICAgIHJldHVybiBhd2FpdCBleHAuYXdhaXRDb25uZWN0aW9uKCk7XHJcbiAgfSxcclxufTtcclxuIiwgImltcG9ydCB7IFRBcHBlYXJhbmNlIH0gZnJvbSAnQHR5cGluZ3MvYXBwZWFyYW5jZSc7XG5pbXBvcnQgeyBveG15c3FsIH0gZnJvbSAnQG92ZXJleHRlbmRlZC9veG15c3FsJztcblxuZXhwb3J0IGNvbnN0IHNhdmVBcHBlYXJhbmNlID0gYXN5bmMgKHNyYzogc3RyaW5nIHwgbnVtYmVyLCBmcmFtZXdvcmtJZDogc3RyaW5nLCBhcHBlYXJhbmNlOiBUQXBwZWFyYW5jZSkgPT4ge1xuXHRjb25zdCBjbG90aGVzID0ge1xuXHRcdGRyYXdhYmxlczogYXBwZWFyYW5jZS5kcmF3YWJsZXMsXG5cdFx0cHJvcHM6IGFwcGVhcmFuY2UucHJvcHMsXG5cdFx0aGVhZE92ZXJsYXk6IGFwcGVhcmFuY2UuaGVhZE92ZXJsYXksXG5cdH07XG5cblx0Y29uc3Qgc2tpbiA9IHtcblx0XHRoZWFkQmxlbmQ6IGFwcGVhcmFuY2UuaGVhZEJsZW5kLFxuXHRcdGhlYWRTdHJ1Y3R1cmU6IGFwcGVhcmFuY2UuaGVhZFN0cnVjdHVyZSxcblx0XHRoYWlyQ29sb3I6IGFwcGVhcmFuY2UuaGFpckNvbG9yLFxuXHRcdG1vZGVsOiBhcHBlYXJhbmNlLm1vZGVsLFxuXHR9O1xuXG5cdGNvbnN0IHRhdHRvb3MgPSBhcHBlYXJhbmNlLnRhdHRvb3MgfHwgW107XG5cblx0Y29uc3QgcmVzdWx0ID0gYXdhaXQgb3hteXNxbC5wcmVwYXJlKFxuXHRcdCdJTlNFUlQgSU5UTyBhcHBlYXJhbmNlIChpZCwgY2xvdGhlcywgc2tpbiwgdGF0dG9vcykgVkFMVUVTICg/LCA/LCA/LCA/KSBPTiBEVVBMSUNBVEUgS0VZIFVQREFURSBjbG90aGVzID0gVkFMVUVTKGNsb3RoZXMpLCBza2luID0gVkFMVUVTKHNraW4pLCB0YXR0b29zID0gVkFMVUVTKHRhdHRvb3MpOycsXG5cdFx0W1xuXHRcdFx0ZnJhbWV3b3JrSWQsXG5cdFx0XHRKU09OLnN0cmluZ2lmeShjbG90aGVzKSxcblx0XHRcdEpTT04uc3RyaW5naWZ5KHNraW4pLFxuXHRcdFx0SlNPTi5zdHJpbmdpZnkodGF0dG9vcyksXG5cdFx0XVxuXHQpO1xuXG5cdHJldHVybiByZXN1bHQ7XG59IiwgIiIsICJpbXBvcnQgeyBveG15c3FsIH0gZnJvbSAnQG92ZXJleHRlbmRlZC9veG15c3FsJztcbmltcG9ydCB7IHRyaWdnZXJDbGllbnRDYWxsYmFjayB9IGZyb20gJy4uL3V0aWxzJztcbmltcG9ydCB7IHNhdmVBcHBlYXJhbmNlIH0gZnJvbSAnLi4vYXBwZWFyYW5jZSc7XG5pbXBvcnQgeyBUQXBwZWFyYW5jZSB9IGZyb20gJ0B0eXBpbmdzL2FwcGVhcmFuY2UnO1xuXG5jb25zdCBkZWxheSA9IChtczogbnVtYmVyKSA9PiBuZXcgUHJvbWlzZShyZXMgPT4gc2V0VGltZW91dChyZXMsIG1zKSk7XG5cbmNvbnN0IG1pZ3JhdGUgPSBhc3luYyAoc3JjOiBzdHJpbmcpID0+IHtcbiAgICBjb25zdCByZXNwb25zZTogYW55ID0gYXdhaXQgb3hteXNxbC5xdWVyeSgnU0VMRUNUICogRlJPTSBgcGxheWVyc2AnKTtcbiAgICBpZiAoIXJlc3BvbnNlKSByZXR1cm47XG5cbiAgICBmb3IgKGNvbnN0IGVsZW1lbnQgb2YgcmVzcG9uc2UpIHtcbiAgICAgICAgaWYgKGVsZW1lbnQuc2tpbikge1xuICAgICAgICAgICAgYXdhaXQgdHJpZ2dlckNsaWVudENhbGxiYWNrKCdibF9hcHBlYXJhbmNlOmNsaWVudDptaWdyYXRpb246c2V0QXBwZWFyYW5jZScsIHNyYywge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdmaXZlbScsXG4gICAgICAgICAgICAgICAgZGF0YTogSlNPTi5wYXJzZShlbGVtZW50LnNraW4pXG4gICAgICAgICAgICB9KSBhcyBUQXBwZWFyYW5jZVxuICAgICAgICAgICAgYXdhaXQgZGVsYXkoMTAwKTtcbiAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgdHJpZ2dlckNsaWVudENhbGxiYWNrKCdibF9hcHBlYXJhbmNlOmNsaWVudDpnZXRBcHBlYXJhbmNlJywgc3JjKSBhcyBUQXBwZWFyYW5jZVxuICAgICAgICAgICAgYXdhaXQgc2F2ZUFwcGVhcmFuY2Uoc3JjLCBlbGVtZW50LmNpdGl6ZW5pZCwgcmVzcG9uc2UpXG4gICAgICAgIH1cbiAgICB9XG4gICAgY29uc29sZS5sb2coJ0NvbnZlcnRlZCAnKyByZXNwb25zZS5sZW5ndGggKyAnIGFwcGVhcmFuY2VzJylcbn07XG5cbmV4cG9ydCBkZWZhdWx0IG1pZ3JhdGUiLCAiaW1wb3J0IHsgb3hteXNxbCB9IGZyb20gJ0BvdmVyZXh0ZW5kZWQvb3hteXNxbCc7XG5pbXBvcnQgeyB0cmlnZ2VyQ2xpZW50Q2FsbGJhY2sgfSBmcm9tICcuLi91dGlscyc7XG5pbXBvcnQgeyBzYXZlQXBwZWFyYW5jZSB9IGZyb20gJy4uL2FwcGVhcmFuY2UnO1xuaW1wb3J0IHsgVEFwcGVhcmFuY2UgfSBmcm9tICdAdHlwaW5ncy9hcHBlYXJhbmNlJztcblxuY29uc3QgZGVsYXkgPSAobXM6IG51bWJlcikgPT4gbmV3IFByb21pc2UocmVzID0+IHNldFRpbWVvdXQocmVzLCBtcykpO1xuXG5jb25zdCBtaWdyYXRlID0gYXN5bmMgKHNyYzogc3RyaW5nKSA9PiB7XG4gICAgY29uc3QgcmVzcG9uc2U6IGFueSA9IGF3YWl0IG94bXlzcWwucXVlcnkoJ1NFTEVDVCAqIEZST00gYHBsYXllcnNraW5zYCBXSEVSRSBhY3RpdmUgPSAxJyk7XG4gICAgaWYgKCFyZXNwb25zZSkgcmV0dXJuO1xuXG4gICAgZm9yIChjb25zdCBlbGVtZW50IG9mIHJlc3BvbnNlKSB7XG4gICAgICAgIGlmIChlbGVtZW50LnNraW4pIHtcbiAgICAgICAgICAgIGF3YWl0IHRyaWdnZXJDbGllbnRDYWxsYmFjaygnYmxfYXBwZWFyYW5jZTpjbGllbnQ6bWlncmF0aW9uOnNldEFwcGVhcmFuY2UnLCBzcmMsIHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnaWxsZW5pdW0nLFxuICAgICAgICAgICAgICAgIGRhdGE6IEpTT04ucGFyc2UoZWxlbWVudC5za2luKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIGF3YWl0IGRlbGF5KDEwMCk7XG4gICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHRyaWdnZXJDbGllbnRDYWxsYmFjaygnYmxfYXBwZWFyYW5jZTpjbGllbnQ6Z2V0QXBwZWFyYW5jZScsIHNyYykgYXMgVEFwcGVhcmFuY2VcbiAgICAgICAgICAgIGF3YWl0IHNhdmVBcHBlYXJhbmNlKHNyYywgZWxlbWVudC5jaXRpemVuaWQsIHJlc3BvbnNlKVxuICAgICAgICB9XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKCdDb252ZXJ0ZWQgJysgcmVzcG9uc2UubGVuZ3RoICsgJyBhcHBlYXJhbmNlcycpXG59O1xuXG5leHBvcnQgZGVmYXVsdCBtaWdyYXRlIiwgImltcG9ydCB7IG94bXlzcWwgfSBmcm9tICdAb3ZlcmV4dGVuZGVkL294bXlzcWwnO1xuaW1wb3J0IHsgdHJpZ2dlckNsaWVudENhbGxiYWNrIH0gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IHsgc2F2ZUFwcGVhcmFuY2UgfSBmcm9tICcuLi9hcHBlYXJhbmNlJztcbmltcG9ydCB7IFRBcHBlYXJhbmNlIH0gZnJvbSAnQHR5cGluZ3MvYXBwZWFyYW5jZSc7XG5cbmNvbnN0IGRlbGF5ID0gKG1zOiBudW1iZXIpID0+IG5ldyBQcm9taXNlKHJlcyA9PiBzZXRUaW1lb3V0KHJlcywgbXMpKTtcblxuY29uc3QgbWlncmF0ZSA9IGFzeW5jIChzcmM6IHN0cmluZykgPT4ge1xuICAgIGNvbnN0IHJlc3BvbnNlOiBhbnkgPSBhd2FpdCBveG15c3FsLnF1ZXJ5KCdTRUxFQ1QgKiBGUk9NIGBwbGF5ZXJza2luc2AgV0hFUkUgYWN0aXZlID0gMScpO1xuICAgIGlmICghcmVzcG9uc2UpIHJldHVybjtcblxuICAgIGZvciAoY29uc3QgZWxlbWVudCBvZiByZXNwb25zZSkge1xuICAgICAgICBlbWl0TmV0KCdxYi1jbG90aGVzOmxvYWRTa2luJywgc3JjLCAwLCBlbGVtZW50Lm1vZGVsLCBlbGVtZW50LnNraW4pO1xuICAgICAgICBhd2FpdCBkZWxheSgyMDApO1xuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHRyaWdnZXJDbGllbnRDYWxsYmFjaygnYmxfYXBwZWFyYW5jZTpjbGllbnQ6Z2V0QXBwZWFyYW5jZScsIHNyYykgYXMgVEFwcGVhcmFuY2VcbiAgICAgICAgYXdhaXQgc2F2ZUFwcGVhcmFuY2Uoc3JjLCBlbGVtZW50LmNpdGl6ZW5pZCwgcmVzcG9uc2UpXG4gICAgfVxuICAgIGNvbnNvbGUubG9nKCdDb252ZXJ0ZWQgJysgcmVzcG9uc2UubGVuZ3RoICsgJyBhcHBlYXJhbmNlcycpXG59O1xuXG5leHBvcnQgZGVmYXVsdCBtaWdyYXRlIiwgImltcG9ydCB7IGNvcmUsIG9uQ2xpZW50Q2FsbGJhY2sgfSBmcm9tICcuL3V0aWxzJztcclxuaW1wb3J0IHsgb3hteXNxbCB9IGZyb20gJ0BvdmVyZXh0ZW5kZWQvb3hteXNxbCc7XHJcbmltcG9ydCB7IE91dGZpdCB9IGZyb20gJ0B0eXBpbmdzL291dGZpdHMnO1xyXG5pbXBvcnQgeyBzYXZlQXBwZWFyYW5jZSB9IGZyb20gJy4vYXBwZWFyYW5jZSc7XHJcbmltcG9ydCB7IFNraW5EQiB9IGZyb20gJ0B0eXBpbmdzL2FwcGVhcmFuY2UnO1xyXG5cclxub25DbGllbnRDYWxsYmFjaygnYmxfYXBwZWFyYW5jZTpzZXJ2ZXI6Z2V0T3V0Zml0cycsIGFzeW5jIChzcmMsIGZyYW1ld29ya0lkKSA9PiB7XHJcbiAgICBjb25zdCBqb2IgPSBjb3JlLkdldFBsYXllcihzcmMpLmpvYiB8fCB7IG5hbWU6ICd1bmtub3duJywgZ3JhZGU6IHsgbmFtZTogJ3Vua25vd24nIH0gfVxyXG5cdGxldCByZXNwb25zZSA9IGF3YWl0IG94bXlzcWwucHJlcGFyZShcclxuXHRcdCdTRUxFQ1QgKiBGUk9NIG91dGZpdHMgV0hFUkUgcGxheWVyX2lkID0gPyBPUiAoam9ibmFtZSA9ID8gQU5EIGpvYnJhbmsgPD0gPyknLFxyXG5cdFx0W2ZyYW1ld29ya0lkLCBqb2IubmFtZSwgam9iLmdyYWRlLm5hbWVdXHJcblx0KTtcclxuXHRpZiAoIXJlc3BvbnNlKSByZXR1cm4gW107XHJcblxyXG5cdGlmICghQXJyYXkuaXNBcnJheShyZXNwb25zZSkpIHtcclxuXHRcdHJlc3BvbnNlID0gW3Jlc3BvbnNlXTtcclxuXHR9XHJcblxyXG5cdGNvbnN0IG91dGZpdHMgPSByZXNwb25zZS5tYXAoXHJcblx0XHQob3V0Zml0OiB7IGlkOiBudW1iZXI7IGxhYmVsOiBzdHJpbmc7IG91dGZpdDogc3RyaW5nOyBqb2JuYW1lPzogc3RyaW5nIH0pID0+IHtcclxuXHRcdFx0cmV0dXJuIHtcclxuXHRcdFx0XHRpZDogb3V0Zml0LmlkLFxyXG5cdFx0XHRcdGxhYmVsOiBvdXRmaXQubGFiZWwsXHJcblx0XHRcdFx0b3V0Zml0OiBKU09OLnBhcnNlKG91dGZpdC5vdXRmaXQpLFxyXG5cdFx0XHRcdGpvYm5hbWU6IG91dGZpdC5qb2JuYW1lLFxyXG5cdFx0XHR9O1xyXG5cdFx0fVxyXG5cdCk7XHJcblxyXG5cdHJldHVybiBvdXRmaXRzO1xyXG59KTtcclxuXHJcbm9uQ2xpZW50Q2FsbGJhY2soJ2JsX2FwcGVhcmFuY2U6c2VydmVyOnJlbmFtZU91dGZpdCcsIGFzeW5jIChzcmMsIGZyYW1ld29ya0lkLCBkYXRhKSA9PiB7XHJcblx0Y29uc3QgaWQgPSBkYXRhLmlkO1xyXG5cdGNvbnN0IGxhYmVsID0gZGF0YS5sYWJlbDtcclxuXHJcblx0Y29uc3QgcmVzdWx0ID0gYXdhaXQgb3hteXNxbC51cGRhdGUoXHJcblx0XHQnVVBEQVRFIG91dGZpdHMgU0VUIGxhYmVsID0gPyBXSEVSRSBwbGF5ZXJfaWQgPSA/IEFORCBpZCA9ID8nLFxyXG5cdFx0W2xhYmVsLCBmcmFtZXdvcmtJZCwgaWRdXHJcblx0KTtcclxuXHRyZXR1cm4gcmVzdWx0O1xyXG59KTtcclxuXHJcbm9uQ2xpZW50Q2FsbGJhY2soJ2JsX2FwcGVhcmFuY2U6c2VydmVyOmRlbGV0ZU91dGZpdCcsIGFzeW5jIChzcmMsIGZyYW1ld29ya0lkLCBpZCkgPT4ge1xyXG5cdGNvbnN0IHJlc3VsdCA9IGF3YWl0IG94bXlzcWwudXBkYXRlKFxyXG5cdFx0J0RFTEVURSBGUk9NIG91dGZpdHMgV0hFUkUgcGxheWVyX2lkID0gPyBBTkQgaWQgPSA/JyxcclxuXHRcdFtmcmFtZXdvcmtJZCwgaWRdXHJcblx0KTtcclxuXHRyZXR1cm4gcmVzdWx0ID4gMDtcclxufSk7XHJcblxyXG5vbkNsaWVudENhbGxiYWNrKCdibF9hcHBlYXJhbmNlOnNlcnZlcjpzYXZlT3V0Zml0JywgYXN5bmMgKHNyYywgZnJhbWV3b3JrSWQsIGRhdGE6IE91dGZpdCkgPT4ge1xyXG4gICAgbGV0IGpvYm5hbWUgPSBudWxsXHJcbiAgICBsZXQgam9icmFuayA9IDBcclxuICAgIGlmIChkYXRhLmpvYikge1xyXG4gICAgICAgIGpvYm5hbWUgPSBkYXRhLmpvYi5uYW1lO1xyXG4gICAgICAgIGpvYnJhbmsgPSBkYXRhLmpvYi5yYW5rO1xyXG4gICAgfVxyXG5cdGNvbnN0IGlkID0gYXdhaXQgb3hteXNxbC5pbnNlcnQoXHJcblx0XHQnSU5TRVJUIElOVE8gb3V0Zml0cyAocGxheWVyX2lkLCBsYWJlbCwgb3V0Zml0LCBqb2JuYW1lLCBqb2JyYW5rKSBWQUxVRVMgKD8sID8sID8sID8sID8pJyxcclxuXHRcdFtmcmFtZXdvcmtJZCwgZGF0YS5sYWJlbCwgSlNPTi5zdHJpbmdpZnkoZGF0YS5vdXRmaXQpLCBqb2JuYW1lLCBqb2JyYW5rXVxyXG5cdCk7XHJcblx0cmV0dXJuIGlkO1xyXG59KTtcclxuXHJcbm9uQ2xpZW50Q2FsbGJhY2soJ2JsX2FwcGVhcmFuY2U6c2VydmVyOmdyYWJPdXRmaXQnLCBhc3luYyAoc3JjLCBpZCkgPT4ge1xyXG5cdGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgb3hteXNxbC5wcmVwYXJlKFxyXG5cdFx0J1NFTEVDVCBvdXRmaXQgRlJPTSBvdXRmaXRzIFdIRVJFIGlkID0gPycsXHJcblx0XHRbaWRdXHJcblx0KTtcclxuXHRyZXR1cm4gSlNPTi5wYXJzZShyZXNwb25zZSk7XHJcbn0pO1xyXG5cclxub25DbGllbnRDYWxsYmFjaygnYmxfYXBwZWFyYW5jZTpzZXJ2ZXI6aXRlbU91dGZpdCcsIGFzeW5jIChzcmMsIGRhdGEpID0+IHtcclxuXHRjb25zdCBwbGF5ZXIgPSBjb3JlLkdldFBsYXllcihzcmMpXHJcblx0cGxheWVyLmFkZEl0ZW0oJ2Nsb3RoJywgMSwgZGF0YSlcclxufSk7XHJcblxyXG5vbkNsaWVudENhbGxiYWNrKCdibF9hcHBlYXJhbmNlOnNlcnZlcjppbXBvcnRPdXRmaXQnLCBhc3luYyAoc3JjLCBmcmFtZXdvcmtJZCwgb3V0Zml0SWQsIG91dGZpdE5hbWUpID0+IHtcclxuICAgIGNvbnN0IFtyZXN1bHRdID0gYXdhaXQgb3hteXNxbC5xdWVyeShcclxuICAgICAgICAnU0VMRUNUIGxhYmVsLCBvdXRmaXQgRlJPTSBvdXRmaXRzIFdIRVJFIGlkID0gPycsXHJcbiAgICAgICAgW291dGZpdElkXVxyXG4gICAgKTtcclxuXHJcbiAgICBpZiAoIXJlc3VsdCkge1xyXG4gICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBtZXNzYWdlOiAnT3V0Zml0IG5vdCBmb3VuZCcgfTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBuZXdJZCA9IGF3YWl0IG94bXlzcWwuaW5zZXJ0KFxyXG4gICAgICAgICdJTlNFUlQgSU5UTyBvdXRmaXRzIChwbGF5ZXJfaWQsIGxhYmVsLCBvdXRmaXQpIFZBTFVFUyAoPywgPywgPyknLFxyXG4gICAgICAgIFtmcmFtZXdvcmtJZCwgb3V0Zml0TmFtZSwgcmVzdWx0Lm91dGZpdF1cclxuICAgICk7XHJcblxyXG4gICAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSwgbmV3SWQ6IG5ld0lkIH07XHJcbn0pO1xyXG5cclxub25DbGllbnRDYWxsYmFjaygnYmxfYXBwZWFyYW5jZTpzZXJ2ZXI6c2F2ZVNraW4nLCBhc3luYyAoc3JjLCBmcmFtZXdvcmtJZCwgc2tpbikgPT4ge1xyXG5cdGNvbnN0IHJlc3VsdCA9IGF3YWl0IG94bXlzcWwudXBkYXRlKFxyXG5cdFx0J1VQREFURSBhcHBlYXJhbmNlIFNFVCBza2luID0gPyBXSEVSRSBpZCA9ID8nLFxyXG5cdFx0W0pTT04uc3RyaW5naWZ5KHNraW4pLCBmcmFtZXdvcmtJZF1cclxuXHQpO1xyXG5cdHJldHVybiByZXN1bHQ7XHJcbn0pO1xyXG5cclxub25DbGllbnRDYWxsYmFjaygnYmxfYXBwZWFyYW5jZTpzZXJ2ZXI6c2F2ZUNsb3RoZXMnLCBhc3luYyAoc3JjLCBmcmFtZXdvcmtJZCwgY2xvdGhlcykgPT4ge1xyXG5cdFx0Y29uc3QgcmVzdWx0ID0gYXdhaXQgb3hteXNxbC51cGRhdGUoXHJcblx0XHRcdCdVUERBVEUgYXBwZWFyYW5jZSBTRVQgY2xvdGhlcyA9ID8gV0hFUkUgaWQgPSA/JyxcclxuXHRcdFx0W0pTT04uc3RyaW5naWZ5KGNsb3RoZXMpLCBmcmFtZXdvcmtJZF1cclxuXHRcdCk7XHJcblx0XHRyZXR1cm4gcmVzdWx0O1xyXG5cdH1cclxuKTtcclxuXHJcbm9uQ2xpZW50Q2FsbGJhY2soJ2JsX2FwcGVhcmFuY2U6c2VydmVyOnNhdmVBcHBlYXJhbmNlJywgc2F2ZUFwcGVhcmFuY2UpO1xyXG5cclxub25DbGllbnRDYWxsYmFjaygnYmxfYXBwZWFyYW5jZTpzZXJ2ZXI6c2F2ZVRhdHRvb3MnLCBhc3luYyAoc3JjLCBmcmFtZXdvcmtJZCwgdGF0dG9vcykgPT4ge1xyXG5cdGNvbnN0IHJlc3VsdCA9IGF3YWl0IG94bXlzcWwudXBkYXRlKFxyXG5cdFx0J1VQREFURSBhcHBlYXJhbmNlIFNFVCB0YXR0b29zID0gPyBXSEVSRSBpZCA9ID8nLFxyXG5cdFx0W0pTT04uc3RyaW5naWZ5KHRhdHRvb3MpLCBmcmFtZXdvcmtJZF1cclxuXHQpO1xyXG5cdHJldHVybiByZXN1bHQ7XHJcbn0pO1xyXG5cclxub25DbGllbnRDYWxsYmFjaygnYmxfYXBwZWFyYW5jZTpzZXJ2ZXI6Z2V0U2tpbicsIGFzeW5jIChzcmMsIGZyYW1ld29ya0lkKSA9PiB7XHJcblx0Y29uc3QgcmVzcG9uc2UgPSBhd2FpdCBveG15c3FsLnByZXBhcmUoXHJcblx0XHQnU0VMRUNUIHNraW4gRlJPTSBhcHBlYXJhbmNlIFdIRVJFIGlkID0gPycsXHJcblx0XHRbZnJhbWV3b3JrSWRdXHJcblx0KTtcclxuXHRyZXR1cm4gSlNPTi5wYXJzZShyZXNwb25zZSk7XHJcbn0pO1xyXG5cclxub25DbGllbnRDYWxsYmFjaygnYmxfYXBwZWFyYW5jZTpzZXJ2ZXI6Z2V0Q2xvdGhlcycsIGFzeW5jIChzcmMsIGZyYW1ld29ya0lkKSA9PiB7XHJcblx0Y29uc3QgcmVzcG9uc2UgPSBhd2FpdCBveG15c3FsLnByZXBhcmUoXHJcblx0XHQnU0VMRUNUIGNsb3RoZXMgRlJPTSBhcHBlYXJhbmNlIFdIRVJFIGlkID0gPycsXHJcblx0XHRbZnJhbWV3b3JrSWRdXHJcblx0KTtcclxuXHRyZXR1cm4gSlNPTi5wYXJzZShyZXNwb25zZSk7XHJcbn0pO1xyXG5cclxub25DbGllbnRDYWxsYmFjaygnYmxfYXBwZWFyYW5jZTpzZXJ2ZXI6Z2V0VGF0dG9vcycsIGFzeW5jIChzcmMsIGZyYW1ld29ya0lkKSA9PiB7XHJcblx0Y29uc3QgcmVzcG9uc2UgPSBhd2FpdCBveG15c3FsLnByZXBhcmUoXHJcblx0XHQnU0VMRUNUIHRhdHRvb3MgRlJPTSBhcHBlYXJhbmNlIFdIRVJFIGlkID0gPycsXHJcblx0XHRbZnJhbWV3b3JrSWRdXHJcblx0KTtcclxuXHRyZXR1cm4gSlNPTi5wYXJzZShyZXNwb25zZSkgfHwgW107XHJcbn0pO1xyXG5cclxub25DbGllbnRDYWxsYmFjaygnYmxfYXBwZWFyYW5jZTpzZXJ2ZXI6Z2V0QXBwZWFyYW5jZScsIGFzeW5jIChzcmMsIGZyYW1ld29ya0lkKSA9PiB7XHJcblx0Y29uc3QgcmVzcG9uc2U6IFNraW5EQiA9IGF3YWl0IG94bXlzcWwuc2luZ2xlKFxyXG5cdFx0J1NFTEVDVCAqIEZST00gYXBwZWFyYW5jZSBXSEVSRSBpZCA9ID8gTElNSVQgMScsXHJcblx0XHRbZnJhbWV3b3JrSWRdXHJcblx0KTtcclxuXHJcblx0aWYgKCFyZXNwb25zZSkgcmV0dXJuIG51bGw7XHJcblx0bGV0IGFwcGVhcmFuY2UgPSB7XHJcblx0XHQuLi5KU09OLnBhcnNlKHJlc3BvbnNlLnNraW4pLFxyXG5cdFx0Li4uSlNPTi5wYXJzZShyZXNwb25zZS5jbG90aGVzKSxcclxuXHRcdC4uLkpTT04ucGFyc2UocmVzcG9uc2UudGF0dG9vcyksXHJcblx0fVxyXG5cdGFwcGVhcmFuY2UuaWQgPSByZXNwb25zZS5pZFxyXG5cdHJldHVybiBhcHBlYXJhbmNlO1xyXG59KTtcclxuXHJcbm9uTmV0KCdibF9hcHBlYXJhbmNlOnNlcnZlcjpzZXRyb3V0aW5nYnVja2V0JywgKCkgPT4ge1xyXG5cdFNldFBsYXllclJvdXRpbmdCdWNrZXQoc291cmNlLnRvU3RyaW5nKCksIHNvdXJjZSlcclxufSk7XHJcblxyXG5vbk5ldCgnYmxfYXBwZWFyYW5jZTpzZXJ2ZXI6cmVzZXRyb3V0aW5nYnVja2V0JywgKCkgPT4ge1xyXG5cdFNldFBsYXllclJvdXRpbmdCdWNrZXQoc291cmNlLnRvU3RyaW5nKCksIDApXHJcbn0pO1xyXG5cclxuUmVnaXN0ZXJDb21tYW5kKCdtaWdyYXRlJywgYXN5bmMgKHNvdXJjZTogbnVtYmVyKSA9PiB7XHJcblx0c291cmNlID0gc291cmNlICE9PSAwID8gc291cmNlIDogcGFyc2VJbnQoZ2V0UGxheWVycygpWzBdKVxyXG5cdGNvbnN0IGJsX2FwcGVhcmFuY2UgPSBleHBvcnRzLmJsX2FwcGVhcmFuY2U7XHJcblx0Y29uc3QgY29uZmlnID0gYmxfYXBwZWFyYW5jZS5jb25maWcoKTtcclxuXHRjb25zdCBpbXBvcnRlZE1vZHVsZSA9IGF3YWl0IGltcG9ydChgLi9taWdyYXRlLyR7Y29uZmlnLnByZXZpb3VzQ2xvdGhpbmcgPT09ICdmaXZlbS1hcHBlYXJhbmNlJyA/ICdmaXZlbScgOiBjb25maWcucHJldmlvdXNDbG90aGluZ30udHNgKVxyXG5cdGltcG9ydGVkTW9kdWxlLmRlZmF1bHQoc291cmNlKVxyXG59LCBmYWxzZSk7XHJcblxyXG5jb3JlLlJlZ2lzdGVyVXNhYmxlSXRlbSgnY2xvdGgnLCBhc3luYyAoc291cmNlOiBudW1iZXIsIHNsb3Q6IG51bWJlciwgbWV0YWRhdGE6IHtvdXRmaXQ6IE91dGZpdCwgbGFiZWw6IHN0cmluZ30pID0+IHtcclxuXHRjb25zdCBwbGF5ZXIgPSBjb3JlLkdldFBsYXllcihzb3VyY2UpXHJcblx0aWYgKHBsYXllcj8ucmVtb3ZlSXRlbSgnY2xvdGgnLCAxLCBzbG90KSkgXHJcblx0XHRlbWl0TmV0KCdibF9hcHBlYXJhbmNlOnNlcnZlcjp1c2VPdXRmaXQnLCBzb3VyY2UsIG1ldGFkYXRhLm91dGZpdClcclxufSkiXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQVVPLFNBQVMsc0JBQXNCLFdBQW1CLGFBQXFCLE1BQWE7QUFDdkYsTUFBSTtBQUNKLEtBQUc7QUFDQyxVQUFNLEdBQUcsU0FBUyxJQUFJLEtBQUssTUFBTSxLQUFLLE9BQU8sS0FBSyxNQUFTLEVBQUUsQ0FBQyxJQUFJLFFBQVE7QUFBQSxFQUM5RSxTQUFTLGFBQWEsR0FBRztBQUN6QixVQUFRLFVBQVUsU0FBUyxJQUFJLFVBQVUsY0FBYyxLQUFLLEdBQUcsSUFBSTtBQUNuRSxTQUFPLElBQUksUUFBUSxDQUFDLFlBQVk7QUFDNUIsaUJBQWEsR0FBRyxJQUFJO0FBQUEsRUFDeEIsQ0FBQztBQUNMO0FBRU8sU0FBUyxpQkFBaUIsV0FBbUIsSUFBK0M7QUFDL0YsUUFBTSxV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LFNBQVMsT0FBTyxRQUFRLEVBQUU7QUFDaEQsY0FBTSxTQUFTLE1BQU0sUUFBUSxVQUFVLE9BQU8sTUFBTTtBQUNwRCxlQUFPLEtBQUssR0FBRyxNQUFNLElBQUk7TUFDM0I7TUFDQSxNQUFNLE9BQU8sT0FBTyxRQUFRLElBQUU7QUFDNUIsU0FBQyxPQUFPLFFBQVEsRUFBRSxJQUFJLFNBQVMsT0FBTyxRQUFRLEVBQUU7QUFDaEQsY0FBTSxTQUFTLE1BQU0sUUFBUSxVQUFVLE9BQU8sTUFBTTtBQUNwRCxlQUFPLEtBQUssR0FBRyxNQUFNLElBQUk7TUFDM0I7TUFDQSxNQUFNLE9BQU8sT0FBTyxRQUFRLElBQUU7QUFDNUIsU0FBQyxPQUFPLFFBQVEsRUFBRSxJQUFJLFNBQVMsT0FBTyxRQUFRLEVBQUU7QUFDaEQsY0FBTSxTQUFTLE1BQU0sUUFBUSxVQUFVLE9BQU8sTUFBTTtBQUNwRCxlQUFPLEtBQUssR0FBRyxNQUFNLElBQUk7TUFDM0I7TUFDQSxNQUFNLE9BQU8sT0FBTyxRQUFRLElBQUU7QUFDNUIsU0FBQyxPQUFPLFFBQVEsRUFBRSxJQUFJLFNBQVMsT0FBTyxRQUFRLEVBQUU7QUFDaEQsY0FBTSxTQUFTLE1BQU0sUUFBUSxVQUFVLE9BQU8sTUFBTTtBQUNwRCxlQUFPLEtBQUssR0FBRyxNQUFNLElBQUk7TUFDM0I7TUFDQSxNQUFNLFFBQVEsT0FBTyxRQUFRLElBQUU7QUFDN0IsU0FBQyxPQUFPLFFBQVEsRUFBRSxJQUFJLFNBQVMsT0FBTyxRQUFRLEVBQUU7QUFDaEQsY0FBTSxTQUFTLE1BQU0sUUFBUSxXQUFXLE9BQU8sTUFBTTtBQUNyRCxlQUFPLEtBQUssR0FBRyxNQUFNLElBQUk7TUFDM0I7TUFDQSxNQUFNLFdBQVcsT0FBTyxRQUFRLElBQUU7QUFDaEMsU0FBQyxPQUFPLFFBQVEsRUFBRSxJQUFJLFNBQVMsT0FBTyxRQUFRLEVBQUU7QUFDaEQsY0FBTSxTQUFTLE1BQU0sUUFBUSxjQUFjLE9BQU8sTUFBTTtBQUN4RCxlQUFPLEtBQUssR0FBRyxNQUFNLElBQUk7TUFDM0I7TUFDQSxN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QUF5QyxNQUFNO0FBQ3BELHlCQUF1QixPQUFPLFNBQVMsR0FBRyxNQUFNO0FBQ2pELENBQUM7QUFFRCxNQUFNLDJDQUEyQyxNQUFNO0FBQ3RELHlCQUF1QixPQUFPLFNBQVMsR0FBRyxDQUFDO0FBQzVDLENBQUM7QUFFRCxnQkFBZ0IsV0FBVyxPQUFPQyxZQUFtQjtBQUNwRCxFQUFBQSxVQUFTQSxZQUFXLElBQUlBLFVBQVMsU0FBUyxXQUFXLEVBQUUsQ0FBQyxDQUFDO0FBQ3pELFFBQU0sZ0JBQWdCLFFBQVE7QUFDOUIsUUFBTSxTQUFTLGNBQWMsT0FBTztBQUNwQyxRQUFNLGlCQUFpQixNQUFhLG1DQUFhLE9BQU8scUJBQXFCLHFCQUFxQixVQUFVLE9BQU8sZ0JBQWdCO0FBQ25JLGlCQUFlLFFBQVFBLE9BQU07QUFDOUIsR0FBRyxLQUFLO0FBRVIsS0FBSyxtQkFBbUIsU0FBUyxPQUFPQSxTQUFnQixNQUFjLGFBQThDO0FBQ25ILFFBQU0sU0FBUyxLQUFLLFVBQVVBLE9BQU07QUFDcEMsTUFBSSxRQUFRLFdBQVcsU0FBUyxHQUFHLElBQUk7QUFDdEMsWUFBUSxrQ0FBa0NBLFNBQVEsU0FBUyxNQUFNO0FBQ25FLENBQUM7IiwKICAibmFtZXMiOiBbImV4cG9ydHMiLCAiaW1wb3J0X294bXlzcWwiLCAicmVzcG9uc2UiLCAiaW1wb3J0X294bXlzcWwiLCAiZGVsYXkiLCAibWlncmF0ZSIsICJyZXNwb25zZSIsICJpbXBvcnRfb3hteXNxbCIsICJkZWxheSIsICJtaWdyYXRlIiwgInJlc3BvbnNlIiwgImltcG9ydF9veG15c3FsIiwgInNvdXJjZSJdCn0K
