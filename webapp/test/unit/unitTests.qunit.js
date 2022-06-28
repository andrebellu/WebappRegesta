/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"regesta/regesta-rapportini/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
