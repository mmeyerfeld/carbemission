using { my.carbemissioncalc as my } from './../db/data-model.cds';

service EmissionService {

    @readonly
    entity Buildings as select from my.Building {
        ID,
        sum(emissions.multiplicator * emissions.emission.value) as totalEmission : Decimal,
        'kg/y' as unit : String
    } group by ID
    actions {
        function getBuildingEmission() returns Buildings;
    };

    entity Emissions as select from my.Building.emissions{
        up_,
        emission.name,
        emission.level,
        multiplicator
    } actions {
        action insertNewBuilding(emissions : array of Emissions) returns UUID;
    };
}
