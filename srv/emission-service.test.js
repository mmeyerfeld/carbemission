// const service = require('./emission-service');
const cds = require('@sap/cds-dk/lib');
const { GET, POST, data } = cds.test(__dirname+'/..');
const testData = data;

describe('CDS Testing', ()=> {
    beforeAll(async ()=> {
        await testData.delete();
    });
    //Eigentlich nicht nötig, da ich hiermit die Test-API teste
    describe ('Tests without Data', ()=> {
        test ('Returning []', async ()=>{
            const { data } = await GET `/emission/Buildings`;
            expect(data.value).toEqual([]);
        });
    });

    describe ('Tests with Datasets', ()=> {
        beforeAll(async ()=> {
            await testData.delete();
            setupEmissions();
            setupBuildings();
        });
        //Hier teste ich den Outupt vom Building Service => X
        //X: totalEmission 
        test (`Testing totalEmission`, async ()=> {
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
        //X: unit
        test (`Testing unit`, async ()=> {
            const { data } = await GET `/emission/Buildings`;
            expect(data.value).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        ID: expect.any(String),
                        totalEmission : expect.any(Number),
                        unit : 'kg/y'
                    })
                ])
            );
            expect(data.value).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        ID: expect.any(String),
                        totalEmission : expect.any(Number),
                        unit : 'kg/y'
                    })
                ])
            );
        });
    });
    //READONLY aktiviert, daher muss hier ein Fehler zurückkommen
    describe ('Testing POST', ()=> {
        test (`POST Buildings`, async ()=> {
            expect.assertions(1);
            await expect(POST (`/emission/Buildings`, {})).rejects.toEqual(
                //Der Fehler sollte eigentlich mit RegEx überprüft werden
                new Error('405 - Entity "EmissionService.Buildings" is read-only')
            );
        });
    });
    //Testen der beiden MEthoden
    describe ('Testing Methods', ()=> {
        beforeAll(async ()=> {
            await testData.delete();
            setupEmissions();
            setupMethods();
        });   
        test (`insertNewBuilding`, async ()=> {
            const srv = await cds.connect.to('EmissionService');
            expect.assertions(1);
            await expect(await srv.insertNewBuilding([
                {emission_name : 'heating', emission_level : 1, multiplicator : 100}
            ])).toEqual(
                expect.any(String)
            );
        });

        test ('getBuildingEmission', async ()=> {
            const srv = await cds.connect.to('EmissionService');
            expect.assertions(1);
            const { data } = await GET `/emission/Buildings`;
            await expect(await srv.getBuildingEmission('Buildings', '9bd879d6-8ccd-4926-bac2-fc1af8dcaead')).toEqual(
                expect.arrayContaining([
                    {
                        "ID": "9bd879d6-8ccd-4926-bac2-fc1af8dcaead",
                        "totalEmission": 328.32000000000005,
                        "unit": "kg/y"
                    }
                ])
            );
        });
    });
});
//Integration Test in der Form, in der die Methoden auch im Frontend aufgerufen werden
describe ('Integration Testing', ()=> {
    beforeAll(async ()=> {
        await testData.delete();
        setupEmissions();
    }); 
    test (`Simple Integration Test`, async ()=> {
        expect.assertions(1);
        const srv = await cds.connect.to('EmissionService');
        const ID = await srv.insertNewBuilding([
            {emission_name : 'heating', emission_level : 2, multiplicator : 600},
            {emission_name : 'hotwater', emission_level : 1},
            {emission_name : 'electricity', emission_level : 2}
        ]);
        await expect(await srv.getBuildingEmission('Buildings', ID)).toEqual(
            expect.arrayContaining([
                {
                    "ID": ID,
                    "totalEmission": 291614.7,
                    "unit": "kg/y"
                }
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
async function setupMethods() {
    createEntries([
        {ID : '9bd879d6-8ccd-4926-bac2-fc1af8dcaead', emissions : [
            {emission_name : "heating", emission_level : 1, multiplicator : 60}
        ]}
    ], 'Building');
}

async function setupEmissions() {
    createEntries([
        {name : "heating", level : 1, description : "Wood Pellets", value : 5.472, unit : "kg/sqm/y"},
        {name : "heating", level : 2, description : "Biogas", value : 23.104, unit : "kg/sqm/y"},
        {name : "heating", level : 3, description : "Natural Gas", value : 30.552, unit : "kg/sqm/y"},
        {name : "heating", level : 4, description : "Oil", value : 34.352, unit : "kg/sqm/y"},
        {name : "heating", level : 5, description : "Brown Coal", value : 58.216, unit : "kg/sqm/y"},
        {name : "hotwater", level : 1, description : "Gas", value : 277140, unit : "kg/y"},
        {name : "hotwater", level : 2, description : "Electric", value : 897450, unit : "kg/y"},
        {name : "electricity", level : 1, description : "green", value : 40, unit : "kg/y"},
        {name : "electricity", level : 2, description : "standart", value : 612.3, unit : "kg/y"}
    ], 'Emission');
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
    ], 'Building');  
}

async function createEntries(entries, entity) {
    const db = await cds.connect.to('db');
    const {Building, Emission} = db.model.entities('my.carbemissioncalc');
    switch (entity) {
        case 'Building':
            await db.create(Building).entries(entries);       
            break;
        case 'Emission':
            await db.create(Emission).entries(entries);
            break;
        default:
            console.error(`${entity} is not a valid Enity`);;
    }
}