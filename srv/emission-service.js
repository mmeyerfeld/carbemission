const cds = require('@sap/cds-dk');

class EmissionService extends cds.ApplicationService {
    async init() {
        this.on ('insertNewBuilding', async (req) => {
            const db = await cds.connect.to('db');
            const {Building} = await db.model.entities('my.carbemissioncalc');
            await db.create(Building, req.data);
            return req.data.ID;
        });
        this.on ('getBuildingEmission', 'Buildings', async (req)=> {
            let building = await this.read(`Buildings`).where({ID:req.data.ID});
            return building;
        });
        await super.init();
    }
}


module.exports = {
    EmissionService
};