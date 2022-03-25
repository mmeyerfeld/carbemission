const service = require('./emission-service');
const cds = require('@sap/cds-dk/lib');
const { GET, POST, data } = cds.test(__dirname+'/..');
const testData = data;

describe('CDS Testing', ()=> {
    describe ('Tests without Data', ()=> {
        beforeAll(async ()=> {
            await testData.delete();
        })
        test ('Returning []', async ()=>{
            const { data } = await GET `/emission/Buildings`;
            expect(data.value).toEqual([]);
        });
    });

    describe ('Tests with one Dataset', ()=> {
        beforeAll(async ()=> {
            await testData.delete();
            setupEmissions();
            setupSingleBuilding();
        });

        test ('Sum()', async ()=> {
            const { data } = await GET `/emission/Buildings`;
            expect(data.value).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        ID: expect.any(String),
                        totalEmission : 278080.62,
                        unit : expect.any(String)
                    })
                ])
            );
        });
    });

    describe ('Tests with many Datasets', ()=> {
        beforeAll(async ()=> {
            await testData.delete();
            setupEmissions();
            setupBuildings();
        });

        test (`Working with 'GroupBy'`, async ()=> {
            const { data } = await GET `/emission/Buildings`;
        
            expect(data.value).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        ID: expect.any(String),
                        totalEmission : 278080.62,
                        unit : expect.any(String)
                    })
                ])
            );
            expect(data.value).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        ID: expect.any(String),
                        totalEmission : 902378.32,
                        unit : expect.any(String)
                    })
                ])
            );
        });
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

async function setupSingleBuilding() {
    createEntries([
        {emissions : [
            {emission_name : "heating", emission_level : 1, multiplicator : 60},
            {emission_name : "hotwater", emission_level : 1},
            {emission_name : "electricity", emission_level : 2}
        ]}
    ]);
}

async function setupBuildings() {
    createEntries([
        {emissions : [
            {emission_name : "heating", emission_level : 1, multiplicator : 60},
            {emission_name : "hotwater", emission_level : 1},
            {emission_name : "electricity", emission_level : 2}
        ]},
        {emissions : [
            {emission_name : "heating", emission_level : 3, multiplicator : 160},
            {emission_name : "hotwater", emission_level : 2},
            {emission_name : "electricity", emission_level : 1}
        ]}
    ]);  
}

async function createEntries(entries) {
    const db = await cds.connect.to('db');
    const {Building} = db.model.entities('my.carbemissioncalc');
    await db.create(Building).entries(entries);
}