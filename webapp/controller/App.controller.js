sap.ui.define(
    [
        "sap/ui/core/mvc/Controller"
    ],
    function(BaseController) {
      "use strict";
  
      sessionStorage.setItem("hostname", "https://asstest.regestaitalia.it");

      return BaseController.extend("regesta.regestarapportini.controller.App", {
        onInit() {
        }
      });
    }
  );
  