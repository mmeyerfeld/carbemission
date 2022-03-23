namespace my.carbemissioncalc;
using { cuid } from '@sap/cds/common';
using { managed } from '@sap/cds/common';


entity Building : cuid {
    emissions : Composition of many BuildingEmission;
}

aspect BuildingEmission {
    key emission : Association to one Emission;
    multiplicator : Integer;
}

entity Emission : managed {
    key name : String;
    key level : Integer;
    description : String;
    value : Decimal;
    unit : String;
}