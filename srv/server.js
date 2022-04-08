"use strict";

try {
    const cds = require("@sap/cds-dk");
    const proxy = require("@sap/cds-odata-v2-adapter-proxy");   
    cds.on("bootstrap", app => app.use(proxy()));
} catch (error) {
    console.log(error);
}

module.exports = cds.server;