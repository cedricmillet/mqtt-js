
    console.log( "script-mqtt.js ready!" );
	


	class MQTT_CONNECTOR {
		/*
			MQTT CONNECTOR - @Cédric MILLET
			permet d'utiliser Paho.MQTT.Client()
		*/
		constructor(host="test.mosquitto.org", port=8080,  timeout=2000) {
			//conn
			this.reconnectTimeout = timeout;
			this.host = host;
			this.port = port;
			this.timeout = timeout;
			//cfg
			this.debug = true;
			//core
			this.subs = [];
			this.client = null;
			this.receptor = null;
			this.connector = null;
			this.clientID = "c_" + parseInt((Math.random()+32) * 150 * Math.random());	//generation d'un ID client
		}
		
		//	Attribuer une fonction de traitement
		setReceiveFunction(func) {this.receptor = func;	}
		setConnectFunction(func) {this.connector = func;}
		//	Retourne l'ID client généré lors de l'instantiation de la classe
		getClientID() {	return this.clientID;}
		
		//	Se connecter au serveur MQTT
		connect() {
			let that = this;
			this.client = new Paho.MQTT.Client(this.host, Number(this.port),  this.clientID);
			//	Callbacks
			this.client.onConnectionLost = this.onConnectionLost;
			this.client.onMessageArrived = function (message) {
				let m = {
					topic : message.destinationName,
					data: message.payloadString,
					isRetained: message.retained
				};
				if(that.debug) console.log("onMessageArrived: ", message);
				that.receptor(m);
			}
			//	Connect the client with options
			this.client.connect({
				onSuccess: function() {
					console.log("[MQTT] - MQTT CLIENT CONNECTED.");
					//console.log(this.)
					if(!that.subs.length) console.log("[MQTT] - /!\ Vous n'êtes abonné à aucun topic.");
					for(let i=0;i<that.subs.length;i++) {
						console.log("[MQTT] - Subscribe to topic : ", that.subs[i]);
						that.client.subscribe(that.subs[i]);
					}
					that.connector();
				},
				onFailure: this.onFailure,
				timeout: this.timeout
			});
		}
		onConnectionLost(responseObject) 	{ console.log(responseObject); 	}
		onFailure(e)						{	console.log(e);				}
		
		//	S'abonner à un topic
		subscribe(topic) {
			this.subs.push(topic);
			
			if(!this.client) return;
			//	Si connexion déjà établie, on subscribe immédiatement
			if(this.client.isConnected()) 
				this.client.subscribe(topic);
		}

		//	Envoyer un message sur un topic donné
		publish(topic, payload) {
			if(!this.client.isConnected()) {
				console.log("[MQTT] - Impossible d'envoyer un message avant l'etablissement de la connexion au serveur MQTT.");
				return;
			}
			let message = new Paho.MQTT.Message(payload);
			message.destinationName = topic;
			message.qos = 0;
			let c = this.client.send(message);
			//if(!c) console.log("[MQTT] - Erreur lors du publish() du message : ", message, ", ack = ", c);
			//	Pas d'ACK, seul moyen de vérifier bonne reception est de vérifier l'évolution de l'état des actionneurs
		}
	}
	
	
	/*
		--- BROKERS DE TEST ---
		broker.mqtt-dashboard.com		8000
		test.mosquitto.org				8080
	*/
	/*
		--- Exemple d'utilisation ---
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
	*/
	
