import * as Mqtt from 'react-native-native-mqtt';
import VIForegroundService from '@voximplant/react-native-foreground-service';
import BackgroundTimer from 'react-native-background-timer';
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification from "react-native-push-notification";
import {Buffer} from 'buffer';
import {useState} from 'react';

let minTemp = 32;
let maxTemp = 37;
let minSoil = 65;
let maxSoil = 70;
let minAtmosphere = 65;
let maxAtmosphere = 70;



class MqttClient {
  #client;
  sensorTopics = [
    //'CSE_BBC/feeds/bk-iot-temp-humid',
    //'CSE_BBC/feeds/bk-iot-soil',
    //'CSE_BBC1/feeds/bk-iot-light',
    'Group12/feeds/bk-iot-temp-humid',
    'Group12/feeds/bk-iot-soil',
    'Group121/feeds/bk-iot-light',

  ];
  messageCallbacks = [];

  constructor(options, subscribedTopics) {
    // this.airHumid = 70;
    // this.temp = 30;
    // this.soilHumid = 70;
    // this.light = 0;

    this.options = options;
    this.subscribedTopics = subscribedTopics;
    //client = new Mqtt.Client('[SCHEME]://[URL]:[PORT]');
    this.#client = new Mqtt.Client('tcp://io.adafruit.com:1883');
    this.#client.on(Mqtt.Event.Connect, () => {
      console.log('MQTT Connect');
      this.#client.subscribe(
        this.subscribedTopics,
        Array(this.subscribedTopics.length).fill(1),
      );
    });
    this.#client.on(Mqtt.Event.Message, (topic, message) => {
      console.log('MQTT Message:', topic, message.toString());
      const data = JSON.parse(message);
      data.id = parseInt(data.id);
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
      for (const callback of this.messageCallbacks) {
        callback.bind(this)(data);
      }


      PushNotification.createChannel({
      channelId: "12", // (required)
      channelName: "Group12", // (required)

    },
    (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
  );
      //Notification setting
      PushNotification.configure({
      onRegister: function (token) {
        console.log("TOKEN:", token);
      },

      onNotification: function (notification) {
        console.log("NOTIFICATION:", notification);

        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },



      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    });
    });

    this.#client.on(Mqtt.Event.Error, error => {
      console.log('MQTT Error:', error);
    });

    this.#client.on(Mqtt.Event.Disconnect, cause => {
      console.log('MQTT Disconnect:', cause);
    });
    this.client = this.#client;
  }

  get connected() {
    return this.#client.connected;
  }

  publish(topic, payload) {
    let data = Buffer.from(JSON.stringify(payload));
    this.#client.publish(topic, data, 1);
  }



  start(connectCallback) {
    if (connectCallback) {
      this.#client.on(Mqtt.Event.Connect, () => {
        connectCallback.bind(this)();
      });
    }

    let connOpts = {
      clientId: this.#client.id,
      enableSsl: false,
      autoReconnect: true,
      ...this.options,
    };
    if (!this.connected) {
      this.#client.connect(connOpts, err => {
        if (err) {
          console.error('Error', err);
        }
      });
    }
  }

  stop() {
    this.#client.disconnect();
  }
}

const testClient = new MqttClient(
  {
    username: 'Group12',
    password: 'aio_atNP67yCNWakTjSOUHXJ2WpLiIdG',
  },
  [
    'Group12/feeds/bk-iot-temp-humid',
    'Group12/feeds/bk-iot-soil',
  ],
);

const testClient1 = new MqttClient(
  {
    username: 'Group121',
    password: 'aio_LkQT69vjPHPMV7o5zNfUOzR5YSza',
  },
  [ 'Group121/feeds/bk-iot-light',
    'Group121/feeds/bk-iot-relay',
    'Group121/feeds/bk-iot-drv'
  ],
);

const mqttClient = new MqttClient(
  {
    username: 'CSE_BBC',
    password: 'aio_KXfp47zegx3CthMAEj6pB0ZeKoEm',
  },
  ['CSE_BBC/feeds/bk-iot-temp-humid', 'CSE_BBC/feeds/bk-iot-soil'],
);

const mqttClient1 = new MqttClient(
  {
    username: 'CSE_BBC1',
    password: 'aio_yqUQ00Ryi2liePf8ElzL3yq3dNij',
  },
  ['CSE_BBC1/feeds/bk-iot-light',
    'CSE_BBC1/feeds/bk-iot-relay',
    'CSE_BBC1/feeds/bk-iot-drv'
  ],
);

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
  };

  soilPush = ()=>{
    PushNotification.localNotification({
    /* Android Only Properties */
    channelId: "12",
    showWhen: true, // (optional) default: true
    autoCancel: true, // (optional) default: true
    subText: "This is a subText", // (optional) default: none
    vibrate: true, // (optional) default: true
    vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
    //ignoreInForeground: true, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear). should be used in combine with `com.dieam.reactnativepushnotification.notification_foreground` setting
    timeoutAfter: 3000, // (optional) Specifies a duration in milliseconds after which this notification should be canceled, if it is not already canceled, default: null
    invokeApp: true, // (optional) This enable click on actions to bring back the application to foreground or stay in background, default: true

    title: "Soil Manager", // (optional)
    message: "Your soil irrigation is on", // (required)

  });}

  checkCondition() {
    // console.log('Check condition');
    let temp = this.client.temp;
    let humid = this.client.soilHumid;

    if (humid <= this.minSoil && temp >= this.maxTemp && !this.soilIrrigation){
       this.activate_pump();
       this.soilPush();
      }
    if (humid >= this.maxSoil && temp <= this.minTemp && this.soilIrrigation) this.deactivate_pump();
  }

  activate_pump() {
    //? re-setting conditions
    this.interval = 1000;
    this.soilIrrigation = true;

    //? Publish data to relay
    //let data = {id: '11', name: 'RELAY', data: '1', unit: ''};
    //this.client.publish('CSE_BBC1/feeds/bk-iot-relay', data);
    let data = {id: '11', name: 'RELAY_SOIL', data: '1', unit: ''};
    this.client.publish('Group121/feeds/bk-iot-relay', data);
  }

  deactivate_pump() {
    //? re-setting conditions
    this.interval = 5000;
    this.soilIrrigation = false;

    //? Publish data to relay
    //let data = {id: '11', name: 'RELAY', data: '0', unit: ''};
    //this.client.publish('CSE_BBC1/feeds/bk-iot-relay', data);
    let data = {id: '11', name: 'RELAY_SOIL', data: '0', unit: ''};
    this.client.publish('Group121/feeds/bk-iot-relay', data);
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

  airPush = ()=>{
    PushNotification.localNotification({
    /* Android Only Properties */
    channelId: "12",
    showWhen: true, // (optional) default: true
    autoCancel: true, // (optional) default: true
    subText: "This is a subText", // (optional) default: none
    vibrate: true, // (optional) default: true
    vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
    //ignoreInForeground: true, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear). should be used in combine with `com.dieam.reactnativepushnotification.notification_foreground` setting
    timeoutAfter: 3000, // (optional) Specifies a duration in milliseconds after which this notification should be canceled, if it is not already canceled, default: null
    invokeApp: true, // (optional) This enable click on actions to bring back the application to foreground or stay in background, default: true

    title: "Atmosphere manager", // (optional)
    message: "Your sprinkler is on", // (required)

  });}

  checkCondition() {
    let temp = this.client.temp;
    let humid = this.client.airHumid;
    if (humid <= this.minAtmosphere && temp >= this.maxTemp && !this.mistSpray){
      this.activate_spray();
      this.airPush();
      }
    if (humid >= this.maxAtmosphere && temp <= this.minTemp && this.mistSpray) this.deactivate_spray();

  }

  activate_spray() {
    //? re-setting conditions
    this.mistSpray = true;
    this.interval = 1000;

    // ? Publish data to the relay
    //let data = {id: '11', name: 'RELAY', data: '1', unit: ''};
    //this.client.publish('CSE_BBC1/feeds/bk-iot-relay', data);
    let data = {id: '11', name: 'RELAY_AIR', data: '1', unit: ''};
    this.client.publish('Group121/feeds/bk-iot-relay', data);
  }

  deactivate_spray() {
    //? re-setting conditions
    this.mistSpray = false;
    this.interval = 5000;

    // ? Publish data to the relay
    //let data = {id: '11', name: 'RELAY', data: '0', unit: ''};
    //this.client.publish('CSE_BBC1/feeds/bk-iot-relay', data);
    let data = {id: '11', name: 'RELAY_AIR', data: '0', unit: ''};
    this.client.publish('Group121/feeds/bk-iot-relay', data);
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


  lightPush = ()=>{
    PushNotification.localNotification({
    /* Android Only Properties */
    channelId: "12",
    showWhen: true, // (optional) default: true
    autoCancel: true, // (optional) default: true
    subText: "This is a subText", // (optional) default: none
    vibrate: true, // (optional) default: true
    vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
    //ignoreInForeground: true, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear). should be used in combine with `com.dieam.reactnativepushnotification.notification_foreground` setting
    timeoutAfter: 3000, // (optional) Specifies a duration in milliseconds after which this notification should be canceled, if it is not already canceled, default: null
    invokeApp: true, // (optional) This enable click on actions to bring back the application to foreground or stay in background, default: true

    title: "It's too bright!", // (optional)
    message: "Initiate Shader", // (required)

  });}

  checkCondition() {
    let light = this.client.light;
    let temp = this.client.temp;

    if (light > 70 && temp >= this.minTemp && this.net == false){
      this.activate_net();
      this.lightPush();
    }
    if (light < 50 && this.net == true) this.deactivate_net();
  }

  activate_net() {
    //? re-setting conditions
    this.net = true;
    this.interval = 1000;

    //? Publish data into drv
    let data = {id: '10', name: 'DRV_PWM', data: '255', unit: ''};
    //this.client.publish('CSE_BBC1/feeds/bk-iot-drv', data);
    this.client.publish('Group121/feeds/bk-iot-drv', data);
  }

  deactivate_net() {
    //? re-setting conditions
    this.net = false;
    this.interval = 5000;

    //? Publish data into drv
    let data = {id: '10', name: 'DRV_PWM', data: '-255', unit: ''};
    //this.client.publish('CSE_BBC1/feeds/bk-iot-drv', data);
    this.client.publish('Group121/feeds/bk-iot-drv', data);
  }
}

export {
  MqttClient,
  SoilMonitor,
  AirMonitor,
  LightMonitor,
  startForegroundService,
  testClient,
  testClient1,
  mqttClient,
  mqttClient1,
};
