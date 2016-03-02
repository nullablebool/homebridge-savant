var Service;
var Characteristic;

var savant = require('savant');

module.exports = function(homebridge) {
	Service = homebridge.hap.Service;
	Characteristic = homebridge.hap.Characteristic;
	homebridge.registerPlatform('homebridge-platform-savant', 'Savant', SavantPlatform);
}

function SavantPlatform(log, config) {
	this.log = log;
	this.config = config;
}

SavantPlatform.prototype = {
    accessories: function(callback) {
    
        this.log('Fetching Savant devices...');
        var that = this;
        //For each device, create an accessory!
        var foundAccessories = this.config.accessories;
        //create array of accessories
        var myAccessories = [];
        
        for (var i = 0; i < foundAccessories.length; i++) {
            this.log('Parsing accessory ' + i + ' of ' + foundAccessories.length);
            this.log('Push new device ' + foundAccessories[i].name);
            //Call accessoryConstruction
            var accessory = new SavantAccessory(this.log, foundAccessories[i]);
            this.log('Created ' + accessory.name + ' Accessory');
            myAccessories.push(accessory);
        }
        this.log('Returning ' + myAccessories.length + ' accessories');
        callback(myAccessories);
    }
}


function SavantAccessory(log, config) {
    this.log = log;
    this.config = config;
	this.name = config.name;
	if (config.type == 'switch') {
	   //Switch thing
	   this.onCommand = config['on'];
	   this.offCommand = config['off'];
	   this.queryCommand = config['query'];
	} else if (config.type == 'thermostat') {	
	   //Thermostat thing
	   //Characteristic.TemperatureDisplayUnits.CELSIUS = 0;
	   //Characteristic.TemperatureDisplayUnits.FAHRENHEIT = 1;
	   this.temperatureDisplayUnits = Characteristic.TemperatureDisplayUnits.CELSIUS;
	   this.temperature = 19;
	   //this.relativeHumidity = 0.70;
	   // The value property of CurrentHeatingCoolingState must be one of the following:
	   //Characteristic.CurrentHeatingCoolingState.OFF = 0;
	   //Characteristic.CurrentHeatingCoolingState.HEAT = 1;
	   //Characteristic.CurrentHeatingCoolingState.COOL = 2;
	   this.heatingCoolingState = Characteristic.CurrentHeatingCoolingState.COOL;
	   this.targetTemperature = 21;
	   //this.targetRelativeHumidity = 0.5;
	   this.heatingThresholdTemperature = 22;
	   this.coolingThresholdTemperature = 19;
	   // The value property of TargetHeatingCoolingState must be one of the following:
	   //Characteristic.TargetHeatingCoolingState.OFF = 0;
	   //Characteristic.TargetHeatingCoolingState.HEAT = 1;
	   //Characteristic.TargetHeatingCoolingState.COOL = 2;
	   //Characteristic.TargetHeatingCoolingState.AUTO = 3;
	   this.targetHeatingCoolingState = Characteristic.TargetHeatingCoolingState.COOL;
	
	   //Temp:
	   this.offCommand = config['off'];
	   this.coolCommand = config['cool'];
	   this.heatCommand = config['heat'];
	   this.setCommand = config['set'];
	   this.queryTempCommand = config['queryTemp'];
	   this.queryStateCommand = config['queryState'];
	
	} else if (config.type == 'lightbulb') {
	   //Dimmer thing
	   this.onCommand = config['on'];
	   this.offCommand = config['off'];
	   this.setCommand = config['set'];
	   this.queryCommand = config['query'];
	}
}

SavantAccessory.prototype = {
    //**************Switch**************
    setState: function(powerOn, callback) {
	    var accessory = this;
    	var state = powerOn ? 'on' : 'off';
    	var prop = state + 'Command';
    	var command = accessory[prop].replace(/''/g, '"');
	    this.log('Command: '+command);
    	savant.serviceRequest(command, done);

    	function done(err, rtn) {
    		if (err) {
    			accessory.log('Error: ' + err);
    			callback(err || new Error('Error setting ' + accessory.name + ' to ' + state));
    		} else {
    			accessory.log('Set ' + accessory.name + ' to ' + state);
    			callback(null);
    		}
    	}
    },

    getPowerState: function(callback) {
        this.log("Calling the function to get current state...");
    	var accessory = this;
        var getsavant = this.queryCommand.replace(/''/g, '"');
    
    	savant.readState(getsavant, done);

    	function done(err, rtn) {
    		if (err) {
    			accessory.log('Error: ' + err);
    			callback(err || new Error('Error setting ' + accessory.name + ' to ' + rtn));
    		} else {
    		    if (rtn == 0) {
    		        accessory.log('The ' + accessory.name + ' is Off ');
    			    callback(null, false);
    		    } else {
    			     accessory.log('The ' + accessory.name + ' is On: ');
    			     callback(null, true);
    			}
    		}
    	}
    },
    
    //**************Thermostat**************
    // Required
	getCurrentHeatingCoolingState: function(callback) {
        this.log("Calling the function to get current state...");
        var accessory = this;
        var getsavant = this.queryStateCommand.replace(/''/g, '"');
    
	    savant.readState(getsavant, done);

	    function done(err, rtn) {
            if (err) {
                accessory.log('Error: ' + err);
			    callback(err || new Error('Error setting ' + accessory.name + ' to ' + rtn));
		    } else {
                if (rtn == 0) {
                    accessory.log("getCurrentHeatingCoolingState :", 'Off ');
		            //this.CurrentHeatingCoolingState = parseInt('0');
			        //callback(null, Characteristic.CurrentHeatingCoolingState.OFF);
			        callback(null,0);
                } else if (rtn == 1) {
                    accessory.log("getCurrentHeatingCoolingState :", 'Cool ');
		            //this.CurrentHeatingCoolingState = parseInt('2');
			        //callback(null, Characteristic.CurrentHeatingCoolingState.COOL);
			        callback(null,2);
                } else if (rtn == 2) {
		            accessory.log("getCurrentHeatingCoolingState :", 'Heat ');
		            //this.CurrentHeatingCoolingState = parseInt('1');
			        //callback(null, Characteristic.CurrentHeatingCoolingState.HEAT);
			        callback(null,1);
			    } else {
			        accessory.log("getCurrentHeatingCoolingState :", 'Cool ');
		            //this.CurrentHeatingCoolingState = parseInt('2');
			        //callback(null, Characteristic.CurrentHeatingCoolingState.COOL);
			        callback(null,2);
			    }
		    }
        }
	},
	
	setTargetHeatingCoolingState: function(value, callback) {
	    this.log('Valor: ' + value);
        var accessory = this;
        
        if (value == 0) {
	       var state = 'off';
	       //return Characteristic.CurrentHeatingCoolingState.OFF;
	    } else if (value == 1) {
	       var state = 'heat';
	       //return Characteristic.CurrentHeatingCoolingState.HEAT;
	    } else {
	       var state = 'cool';
	       //return Characteristic.CurrentHeatingCoolingState.COOL;
	    }   
	    this.log('Valor: ' + value + ' / Estado: ' + state);
    	var prop = state + 'Command';
    	var command = accessory[prop].replace(/''/g, '"');

    	savant.serviceRequest(command, done);
    	
    	function done(err, rtn) {
		  if (err) {
			 accessory.log('Error: ' + err);
			 callback(err || new Error('Error setting ' + accessory.name + ' to ' + rtn));
		  } else {
		      accessory.log("setTarget :", rtn);
		      accessory.log("setTargetHeatingCoolingState from/to:", this.targetHeatingCoolingState, value);
		      accessory.targetHeatingCoolingState = value;
		      callback(null, this.targetHeatingCoolingState);
		  }
	   }
	},
	
	getCurrentTemperature: function(callback) {
	   this.log("Calling the function to get current temperature...");
	   var accessory = this;
       var getsavant = this.queryTempCommand.replace(/''/g, '"');
    
	   savant.readState(getsavant, done);

	   function done(err, rtn) {
		  if (err) {
			 accessory.log('Error: ' + err);
			 callback(err || new Error('Error setting ' + accessory.name + ' to ' + rtn));
		  } else {
		      accessory.log("getCurrentTemperature :", rtn);
		      this.temperature = parseInt(rtn);
			  callback(null, this.temperature);
		  }
	   }
	},
	
	setTargetTemperature: function(value, callback) {
	    this.log('Valor: ' + value);
        var accessory = this;
	    var state = String(value);
    	var prop = 'setCommand';
    	var commandTemp = accessory[prop].replace(/''/g, '"');
    	var command = commandTemp.replace(/VARTEMP/g, state);

    	savant.serviceRequest(command);
	
		this.log("setTargetTemperature from/to", this.targetTemperature, value);
		this.targetTemperature = parseInt(value);
		this.temperature = parseInt(value);
		callback(null, this.targetTemperature);
	},
	
	getTemperatureDisplayUnits: function(callback) {
		this.log("getTemperatureDisplayUnits :", this.temperatureDisplayUnits);
		var error = null;
		callback(error, this.temperatureDisplayUnits);
	},
	
	//**************LightBulb**************
    setLevelState: function(brightness, callback) {
	    this.log('Level: ' + brightness);
        var accessory = this;
	    var level = String(brightness);
    	var prop = 'setCommand';
    	var commandTemp = accessory[prop].replace(/''/g, '"');
    	var command = commandTemp.replace(/VARLEVEL/g, level);
        
        savant.serviceRequest(command, done);
        
    	function done(err, rtn) {
    		if (err) {
    			accessory.log('Error: ' + err);
    			callback(err || new Error('Error setting ' + accessory.name + ' to ' + level));
    		} else {
    			accessory.log('Set ' + accessory.name + ' to ' + level);
    			callback(null, level);
    		}
    	}
    },
    getLevelState: function(callback) {
	   this.log("Calling the function to get current Light Level...");
	   var accessory = this;
       var getsavant = this.queryCommand.replace(/''/g, '"');
    
	   savant.readState(getsavant, done);

	   function done(err, rtn) {
		  if (err) {
			 accessory.log('Error: ' + err);
			 callback(err || new Error('Error setting ' + accessory.name + ' to ' + rtn));
		  } else {
		      accessory.log("getLevelState :", rtn);
		      this.brightness = parseInt(rtn);
			  callback(null, this.brightness);
		  }
	   }
	},

    getServices: function() {
        var type = this.config.type;
        
        var informationService = new Service.AccessoryInformation();
    	informationService
    		.setCharacteristic(Characteristic.Manufacturer, 'Savant')
    		.setCharacteristic(Characteristic.Model, 'Pro Host')
    		.setCharacteristic(Characteristic.SerialNumber, 'Savant Serial Number');
        
        if (type == 'switch') {
            var switchService = new Service.Switch(this.name);
                switchService
        		  .getCharacteristic(Characteristic.On)
        		  .on('get', this.getPowerState.bind(this))
        		  .on('set', this.setState.bind(this));
    		  
            return [switchService];
    	   
    	} else if (type == 'thermostat') {
            var thermostatService = new Service.Thermostat(this.name);
            // Required Characteristics
			thermostatService
				.getCharacteristic(Characteristic.CurrentHeatingCoolingState)
				.on('get', this.getCurrentHeatingCoolingState.bind(this));

			thermostatService
				.getCharacteristic(Characteristic.TargetHeatingCoolingState)
				.on('set', this.setTargetHeatingCoolingState.bind(this));

			thermostatService
				.getCharacteristic(Characteristic.CurrentTemperature)
				.on('get', this.getCurrentTemperature.bind(this));

			thermostatService
				.getCharacteristic(Characteristic.TargetTemperature)
				.on('set', this.setTargetTemperature.bind(this));

			thermostatService
				.getCharacteristic(Characteristic.TemperatureDisplayUnits)
				.on('get', this.getTemperatureDisplayUnits.bind(this));

			return [thermostatService];
			
        } else if (type == 'lightbulb') {
            var lightbulbService = new Service.Lightbulb(this.name);
            lightbulbService
        	   .getCharacteristic(Characteristic.On)
        	   .on('get', this.getPowerState.bind(this))
        	   .on('set', this.setState.bind(this));
            lightbulbService
        	   .addCharacteristic(Characteristic.Brightness)
        	   .on('get', this.getLevelState.bind(this))
        	   .on('set', this.setLevelState.bind(this));
            return [lightbulbService];
    	   
    	}
	
    }
}