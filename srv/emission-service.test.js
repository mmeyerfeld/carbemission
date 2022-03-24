const service = require('./emission-service');
const cds = require('@sap/cds-dk/lib');
const { GET, POST, data } = cds.test(__dirname+'/..');
const testData = data;

describe('CDS Testing', ()=>{
    beforeAll(async ()=> { 
        const db = await cds.connect.to('db');
        const {Building} = db.model.entities('my.carbemissioncalc');
        await db.create(Building).entries([
            {ID : 'KeinJoghurt'}
        ]);
    });

    afterEach(async ()=> {
        await testData.reset();
    });

    test ('With Mock-Data', async ()=>{
        const { data } = await GET `/emission/Buildings`;
    
        expect(data.value).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ ID:'KeinJoghurt'})
            ])
        );
    });

    test ('Without Mock-Data', async ()=> {
        const { data } = await GET `/emission/Buildings`;
    
        expect(data.value).toEqual(
            expect.not.arrayContaining([
                expect.objectContaining({ ID:'KeinJoghurt'})
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