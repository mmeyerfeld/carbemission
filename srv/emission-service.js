const cds = require('@sap/cds-dk');

class EmissionService extends cds.ApplicationService {
    async init() {
        this.on ('insertNewBuilding', async (req) => {
            const db = await cds.connect.to('db');
            const {Building} = await db.model.entities('my.carbemissioncalc');
            await db.create(Building, req.data);
            return req.data.ID;
        });
        this.on ('getBuildingEmission', 'Buildings', async ({params:[id]})=> {
            let building = await this.read(`Buildings`).where({ID : id});
            return building;
        });
        await super.init();
    }
}


module.exports = {
    EmissionService
};