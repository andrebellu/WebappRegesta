sap.ui.define([
    "sap/ui/core/mvc/Controller",
], function(require, factory) {
    'use strict';
    
    return Controller.extend("regesta.regestarapportini.controller.Popup", {
        onInit: function() {
        },

        onSave: function (oEvent) {
            this.byId("popup").close();
        },

        onCancel: function (oEvent) {
            this.byId("popup").close();
        },
    });
});