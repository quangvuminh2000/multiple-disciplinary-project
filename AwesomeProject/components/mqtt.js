import * as Mqtt from 'react-native-native-mqtt';
import VIForegroundService from '@voximplant/react-native-foreground-service';
import BackgroundTimer from 'react-native-background-timer';
import {Buffer} from 'buffer';

class MqttClient {
  sensorData = {
    airHumid: null,
    temp: null,
    soilHumid: null,
    light: null,
  };
  sensorTopics = [
    //'NPNLab_BBC/feeds/bk-iot-temp-humid',
    'Group12/feeds/air-moisture',
    'Group12/feeds/temperature',
    //'NPNLab_BBC/feeds/bk-iot-soil',
    'Group12/feeds/soil-moisture',
    //'NPNLab_BBC/feeds/bk-iot-light',
    'Group12/feeds/light',
    'Group12/feeds/test2',
  ];

  constructor(callback) {
    //client = new Mqtt.Client('[SCHEME]://[URL]:[PORT]');
    let client = new Mqtt.Client('tcp://io.adafruit.com:1883');
    client.on(Mqtt.Event.Message, this.readSensor);

    client.on(Mqtt.Event.Connect, () => {
      console.log('MQTT Connect');
      client.subscribe(
        this.sensorTopics,
        Array(this.sensorTopics.length).fill(1),
      );
	callback();
    });

    client.on(Mqtt.Event.Error, error => {
      console.log('MQTT Error:', error);
    });

    client.on(Mqtt.Event.Disconnect, cause => {
      console.log('MQTT Disconnect:', cause);
    });
    this.client = client;
  }

  readSensor(topic, message) {
    console.log('Mqtt Message:', topic, message.toString());
    const data = JSON.parse(message);
    switch (parseInt(data.id)) {
        case 7:
            var temp, humid;
            [temp, humid] = data.data.split('-');
			this.airTemp = parseInt(temp);
			this.airHumid = parseInt(humid);
	console.log(temp, humid);
            break;
        case 9:
            this.soilHumid = parseInt(data.data);
            break;
        case 13:
            this.light = parseInt(data.data);
            break;
    }
    // Update notification
  }

  activateLight(clientId) {
    let data = {id: '6', name: 'traffic', data: '10', unit: ''};
    this.publish('Group12/feeds/bk-iot-traffic', data);
  }

  publish(topic, payload) {
    let data = Buffer.from(JSON.stringify(payload));
    this.client.publish(topic, data, 1);
  }

  checkCondition() {
    if (this.sensorData.light > 80 && this.sensorData.airTemp > 35) {
      // Notify user
      // Activate shading net
      // Log data
    }
  }

  start() {
    this.client.connect(
      {
        clientId: this.client.id,
        enableSsl: false,
        username: 'Group12',
        password: 'aio_atNP67yCNWakTjSOUHXJ2WpLiIdG',
        autoReconnect: true,
      },
      err => console.error(err),
    );
  }
}

async function startForegroundService() {
  const channelConfig = {
    id: 'channelId',
    name: 'Channel name',
    description: 'Channel description',
    enableVibration: false,
  };
  VIForegroundService.createNotificationChannel(channelConfig);
  const notificationConfig = {
    channelId: 'channelId',
    id: 3456,
    title: 'Title',
    text: 'Some text',
    icon: 'ic_icon',
  };
  try {
    await VIForegroundService.startService(notificationConfig);
    // mqttClient = new MqttClient(channelConfig.id).start();
    // mqttClient.start();
    // monitors = [SoilMonitor(mqttClient), AirMonitor(mqttClient), LightMonitor(mqttClient)];
    // BackgroundTimer.runBackgroundTimer(() => monitors.forEach(monitor => monitor.checkCondition()) , 300000);
  } catch (e) {
    console.error(e);
  }
}

class SoilMonitor {
  constructor(client) {
    this.client = client;
  }

  checkCondition() {
	  // console.log('Check condition');
    let temp = this.client.sensorData.temp;
    let humid = this.client.sensorData.soilHumid;
    if (humid <= 65 && temp >= 37) {
      // TODO: log data and notify user
      this.activate_pump();

      var intervalID = setInterval(() => {
        temp = this.client.sensorData.temp;
        humid = this.client.sensorData.soilHumid;

        if (temp <= 32 && humid >= 70) {
          this.deactivate_pump();
          clearInterval(intervalID);
        }
      }, 100);
    }
  }

  activate_pump() {
    let data = {id: '11', name: 'RELAY', data: '1', unit: ''};
    this.client.publish('Group12/feeds/test2', data);
  }

  deactivate_pump() {
    let data = {id: '11', name: 'RELAY', data: '0', unit: ''};
    this.client.publish('Group12/feeds/test2', data);
  }
}

class AirMonitor {
  constructor(client) {
    this.client = client;
  }

  async checkCondition() {
    let temp = this.client.sensorData.temp;
    let humid = this.client.sensorData.airHumid;
    if (humid <= 65 && temp >= 37) {
      // TODO: nofity user
      // this.notifyUser()
      // this.logData()
      this.activate_pump();
      var intervalID = setInterval(() => {
        temp = this.client.sensorData.temp;
        humid = this.client.sensorData.airHumid;

        if (temp <= 32 && humid >= 70) {
          this.deactivate_pump();
          clearInterval(intervalID);
        }
      }, 100);
    }
  }

  activate_pump() {
    let data = {id: '11', name: 'RELAY', data: '1', unit: ''};
    this.client.publish('NPNLab_BBC/feeds/bk-iot-relay', data);
  }

  deactivate_pump() {
    let data = {id: '11', name: 'RELAY', data: '0', unit: ''};
    this.client.publish('NPNLab_BBC/feeds/bk-iot-relay', data);
  }
}

class LightMonitor {
  constructor(client) {
    this.client = client;
  }

  async checkCondition() {
    let light = this.client.sensorData.light;
    let temp = this.client.sensorData.temp;
    if (light > 70 && temp >= 35) {
      // TODO: nofity user
      var intervalID = setInterval(() => {
        light = this.client.sensorData.light;

        if (light < 50) {
          this.deactivate_net();
          clearInterval(intervalID);
        }
      }, 100);
    }
  }

  activate_net() {
    let data = {id: '10', name: 'DRV_PWM', data: '255', unit: ''};
    this.client.publish('NPNLab_BBC/feeds/bk-iot-drv', data);
  }

  deactivate_net() {
    let data = {id: '10', name: 'DRV_PWM', data: '-255', unit: ''};
    this.client.publish('NPNLab_BBC/feeds/bk-iot-drv', data);
  }
}

export {
  MqttClient,
  SoilMonitor,
  AirMonitor,
  LightMonitor,
  startForegroundService,
};
