import * as Mqtt from 'react-native-native-mqtt';
import VIForegroundService from '@voximplant/react-native-foreground-service';
import BackgroundTimer from 'react-native-background-timer';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
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

      PushNotification.createChannel(
        {
          channelId: '12', // (required)
          channelName: 'Group12', // (required)
        },
        created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
      );
      //Notification setting
      PushNotification.configure({
        onRegister: function (token) {
          console.log('TOKEN:', token);
        },

        onNotification: function (notification) {
          console.log('NOTIFICATION:', notification);

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
    'Group12/feeds/bk-iot-drv',
    'Group12/feeds/test2',
  ],
);

const testClient1 = new MqttClient(
  {
    username: 'Group121',
    password: 'aio_LkQT69vjPHPMV7o5zNfUOzR5YSza',
  },
  [
    'Group121/feeds/bk-iot-light',
    'Group121/feeds/bk-iot-relay',
    'Group121/feeds/test',
  ],
);

const mqttClient = new MqttClient(
  {
    username: 'CSE_BBC',
    password: 'aio_KXfp47zegx3CthMAEj6pB0ZeKoEm',
  },
  [
    'CSE_BBC/feeds/bk-iot-temp-humid',
    'CSE_BBC/feeds/bk-iot-soil',
    'CSE_BBC/feeds/bk-iot-drv',
  ],
);

const mqttClient1 = new MqttClient(
  {
    username: 'CSE_BBC1',
    password: 'aio_yqUQ00Ryi2liePf8ElzL3yq3dNij',
  },
  ['CSE_BBC1/feeds/bk-iot-light', 'CSE_BBC1/feeds/bk-iot-relay'],
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

export {
  MqttClient,
  startForegroundService,
  testClient,
  testClient1,
  mqttClient,
  mqttClient1,
};
