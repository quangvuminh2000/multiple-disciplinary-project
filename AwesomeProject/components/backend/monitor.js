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
    // this.client = client;
    // this.data = data;
    // this.running = true;
    // this.checkCondition();
    this.checkCondition();
    emitter.on('sensorDataReceived', this.checkCondition);
  };

  stop = () => {
    // this.running = false;
    emitter.off('sensorDataReceived', this.checkCondition);
  };
}

class SoilMonitor extends Monitor {
  // soilIrrigation = false; // To know if the soil irrigation machine is activated

  soilPush = (message) => {
    PushNotification.localNotification({
      /* Android Only Properties */
      channelId: '12',
      showWhen: true, // (optional) default: true
      autoCancel: true, // (optional) default: true
      subText: 'This is a subText', // (optional) default: none
      vibrate: true, // (optional) default: true
      vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
      //ignoreInForeground: true, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear). should be used in combine with `com.dieam.reactnativepushnotification.notification_foreground` setting
      timeoutAfter: 5000, // (optional) Specifies a duration in milliseconds after which this notification should be canceled, if it is not already canceled, default: null
      invokeApp: true, // (optional) This enable click on actions to bring back the application to foreground or stay in background, default: true

      title: 'Soil Manager', // (optional)
      message: message, // (required)
    });
  };

  checkCondition = () => {
    console.log('Check condition', this.data.soilHumid, this.data.temp, this.data.soilIrrigation);

    if (
      this.data.soilHumid <= this.data.minSoilHumid &&
      this.data.temp >= this.data.maxTemp &&
      !this.data.soilIrrigation
    ) {
      this.activatePump();
      this.soilPush('Your soil irrigation is On');
    }
    if (
      this.data.soilHumid >= this.data.maxSoilHumid &&
      this.data.temp <= this.data.minTemp &&
      this.data.soilIrrigation
    ) {
      this.deactivatePump();
      this.soilPush('Soil Irrigation Off');
    }

    // if (this.running) {
    //   setTimeout(this.checkCondition, this.interval);
    // }
  };

  activatePump() {
    //? re-setting conditions
    this.interval = 1000;
    this.data.soilIrrigation = true;

    //? Publish data to relay
    //let data = {id: '11', name: 'RELAY', data: '1', unit: ''};
    //this.client.publish('CSE_BBC1/feeds/bk-iot-relay', data);
    let data = {id: '11', name: 'RELAY_SOIL', data: '1', unit: ''};
    this.client1.publish('Group121/feeds/bk-iot-relay', data);
    emitter.emit('pumpActivated', true);
  }

  deactivatePump() {
    //? re-setting conditions
    this.interval = 5000;
    this.data.soilIrrigation = false;

    //? Publish data to relay
    //let data = {id: '11', name: 'RELAY', data: '0', unit: ''};
    //this.client.publish('CSE_BBC1/feeds/bk-iot-relay', data);
    let data = {id: '11', name: 'RELAY_SOIL', data: '0', unit: ''};
    this.client1.publish('Group121/feeds/bk-iot-relay', data);
    emitter.emit('pumpActivated', false);
  }
}

class AirMonitor extends Monitor {
  // mistSpray = false; // To know if the mist-spray machine is activated

  airPush = (message) => {
    PushNotification.localNotification({
      /* Android Only Properties */
      channelId: '12',
      showWhen: true, // (optional) default: true
      autoCancel: true, // (optional) default: true
      subText: 'This is a subText', // (optional) default: none
      vibrate: true, // (optional) default: true
      vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
      //ignoreInForeground: true, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear). should be used in combine with `com.dieam.reactnativepushnotification.notification_foreground` setting
      timeoutAfter: 5000, // (optional) Specifies a duration in milliseconds after which this notification should be canceled, if it is not already canceled, default: null
      invokeApp: true, // (optional) This enable click on actions to bring back the application to foreground or stay in background, default: true

      title: 'Atmosphere manager', // (optional)
      message: message, // (required)
    });
  };

  checkCondition = () => {
    if (
      this.data.airHumid <= this.data.minAirHumid &&
      this.data.temp >= this.data.maxTemp &&
      !this.data.mistSpray
    ) {
      this.activateSpray();
      this.airPush('Your sprinkler is on');
    }
    if (
      this.data.airHumid >= this.data.maxAirHumid &&
      this.data.temp <= this.data.minTemp &&
      this.data.mistSpray
    ) {
      this.deactivateSpray();
      this.airPush('Sprinkler is Off');
    }

    // if (this.running) {
    //   setTimeout(this.checkCondition, this.interval);
    // }
  };

  activateSpray() {
    //? re-setting conditions
    this.data.mistSpray = true;
    this.interval = 1000;

    // ? Publish data to the relay
    //let data = {id: '11', name: 'RELAY', data: '1', unit: ''};
    //this.client.publish('CSE_BBC1/feeds/bk-iot-relay', data);
    let data = {id: '11', name: 'RELAY_AIR', data: '1', unit: ''};
    this.client1.publish('Group121/feeds/bk-iot-relay', data);
    emitter.emit('sprayActivated', true);
  }

  deactivateSpray() {
    //? re-setting conditions
    this.data.mistSpray = false;
    this.interval = 5000;

    // ? Publish data to the relay
    //let data = {id: '11', name: 'RELAY', data: '0', unit: ''};
    //this.client.publish('CSE_BBC1/feeds/bk-iot-relay', data);
    let data = {id: '11', name: 'RELAY_AIR', data: '0', unit: ''};
    this.client1.publish('Group121/feeds/bk-iot-relay', data);
    emitter.emit('sprayActivated', false);
  }
}

class LightMonitor extends Monitor {
  // net = false;

  lightPush = (message) => {
    PushNotification.localNotification({
      /* Android Only Properties */
      channelId: '12',
      showWhen: true, // (optional) default: true
      autoCancel: true, // (optional) default: true
      subText: 'This is a subText', // (optional) default: none
      vibrate: true, // (optional) default: true
      vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
      //ignoreInForeground: true, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear). should be used in combine with `com.dieam.reactnativepushnotification.notification_foreground` setting
      timeoutAfter: 5000, // (optional) Specifies a duration in milliseconds after which this notification should be canceled, if it is not already canceled, default: null
      invokeApp: true, // (optional) This enable click on actions to bring back the application to foreground or stay in background, default: true

      title: "It's too bright!", // (optional)
      message: message, // (required)
    });
  };

  checkCondition = () => {
    if (
      this.data.light >= 70 &&
      this.data.temp >= this.data.maxTemp &&
      !this.data.net
    ) {
      this.activateNet();
      this.lightPush('Initiate Shader');
    }
    if (
      this.data.light < 50 &&
      this.data.net
    ) {
      this.deactivateNet();
      this.lightPush('Deactivate Shader');
    }

    // if (this.running) {
    //   setTimeout(this.checkCondition, this.interval);
    // }
  };

  activateNet() {
    //? re-setting conditions
    this.data.net = true;
    this.interval = 1000;

    //? Publish data into drv
    let data = {id: '10', name: 'DRV_PWM', data: '255', unit: ''};
    //this.client.publish('CSE_BBC1/feeds/bk-iot-drv', data);
    this.client.publish('Group12/feeds/bk-iot-drv', data);
    emitter.emit('netActivated', true);
  }

  deactivateNet() {
    //? re-setting conditions
    this.data.net = false;
    this.interval = 5000;

    //? Publish data into drv
    let data = {id: '10', name: 'DRV_PWM', data: '-255', unit: ''};
    //this.client.publish('CSE_BBC1/feeds/bk-iot-drv', data);
    this.client.publish('Group12/feeds/bk-iot-drv', data);
    emitter.emit('netActivated', false);
  }
}

export {SoilMonitor, AirMonitor, LightMonitor};
