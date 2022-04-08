sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/model/json/JSONModel'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("carbemission.controller.main", {
            onInit: function () {
                this.prepareSelects();
            },

            prepareSelects: async function () {
                var oData = {
                    "Heating": [
                        {
                            "ProductId": "1",
                            "Name": "Heating with Wood Pellets"
                        },
                        {
                            "ProductId": "2",
                            "Name": "Heating with Biogas"
                        },
                        {
                            "ProductId": "3",
                            "Name": "Heating with Natural Gas"
                        },
                        {
                            "ProductId": "4",
                            "Name": "Heating with Oil"
                        },
                        {
                            "ProductId": "5",
                            "Name": "Heating with Brown Coal"
                        }
                    ],
                    "Hotwater": [
                        {
                            "ProductId": "1",
                            "Name": "Gas Waterheating"
                        },
                        {
                            "ProductId": "2",
                            "Name": "Electric Waterheating"
                        }
                    ],
                    "Electricity": [
                        {
                            "ProductId": "1",
                            "Name": "Green Electricity"
                        },
                        {
                            "ProductId": "2",
                            "Name": "Standart Electricity"
                        }
                    ],
                    "Editable": true,
                    "Enabled": true
                };

                var oModel = new JSONModel(oData);
                this.getView().setModel(oModel, "neededData");
            },

            submitEvents : function () {
                const that = this;
                let heatingLevel = parseInt(this.byId("heatingSelect").getSelectedKey());
                let hotwaterLevel = parseInt(this.byId("hotwaterSelect").getSelectedKey());
                let electricLevel = parseInt(this.byId("electricSelect").getSelectedKey());
                let sqm = parseInt(this.byId("sqmInput").getValue());
                
                let oModel = this.getView().getModel();
                oModel.create(`/insertNewBuilding`,
                    {emissions: [
                        {emission_name : "heating", emission_level : heatingLevel, "multiplicator" : sqm},
                        {emission_name : "hotwater", emission_level : hotwaterLevel},
                        {emission_name : "electricity", emission_level : electricLevel}
                    ]},{
                    success: function(oData, response){
                        let answerText = that.byId('answerText');
                        let text = `Answer: `;
                        
                        oModel.read(`/Buildings_getBuildingEmission`, {
                            method: 'GET',
                            urlParameters: {
                                ID : oData.insertNewBuilding
                            },
                            success: function(oData, response){
                                answerText.setText(text + oData.totalEmission + ` ` + oData.unit);
                            },
                            error: function(oError) {
                                error.log(oError);
                            }
                        });
                    },
                    error: function(oError) {
                        error.log(oError);
                    }
                });
            }
        });
    });