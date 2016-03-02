# homebridge-Savant
Savant platform for homebridge.
This cannot run stand-alone!

## This Work In Progress, use carefully.
Please also visit [homebridge github homepage](https://github.com/nfarina/homebridge) first.

Latest to homebridge-savant changes can be found in the [CHANGELOG.TXT](https://github.com/wallwitz/homebridge-savant/CHANGELOG.TXT)

### This can only be used with the new homebridge >=0.2.0 and Node >=4.0.0

### Installation and running
-  Install homebridge first, [see there](https://github.com/nfarina/homebridge); nfarina recommends a global install as super user. It's a server tool, so we can safely assume that the person that installes it is sufficiently  priviledged to do so. `sudo npm install -g homebridge`
-  then install this package to `<any>` directory you want; If you installed homebridge globally I recommend to do so with homebridge-savant: `sudo npm install -g homebridge-savant`
-  configure homebridge and its plugins. You might start by copying the [`sample-config.json`](https://github.com/wallwitz/homebridge-savant/sample-config.json) to a new folder `.homebridge` in your user folder and rename it to config.json
-  when done, start homebridge with `homebridge`. If you have chosen a local install, go to the homebridge folder and do a `bin/homebridge --plugin-path <any>/homebridge-savant` with the path to the homebridge-savant installation.
 
# Configuration 
The configuration of the homebridge-savant plugin is done in the global config.json of homebridge. If you did not pass the -U parameter to homebridge, the directory for the config.json is /home/<user>/.homebridge
 
# Syntax of the config.json
You need to configure all devices directly in the config.json.

````json
    "platforms": [
        {
            "platform": "Savant",
            "name": "Savant Platform",
            "accessories": [
                {
                    "name": "Living Switch",
                    "type": "switch",
                    "on" : "Living,Savant Host Master,RacePointMedia_touchpanel_server_1,1,SVC_ENV_LIGHTING,SwitchOn,Address1,003,Address2,1",
                    "off": "Living,Savant Host Master,RacePointMedia_touchpanel_server_1,1,SVC_ENV_LIGHTING,SwitchOff,Address1,003,Address2,1",
                    "query": "Living.LightsAreOn"
                },
                {
                    "name": "Suite HVAC",
                    "type": "thermostat",
                    "off": "Suite,Suite HVAC,HVAC_controller,1,SVC_ENV_HVAC,SetHVACModeOff,ThermostatAddress,1",
                    "cool": "Suite,Suite HVAC,HVAC_controller,1,SVC_ENV_HVAC,SetHVACModeCool,ThermostatAddress,1",
                    "heat": "Suite,Suite HVAC,HVAC_controller,1,SVC_ENV_HVAC,SetHVACModeOff,ThermostatAddress,1",
                    "set": "Suite,Suite HVAC,HVAC_controller,1,SVC_ENV_HVAC,SetCoolPointTemperature,ThermostatAddress,1,CoolPointTemperature,VARTEMP",
                    "queryTemp": "Suite HVAC.HVAC_controller.ThermostatCurrentCoolPoint_1",
                    "queryState": "Suite HVAC.HVAC_controller.ThermostatCurrentHVACMode_1"
                },
                {
                    "name": "Marketing Light",
                    "type": "lightbulb",
                    "on" : "Marketing,Savant Host Master,RacePointMedia_touchpanel_server_1,1,SVC_ENV_LIGHTING,DimmerSet,Address1,005,Address2,1,DimmerLevel,100",
                    "off": "Marketing,Savant Host Master,RacePointMedia_touchpanel_server_1,1,SVC_ENV_LIGHTING,DimmerSet,Address1,005,Address2,1,DimmerLevel,0",
                    "set": "Marketing,Savant Host Master,RacePointMedia_touchpanel_server_1,1,SVC_ENV_LIGHTING,DimmerSet,Address1,005,Address2,1,DimmerLevel,VARLEVEL",
                    "query": "Savant Host Master.RacePointMedia_touchpanel_server_1.CurrentDimmerLevel_1_005"
                }
             ]
        }
    ]
    
````

# DISCLAIMER
**This is work in progress!**

