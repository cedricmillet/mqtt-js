# MQTT-JS

## Installation
* Inclure mqtt-websocket dans *<header>*
```<script src="https://cdnjs.cloudflare.com/ajax/libs/paho-mqtt/1.0.1/mqttws31.min.js" type="text/javascript"></script>```
* Inclure mqtt-script.js

## Utilisation
```javascript
	let mqtt = new MQTT_CONNECTOR("broker.mqtt-dashboard.com", 8000);
	mqtt.subscribe("esp61D4/#");
	mqtt.connect();
	mqtt.setReceiveFunction( function(data) {
		console.log("reception data :  ", data);	// contient le topic, le payload et isRetained
	});
	
	//	on envoie un msg apres connexion
	setTimeout(function() {
		mqtt.publish("esp61D4/led/set", "0");
	},2000);

```

## Brokers publics
* broker.mqtt-dashboard.com (port 8000)
* test.mosquitto.org (port 8080)
