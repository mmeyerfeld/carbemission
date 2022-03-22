namespace my.carbemissioncalc;
using { cuid } from '@sap/cds/common';
using { managed } from '@sap/cds/common';


entity User : cuid {
    name : String;
    building : Association to one Building on building.user = $self;
}

entity Building : cuid, managed {
    emissions : Composition of many BuildingEmission;
    user : Association to one User;
}

aspect BuildingEmission {
    key emission : Association to one Emission;
    value : Decimal;
    unit : String;
}

entity Emission : managed {
    key name : String;
    key level : Integer;
    value : Decimal;
    unit : String;
}