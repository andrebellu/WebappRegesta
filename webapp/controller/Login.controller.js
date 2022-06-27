sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel",
        "sap/ui/model/SimpleType",
        "sap/ui/model/ValidateException",
        "sap/ui/core/Core",
        "sap/m/MessageBox",
        "sap/m/MessageToast",
    ],
    function (
        Controller,
        JSONModel,
        SimpleType,
        ValidateException,
        Core,
        MessageBox,
        MessageToast
    ) {
        "use strict";

        return Controller.extend("regesta.regestarapportini.controller.Login", {
            onInit: function () {
                var oView = this.getView(),
                    oMM = Core.getMessageManager();

                oView.setModel(new JSONModel({ name: "", password: "" }));

                // attach handlers for validation errors
                oMM.registerObject(oView.byId("nameInput"), true);
                oMM.registerObject(oView.byId("passwordInput"), true);
            },

            _validateInput: function (oInput) {
                var sValueState = "None";
                var bValidationError = false;
                var oBinding = oInput.getBinding("value");

                try {
                    oBinding.getType().validateValue(oInput.getValue());
                } catch (oException) {
                    sValueState = "Error";
                    bValidationError = true;
                }

                oInput.setValueState(sValueState);

                return bValidationError;
            },

            onNameChange: function (oEvent) {
                var oInput = oEvent.getSource();
                this._validateInput(oInput);
            },

            onSubmit: function () {
                // collect input controls
                var oView = this.getView(),
                    aInputs = [oView.byId("nameInput")],
                    bValidationError = false;

                // Check that inputs are not empty.
                // Validation does not happen during data binding as this is only triggered by user actions.
                aInputs.forEach(function (oInput) {
                    bValidationError =
                        this._validateInput(oInput) || bValidationError;
                }, this);

                if (!bValidationError) {
                    MessageToast.show("Login effettuato");
                    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    oRouter.navTo("RouteHome");
                } else {
                    MessageBox.error(
                        "L'utente o la password sono errati, inseriscili di nuovo"
                    );
                }
            },
        });
    }
);
