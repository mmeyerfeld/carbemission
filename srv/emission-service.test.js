const service = require('./emission-service');
const cds = require('@sap/cds-dk/lib');
const { GET, POST, data } = cds.test(__dirname+'/..');
const testData = data;

describe('CDS Testing', ()=>{
    beforeAll(async ()=> { 
        testData.delete();
        setupEmissions();
        const db = await cds.connect.to('db');
        const {Building} = db.model.entities('my.carbemissioncalc');
        await db.create(Building).entries([
            {emissions : [
                {emission_name : "heating", emission_level : 1}
            ]}
        ]);
    });
    
    afterEach(async ()=> {
        await testData.reset();
    });

    test ('With Mock-Data', async ()=>{
        const { data } = await GET `/emission/Buildings`;
    
        expect(data.value).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ ID: expect.any(String)})
            ])
        );
    });

    test ('Without Mock-Data', async ()=> {
        const { data } = await GET `/emission/Buildings`;
    
        expect(data.value).toEqual(
            expect.not.arrayContaining([
                expect.objectContaining({ ID: "KeinJoghurt"})
            ])
        );
    });


});

// describe('Methode Testing', ()=>{
//     beforeAll(()=>{});
//     test('adds 1 + 2 to equal 3', () => {
//         expect(service.testfunction(1)).toBe(1);
//     });
// });


async function setupEmissions() {
    const db = await cds.connect.to('db');
    const {Emission} = db.model.entities('my.carbemissioncalc');
    await db.create(Emission).entries([
        {name : "heating", level : 1, description : "Wood Pellets", value : 5.472, unit : "kg/sqm/y"},
        {name : "heating", level : 2, description : "Biogas", value : 23.104, unit : "kg/sqm/y"},
        {name : "heating", level : 3, description : "Natural Gas", value : 30.552, unit : "kg/sqm/y"},
        {name : "heating", level : 4, description : "Oil", value : 34.352, unit : "kg/sqm/y"},
        {name : "heating", level : 5, description : "Brown Coal", value : 58.216, unit : "kg/sqm/y"},
        {name : "hotwater", level : 1, description : "Gas", value : 277140, unit : "kg/y"},
        {name : "hotwater", level : 2, description : "Electric", value : 897450, unit : "kg/y"},
        {name : "electricity", level : 1, description : "green", value : 40, unit : "kg/y"},
        {name : "electricity", level : 2, description : "standart", value : 612.3, unit : "kg/y"}
    ]);
}