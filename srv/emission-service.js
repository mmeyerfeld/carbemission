const cds = require('@sap/cds-dk');

class EmissionService extends cds.ApplicationService {
    async init() {
        this.on ('insertNewBuilding', async (req) => {
            const db = await cds.connect.to('db');
            const {Building} = await db.model.entities('my.carbemissioncalc');
            let ID = await db.create('Building', req.data);
            return ID.results[0].values[0];
        });
        this.on ('getBuildingEmission', 'Buildings', async (req)=> {
            let building = await this.read(`Buildings`).where({ID:req.data.ID});
            return building;
        });
        await super.init();
    }
}

function insertNewBuilding(req) {
    console.log("Von insertNewBuilding: " + req.data);
    return req.data;
}

module.exports = {
    EmissionService,
    insertNewBuilding
};