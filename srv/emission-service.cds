using { my.carbemissioncalc as my } from './../db/data-model.cds';

service EmissionService {

    entity Emissions as projection on my.Emission;
    entity Building as projection on my.Building;
    entity Buildings as select from my.Building {*,
        sum(emissions.multiplicator * emissions.emission.value) as totalEmission : Decimal,
        'kg/y' as unit : String
    } group by emissions.up_.ID;
    
    action insertNewBuilding() returns UUID;
    function getBuildingEmission() returns String;
}
