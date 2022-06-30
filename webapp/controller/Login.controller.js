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

      onSubmit: function () {
        // collect input controls
        var oView = this.getView();

        // Store user input value in variable
        var username = oView.byId("nameInput").getValue();

        // Store password input value in variable
        var password = oView.byId("passwordInput").getValue();

        // Check inputs and token
        if (username != "" || password != "") {
          this.sendRequest(username, password);
          var token = sessionStorage.getItem("token");
        } else {
          MessageBox.error("L'utente o la password non sono stati inseriti");
        }
      },

      sendRequest: function(username, password) {
        //! API Requests
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
        };

        // Send POST request and print result
        fetch(
          "https://asstest.regestaitalia.it/api_v2/login?username=" +
            username +
            "&password=" +
            password,
          requestOptions
        )
          .then((response) => response.text())
          .then((result) => this.handleResult(result))
          .catch((error) => console.log("error", error));
      },

      handleResult: function(result) {
        var token = result;
        if (token.includes("<html>") || token === "" || token === null) {
          MessageBox.error("Credenziali non valide. Riprova");
          return false;
        } else {
          // Store token in local storage
          sessionStorage.setItem("token", token);

          // Navigate to home page passing token as parameter
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          oRouter.navTo("RouteHome", { token: token });
        
          return true;
        }
      }
    });
  }
);
