#!/usr/bin/env node

//var helper = require("./helper_test.js");
//var test = helper.test(__filename);

var test = require("tape");
var mockery = require("mockery");

var osiota = null;
try {
	osiota = require("./osiota");
} catch(err) { try {
	osiota = require("../osiota");
} catch(err) { try {
	osiota = require("../../osiota");
} catch(err) { try {
	osiota = require("osiota");
} catch(err) {
	console.error("osiota not found.");
}}}}

var main = new osiota();

const apps = main.application_loader.apps;

const EventEmitter = require('events');
var e = new EventEmitter();

mockery.enable({
	warnOnReplace: false,
	warnOnUnregistered: false
});
var fsMock = {
	DIR_IN: "in",
	DIR_OUT: "out",
	DIR_HIGH: "high",
	DIR_LOW: "low",
	setup: function(pin, mode, cb) {
		//console.log("SETUP");
		if (mode === "high")
			this.write(pin, 1);
		if (mode === "low")
			this.write(pin, 0);
		if (typeof cb === "function") cb(null);
	},
	write: function(pin, value, cb) {
		//console.log("WRITE", pin, value);
		e.emit("write", { pin, value });
		if (typeof cb === "function") cb(null);
	},
	destroy: function() {}
};
mockery.registerMock('rpi-gpio', fsMock);

var a;
test('load app gpio-out', async function (t) {
	t.plan(3);

	e.once("write", function(state) {
		t.equal(state.pin, 10, "pin");
		t.equal(state.value, 1, "value");
	});
	await main.config({
		"app_dir": __dirname+"/",
		"app": [
			{
				"name": "gpio-out",
				"config": {
					"pin": 10,
					"initial_value": 1,
					"invert": 0
				}
			}
		]
	});

	a = apps["GPIO out"];
	t.equal(a._id, "GPIO out", "app name");

});

test('set 0, app gpio-out', function (t) {
	t.plan(2);

	e.once("write", function(state) {
		t.equal(state.pin, 10, "pin");
		t.equal(state.value, 0, "value");
	});
	a.node.rpc("set", 0);
});

test('set 1, app gpio-out', function (t) {
	t.plan(2);

	e.once("write", function(state) {
		t.equal(state.pin, 10, "pin");
		t.equal(state.value, 1, "value");
	});
	a.node.rpc("set", 1);
});


test('load app gpio-out (invert)', async function (t) {
	t.plan(3);

	e.once("write", function(state) {
		t.equal(state.pin, 9, "pin");
		t.equal(state.value, 0, "value");
	});
	await main.config({
		"app_dir": __dirname+"/",
		"app": [
			{
				"name": "gpio-out",
				"config": {
					"pin": 9,
					"initial_value": 1,
					"invert": 1
				}
			}
		]
	});

	// is synchron:
	a = apps["GPIO out 2"];
	t.equal(a._id, "GPIO out 2", "app name");
});

test('set 0, app gpio-out (invert)', function (t) {
	t.plan(2);

	e.once("write", function(state) {
		t.equal(state.pin, 9, "pin");
		t.equal(state.value, 1, "value");
	});
	a.node.rpc("set", 0);
});

test('set 1, app gpio-out (invert)', function (t) {
	t.plan(2);
	e.once("write", function(state) {
		t.equal(state.pin, 9, "pin");
		t.equal(state.value, 0, "value");
	});
	a.node.rpc("set", 1);
});

