const service = require('./emission-service');
const cds = require('@sap/cds-dk/lib');
const { GET, POST, data } = cds.test(__dirname+'/..');
data.autoReset(true);

describe('CDS Testing', ()=>{
    beforeAll(async ()=>{ 
        const db = await cds.connect.to('db');
        const { Building } = db.model.entities('my.carbemissioncalc');
        await db.create(Building).entries([
            {ID : 'KeinJoghurt'}
        ]);
    });

    test ('should test', async ()=>{
        const { data } = await GET ('/emission/Buildings', {});
    
        expect(data.value).toEqual(
        [
            {"ID":"Kekse","totalEmission":34.048,"unit":"kg/y"}
        ]);
    });
});

// describe('Methode Testing', ()=>{
//     beforeAll(()=>{});
//     test('adds 1 + 2 to equal 3', () => {
//         expect(service.testfunction(1)).toBe(1);
//     });
// });