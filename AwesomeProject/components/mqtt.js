import * as Mqtt from 'react-native-native-mqtt';
import VIForegroundService from '@voximplant/react-native-foreground-service';
import BackgroundTimer from 'react-native-background-timer';
import {Buffer} from 'buffer';
import { useState } from 'react';

let minTemp = 32;
let maxTemp = 37;
let minSoil = 65;
let maxSoil = 70;
let minAtmosphere = 65;
let maxAtmosphere = 70;

class MqttClient {

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
    this.airHumid= 70;
    this.temp= 30;
    this.soilHumid= 70;
    this.light= 0;

    //client = new Mqtt.Client('[SCHEME]://[URL]:[PORT]');
    let client = new Mqtt.Client('tcp://io.adafruit.com:1883');
    client.on(Mqtt.Event.Message, (topic, message) => {
      console.log('Mqtt Message:', topic, message.toString());
      const data = JSON.parse(message);
      switch (parseInt(data.id)) {
          case 7:
              let temp, humid;
              [temp, humid] = data.data.split('-');
              this.temp = parseInt(temp);
              this.airHumid = parseInt(humid);
              break;
          case 9:
              this.soilHumid = parseInt(data.data);
              break;
          case 13:
              this.light = parseInt(data.data);
              break;
      }
      // Update notification
    });

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

  // readSensor(topic, message) {
  // }

  publish(topic, payload) {
    let data = Buffer.from(JSON.stringify(payload));
    this.client.publish(topic, data, 1);
  }

  checkCondition() {
    if (this.light > 80 && this.airTemp > 35) {
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
      (err) => { if(err){ console.error("Error",err); }},
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
    this.interval = 5000; // For the checking interval
    this.soilIrrigation = false; // To know if the soil irrigation machine is activated

    this.minSoil = 65;
    this.maxSoil = 70;
    this.minTemp = 32;
    this.maxTemp = 37;
  }

  checkCondition() {
	  // console.log('Check condition');
    let temp = this.client.temp;
    let humid = this.client.soilHumid;

    if (humid <= this.minSoil && temp >= this.maxTemp && !this.soilIrrigation) this.activate_pump();
    if (humid >= this.maxSoil && temp <= this.minTemp && this.soilIrrigation) this.deactivate_pump();
  }

  activate_pump() {
    //? re-setting conditions
    this.interval = 1000;
    this.soilIrrigation = true;

    //? Publish data to relay
    //let data = {id: '11', name: 'RELAY', data: '1', unit: ''};
    //this.client.publish('Group12/feeds/test2', data);
    let data = {id: '11', name: 'RELAY_SOIL', data: '1', unit: ''};
    this.client.publish('Group12/feeds/relay', data);
  }

  deactivate_pump() {
    //? re-setting conditions
    this.interval = 5000;
    this.soilIrrigation = false;

    //? Publish data to relay
    //let data = {id: '11', name: 'RELAY', data: '0', unit: ''};
    //this.client.publish('Group12/feeds/test2', data);
    let data = {id: '11', name: 'RELAY_SOIL', data: '0', unit: ''};
    this.client.publish('Group12/feeds/relay', data);
  }
}

class AirMonitor {
  constructor(client) {
    this.client = client;
    this.interval = 5000; // For the checking interval
    this.mistSpray = false; // To know if the mist-spray machine is activated

    this.minAtmosphere = 65;
    this.maxAtmosphere = 70;
    this.minTemp = 32;
    this.maxTemp = 37;
  }

  checkCondition() {
    let temp = this.client.temp;
    let humid = this.client.airHumid;

    if (humid <= this.minAtmosphere && temp >= this.maxTemp && !this.mistSpray) this.activate_spray();
    if (humid >= this.maxAtmosphere && temp <= this.minTemp && this.mistSpray) this.deactivate_spray();
    /*isCritical && !this.mistSpray
    isCitical         mistSpray             result
    true              true                  false
    true              false                 true
    false             true                  false
    false             false                 false

    !isCitical && this.mistSpray
    isCitical         mistSpray             result
    true              true                  false
    true              false                 false
    false             true                  true
    false             false                 false

    ==> The mist spray dvc will be manually on/off by the user when
          (isCitical, mistSpray) = (true, true), (false, false) // Pretty accurate
    */
  }

  activate_spray() {
    //? re-setting conditions
    this.mistSpray = true;
    this.interval = 1000;

    // ? Publish data to the relay
    //let data = {id: '11', name: 'RELAY', data: '1', unit: ''};
    //this.client.publish('NPNLab_BBC/feeds/bk-iot-relay', data);
    let data = {id: '11', name: 'RELAY_AIR', data: '1', unit: ''};
    this.client.publish('Group12/feeds/relay', data);
  }

  deactivate_spray() {
    //? re-setting conditions
    this.mistSpray = false;
    this.interval = 5000;

    // ? Publish data to the relay
    //let data = {id: '11', name: 'RELAY', data: '0', unit: ''};
    //this.client.publish('NPNLab_BBC/feeds/bk-iot-relay', data);
    let data = {id: '11', name: 'RELAY_AIR', data: '0', unit: ''};
    this.client.publish('Group12/feeds/relay', data);
  }
}

class LightMonitor {
  constructor(client) {
    this.client = client;
    this.net = false;
    this.interval = 5000;

    this.minTemp = 32;
    this.maxTemp = 37;
  }

  checkCondition() {
    let light = this.client.light;
    let temp = this.client.temp;

    if (light > 70 && temp >= this.minTemp && this.net == false) this.activate_net();
    if (light < 50 && this.net == true) this.deactivate_net();
  }

  activate_net() {
    //? re-setting conditions
    this.net = true;
    this.interval = 1000;

    //? Publish data into drv
    let data = {id: '10', name: 'DRV_PWM', data: '255', unit: ''};
    //this.client.publish('NPNLab_BBC/feeds/bk-iot-drv', data);
    this.client.publish('Group12/feeds/drv', data);
  }

  deactivate_net() {
    //? re-setting conditions
    this.net = false;
    this.interval = 5000;

    //? Publish data into drv
    let data = {id: '10', name: 'DRV_PWM', data: '-255', unit: ''};
    //this.client.publish('NPNLab_BBC/feeds/bk-iot-drv', data);
    this.client.publish('Group12/feeds/drv', data);
  }
}

export {
  MqttClient,
  SoilMonitor,
  AirMonitor,
  LightMonitor,
  startForegroundService,
};
