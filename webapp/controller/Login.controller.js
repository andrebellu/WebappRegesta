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
        var oView = this.getView();

        // Store user input value in variable
        var username = oView.byId("nameInput").getValue();

        // Store password input value in variable
        var password = oView.byId("passwordInput").getValue();

        // Validation does not happen during data binding as this is only triggered by user actions.
        // Check if the inputs are empty
        if (username === "" || password === "") {
            MessageBox.error(
                "L'utente o la password sono errati, inseriscili di nuovo"
              );
        }

        //* API Requests
        // Define headers
        var myHeaders = new Headers();
        myHeaders.append(
          "Cookie",
          "ASP.NET_SessionId=yokt0fmlyoqx253d5sdydpwg"
        );

        // Set POST request
        var requestOptions = {
          method: "POST",
          headers: myHeaders,
          redirect: "follow",
          mode: "cors",
        };

        // Send POST request and print result
        fetch(
          "https://asstest.regestaitalia.it/api_v2/login?username=" + username + "&password=" + password,
          requestOptions
        )
          .then((response) => response.text())
          .then((result) => {
            // save result in local storage
            localStorage.setItem("token", result);
          })
          .catch((error) => console.log("error", error));
        
          var token = localStorage.getItem("token");
          // Check if the login is correct by checking if the token is not a html page
          if (token.indexOf("<html>") > -1) {
            MessageBox.error(
                "L'utente o la password sono errati, inseriscili di nuovo"
              );
          } else {
            // Save token in local storage
            localStorage.setItem("token", token);
            // Navigate to the home page
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("RouteHome");
          }

      },
    });
  }
);
