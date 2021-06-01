import * as Mqtt from 'react-native-native-mqtt';
import PushNotification from 'react-native-push-notification';
import {Buffer} from 'buffer';
import emitter from 'tiny-emitter/instance';

class MqttClient {
  #client;

  constructor(options, subscribedTopics) {
    this.options = options;
    this.subscribedTopics = subscribedTopics;
    this.#client = new Mqtt.Client('tcp://io.adafruit.com:1883');
    this.#client.on(Mqtt.Event.Connect, () => {
      console.log('MQTT Connect');
      this.mqttPush('MQTT','Connected');
      this.#client.subscribe(
        this.subscribedTopics,
        Array(this.subscribedTopics.length).fill(1),
      );
    });
    this.#client.on(Mqtt.Event.Message, this.onMessageArrived);

    this.#client.on(Mqtt.Event.Error, error => {
      console.log('MQTT Error:', error);
    });

    this.#client.on(Mqtt.Event.Disconnect, cause => {
      this.mqttPush('MQTT','Disconnected');
      console.log('MQTT Disconnect:', cause);
    });
    this.client = this.#client;
  }
  mqttPush = (manager, message) => {
    PushNotification.localNotification({
      /* Android Only Properties */
      channelId: '12',
      showWhen: true, // (optional) default: true
      autoCancel: false, // (optional) default: true
      ongoing: true,
      vibrate: true, // (optional) default: true
      vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
      //ignoreInForeground: true, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear). should be used in combine with `com.dieam.reactnativepushnotification.notification_foreground` setting
      timeoutAfter: 5000, // (optional) Specifies a duration in milliseconds after which this notification should be canceled, if it is not already canceled, default: null
      invokeApp: true, // (optional) This enable click on actions to bring back the application to foreground or stay in background, default: true

      title: manager, // (optional)
      message: message, // (required)
    });
  };
  onMessageArrived = (topic, message) => {
    console.log('MQTT Message:', topic, message.toString());
    const data = JSON.parse(message);
    data.id = parseInt(data.id);
    switch (parseInt(data.id)) {
      case 7:
        let temp, humid;
        [temp, humid] = data.data.split('-');
        this.temp = parseInt(temp);
        this.airHumid = parseInt(humid);
        emitter.emit('sensorDataReceived', 'air', this.airHumid);
        emitter.emit('sensorDataReceived', 'temperature', this.temp);
        break;
      case 9:
        this.soilHumid = Math.round((parseInt(data.data) / 1023) * 100);
        emitter.emit('sensorDataReceived', 'soil', this.soilHumid);
        break;
      case 13:
        this.light = Math.round((parseInt(data.data) / 1023) * 100);
        emitter.emit('sensorDataReceived', 'light', this.light);
        break;
    }
  };

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
  [
    'Group121/feeds/bk-iot-light',
    'Group121/feeds/bk-iot-relay',
    'Group121/feeds/bk-iot-servo',
  ],
);

const mqttClient = new MqttClient(
  {
    username: 'CSE_BBC',
    password: '',
  },
  [
    'CSE_BBC/feeds/bk-iot-temp-humid',
    'CSE_BBC/feeds/bk-iot-soil',
  ],
);

const mqttClient1 = new MqttClient(
  {
    username: 'CSE_BBC1',
    password: '',
  },
  [
    'CSE_BBC1/feeds/bk-iot-light', 
    'CSE_BBC1/feeds/bk-iot-relay',
    'CSE_BBC1/feeds/bk-iot-servo',
  ],
);

export {MqttClient, testClient, testClient1, mqttClient, mqttClient1};
