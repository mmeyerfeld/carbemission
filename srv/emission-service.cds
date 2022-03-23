using { my.carbemissioncalc as my } from './../db/data-model.cds';

service EmissionService {

    entity Buildings as select from my.Building {*,
        sum(emissions.multiplicator * emissions.emission.value) as totalEmission : Decimal,
        'kg/y' as unit : String
    };
    
    action insertNewBuilding() returns UUID;
    function getBuildingEmission() returns String;
}
