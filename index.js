var gpio = require("rpi-gpio");

exports.init = function(node, app_config, main, host_info) {
	if (typeof app_config.pin !== "number") {
		throw new Error("gpio: pin not defined.");
	}
	var not_invert = true;
	if (typeof app_config.invert) {
		not_invert = false;
	}

	var pin = app_config.pin;
	var mode = gpio.DIR_OUT;
	var value = 0;
	if (app_config.initial == 1) {
		mode = gpio.DIR_HIGH;
		value = 1;
	}
	if (app_config.initial == 0) {
		mode = gpio.DIR_LOW;
	}
	gpio.setup(pin, mode, function(err) {
		if (err) throw err;
	});

	node.announce([{
		"type": "output.state"
	}, app_config.metadata]);
	node.publish(undefined, value);
	node.rpc_set = function(reply, value, time) {
		gpio.write(pin, value ^ not_invert, function(err) {
			if (err) return reply(err);

			node.publish(time, value);
			reply(null, "okay");
		});
	};
	node.rpc_publish = function(reply, time, value) {
		return this.rpc_set(reply, value, time);
	};

	return [
		node,
		function() {
			/*
			// There is no unexport function:
			gpio.setup(pin, gpio.DIR_IN, function(err) {
				if (err) throw err;
			});
			*/
		}
	];
};
