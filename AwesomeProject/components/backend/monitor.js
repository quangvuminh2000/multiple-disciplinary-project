import PushNotification from 'react-native-push-notification';
import emitter from 'tiny-emitter/instance';

class Monitor {
  interval = 5000; // For the checking interval
  running = false;
  callbacks = [];

  constructor(client, client1, data) {
    this.client = client;
    this.client1 = client1;
    this.data = data;
  }

  start = (client, data) => {
    this.checkCondition();
    emitter.on('sensorDataReceived', this.checkCondition);
  };

  stop = () => {
    // this.running = false;
    emitter.off('sensorDataReceived', this.checkCondition);
  };
  notiPush = (manager, message) => {
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
}

class SoilMonitor extends Monitor {
  checkCondition = () => {
    if (
      this.data.soilHumid <= this.data.minSoilHumid &&
      this.data.temp >= this.data.maxTemp &&
      !this.data.soilIrrigation
    ) {
      this.activatePump();
      this.notiPush('Soil Manager', 'Your soil irrigation is On');
    }
    if (
      this.data.soilHumid >= this.data.maxSoilHumid &&
      this.data.temp <= this.data.minTemp &&
      this.data.soilIrrigation
    ) {
      this.deactivatePump();
      this.notiPush('Soil Manager', 'Soil Irrigation Off');
    }
  };

  activatePump() {
    this.interval = 1000;
    this.data.soilIrrigation = true;

    let data = {id: "11", name: "RELAY", data: "1", unit: ""};
    this.client1.publish('CSE_BBC1/feeds/bk-iot-relay', data);
    //let data = {id: '11', name: 'RELAY_SOIL', data: '1', unit: ''};
    //this.client1.publish('Group121/feeds/bk-iot-relay', data);
    emitter.emit('pumpActivated', true);
  }

  deactivatePump() {
    this.interval = 5000;
    this.data.soilIrrigation = false;

    let data = {id: "11", name: "RELAY", data: "0", unit: ""};
    this.client1.publish('CSE_BBC1/feeds/bk-iot-relay', data);
    // let data = {id: '11', name: 'RELAY_SOIL', data: '0', unit: ''};
    // this.client1.publish('Group121/feeds/bk-iot-relay', data);
    emitter.emit('pumpActivated', false);
  }
}

class AirMonitor extends Monitor {
  checkCondition = () => {
    if (
      this.data.airHumid <= this.data.minAirHumid &&
      this.data.temp >= this.data.maxTemp &&
      !this.data.mistSpray
    ) {
      this.activateSpray();
      this.notiPush('Atmosphere Manager', 'Your sprinkler is on');
    }
    if (
      this.data.airHumid >= this.data.maxAirHumid &&
      this.data.temp <= this.data.minTemp &&
      this.data.mistSpray
    ) {
      this.deactivateSpray();
      this.notiPush('Atmosphere Manager', 'Sprinkler is Off');
    }
  };

  activateSpray() {
    this.data.mistSpray = true;
    this.interval = 1000;

    let data = {id: "11", name: "RELAY", data: "1", unit: ""};
    this.client1.publish('CSE_BBC1/feeds/bk-iot-relay', data);
    // let data = {id: '11', name: 'RELAY_AIR', data: '1', unit: ''};
    // this.client1.publish('Group121/feeds/bk-iot-relay', data);
    emitter.emit('sprayActivated', true);
  }

  deactivateSpray() {
    this.data.mistSpray = false;
    this.interval = 5000;

    let data = {id: "11", name: "RELAY", data: "0", unit: ""};
    this.client1.publish('CSE_BBC1/feeds/bk-iot-relay', data);
    // let data = {id: '11', name: 'RELAY_AIR', data: '0', unit: ''};
    // this.client1.publish('Group121/feeds/bk-iot-relay', data);
    emitter.emit('sprayActivated', false);
  }
}

class LightMonitor extends Monitor {
  checkCondition = () => {
    if (
      this.data.light >= 70 &&
      this.data.temp >= this.data.maxTemp &&
      !this.data.net
    ) {
      this.activateNet();
      this.notiPush('Lighting Manager', 'Initiate Shader');
    }
    if (this.data.light < 50 && this.data.net) {
      this.deactivateNet();
      this.notiPush('Lighting Manager', 'Deactivate Shader');
    }
  };

  activateNet() {
    this.data.net = true;
    this.interval = 1000;

    let data = {id: "17", name: "SERVO", data: "180", unit: "degree"};

    this.client1.publish('CSE_BBC1/feeds/bk-iot-servo', data);
    // this.client1.publish('Group121/feeds/bk-iot-servo', data);
    emitter.emit('netActivated', true);
  }

  deactivateNet() {
    this.data.net = false;
    this.interval = 5000;

    let data = {id: '17', name: 'SERVO', data: '0', unit: 'degree'};

    this.client1.publish('CSE_BBC1/feeds/bk-iot-servo', data);
    // this.client1.publish('Group121/feeds/bk-iot-servo', data);
    emitter.emit('netActivated', false);
  }
}

export {SoilMonitor, AirMonitor, LightMonitor};
