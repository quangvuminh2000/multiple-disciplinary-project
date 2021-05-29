import PushNotification from 'react-native-push-notification';

class Monitor {
  interval = 5000; // For the checking interval
  running = false;

  constructor(client, client1, data) {
    this.client = client;
    this.client1 = client1;
    this.data = data;
  }

  start = (client, data) => {
    // this.client = client;
    // this.data = data;
    this.running = true;
    this.checkCondition();
  };

  stop = () => {
    this.running = false;
  };
}

class SoilMonitor extends Monitor {
  soilIrrigation = false; // To know if the soil irrigation machine is activated

  soilPush = () => {
    PushNotification.localNotification({
      /* Android Only Properties */
      channelId: '12',
      showWhen: true, // (optional) default: true
      autoCancel: true, // (optional) default: true
      subText: 'This is a subText', // (optional) default: none
      vibrate: true, // (optional) default: true
      vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
      //ignoreInForeground: true, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear). should be used in combine with `com.dieam.reactnativepushnotification.notification_foreground` setting
      timeoutAfter: 3000, // (optional) Specifies a duration in milliseconds after which this notification should be canceled, if it is not already canceled, default: null
      invokeApp: true, // (optional) This enable click on actions to bring back the application to foreground or stay in background, default: true

      title: 'Soil Manager', // (optional)
      message: 'Your soil irrigation is on', // (required)
    });
  };

  checkCondition = () => {
    // console.log('Check condition');
    let temp = this.data.soilTemp;
    let humid = this.data.soilHumid;

    if (
      this.data.soilHumid <= this.data.minSoilHumid &&
      this.data.temp >= this.data.maxTemp &&
      !this.soilIrrigation
    ) {
      this.activate_pump();
      this.soilPush();
    }
    if (
      this.data.soilHumid >= this.data.maxSoilHumid &&
      this.data.temp <= this.data.minTemp &&
      this.soilIrrigation
    ) {
      this.deactivate_pump();
    }

    if (this.running) {
      setTimeout(this.checkCondition, this.interval);
    }
  };

  activate_pump() {
    //? re-setting conditions
    this.interval = 1000;
    this.soilIrrigation = true;

    //? Publish data to relay
    //let data = {id: '11', name: 'RELAY', data: '1', unit: ''};
    //this.client.publish('CSE_BBC1/feeds/bk-iot-relay', data);
    let data = {id: '11', name: 'RELAY_SOIL', data: '1', unit: ''};
    this.client1.publish('Group121/feeds/bk-iot-relay', data);
    this.data.database.updateStatus('Relay Circuit',1);
    this.data.database.updateStatus('Mini Pump',1);
  }

  deactivate_pump() {
    //? re-setting conditions
    this.interval = 5000;
    this.soilIrrigation = false;

    //? Publish data to relay
    //let data = {id: '11', name: 'RELAY', data: '0', unit: ''};
    //this.client.publish('CSE_BBC1/feeds/bk-iot-relay', data);
    let data = {id: '11', name: 'RELAY_SOIL', data: '0', unit: ''};
    this.client1.publish('Group121/feeds/bk-iot-relay', data);
    this.data.database.updateStatus('Relay Circuit',0);
    this.data.database.updateStatus('Mini Pump',0)
  }
}

class AirMonitor extends Monitor {
  mistSpray = false; // To know if the mist-spray machine is activated

  airPush = () => {
    PushNotification.localNotification({
      /* Android Only Properties */
      channelId: '12',
      showWhen: true, // (optional) default: true
      autoCancel: true, // (optional) default: true
      subText: 'This is a subText', // (optional) default: none
      vibrate: true, // (optional) default: true
      vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
      //ignoreInForeground: true, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear). should be used in combine with `com.dieam.reactnativepushnotification.notification_foreground` setting
      timeoutAfter: 3000, // (optional) Specifies a duration in milliseconds after which this notification should be canceled, if it is not already canceled, default: null
      invokeApp: true, // (optional) This enable click on actions to bring back the application to foreground or stay in background, default: true

      title: 'Atmosphere manager', // (optional)
      message: 'Your sprinkler is on', // (required)
    });
  };

  checkCondition = () => {
    let temp = this.client.temp;
    let humid = this.client.airHumid;
    if (
      this.data.airHumid <= this.data.minAirHumid &&
      this.data.temp >= this.data.maxTemp &&
      !this.mistSpray
    ) {
      this.activate_spray();
      this.airPush();
    }
    if (
      this.data.airHumid >= this.data.maxAirHumid &&
      this.data.temp <= this.data.minTemp &&
      this.mistSpray
    ) {
      this.deactivate_spray();
    }

    if (this.running) {
      setTimeout(this.checkCondition, this.interval);
    }
  };

  activate_spray() {
    //? re-setting conditions
    this.mistSpray = true;
    this.interval = 1000;

    // ? Publish data to the relay
    //let data = {id: '11', name: 'RELAY', data: '1', unit: ''};
    //this.client.publish('CSE_BBC1/feeds/bk-iot-relay', data);
    let data = {id: '11', name: 'RELAY_AIR', data: '1', unit: ''};
    this.client1.publish('Group121/feeds/bk-iot-relay', data);
    this.data.database.updateStatus('Relay Circuit 2',1);
    this.data.database.updateStatus('Mini Pump 2',1);
  }

  deactivate_spray() {
    //? re-setting conditions
    this.mistSpray = false;
    this.interval = 5000;

    // ? Publish data to the relay
    //let data = {id: '11', name: 'RELAY', data: '0', unit: ''};
    //this.client.publish('CSE_BBC1/feeds/bk-iot-relay', data);
    let data = {id: '11', name: 'RELAY_AIR', data: '0', unit: ''};
    this.client1.publish('Group121/feeds/bk-iot-relay', data);
    this.data.database.updateStatus('Relay Circuit 2',0);
    this.data.database.updateStatus('Mini Pump 2',0);
  }
}

class LightMonitor extends Monitor {
  net = false;

  lightPush = () => {
    PushNotification.localNotification({
      /* Android Only Properties */
      channelId: '12',
      showWhen: true, // (optional) default: true
      autoCancel: true, // (optional) default: true
      subText: 'This is a subText', // (optional) default: none
      vibrate: true, // (optional) default: true
      vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
      //ignoreInForeground: true, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear). should be used in combine with `com.dieam.reactnativepushnotification.notification_foreground` setting
      timeoutAfter: 3000, // (optional) Specifies a duration in milliseconds after which this notification should be canceled, if it is not already canceled, default: null
      invokeApp: true, // (optional) This enable click on actions to bring back the application to foreground or stay in background, default: true

      title: "It's too bright!", // (optional)
      message: 'Initiate Shader', // (required)
    });
  };



  checkCondition = () => {
    let light = this.client.light;
    let temp = this.client.temp;
    if (
      this.data.light >= 70 &&
      this.data.temp >= this.data.maxTemp &&
      !this.net
    ) {
      this.activate_net();
      this.lightPush();
    }
    if (
      this.data.light < 50 &&
      this.data.temp <= this.data.minTemp &&
      this.net
    ) {
      this.deactivate_net();
    }

    if (this.running) {
      setTimeout(this.checkCondition, this.interval);
    }
  };

  activate_net() {
    //? re-setting conditions
    this.net = true;
    this.interval = 1000;

    //? Publish data into drv
    let data = {id: '10', name: 'DRV_PWM', data: '255', unit: ''};
    //this.client.publish('CSE_BBC1/feeds/bk-iot-drv', data);
    this.client.publish('Group12/feeds/bk-iot-drv', data);
    this.data.database.updateStatus('DRV Circuit',1);
    this.data.database.updateStatus('RC Servo 590',1);
  }

  deactivate_net() {
    //? re-setting conditions
    this.net = false;
    this.interval = 5000;

    //? Publish data into drv
    let data = {id: '10', name: 'DRV_PWM', data: '-255', unit: ''};
    //this.client.publish('CSE_BBC1/feeds/bk-iot-drv', data);
    this.client.publish('Group12/feeds/bk-iot-drv', data);
    this.data.database.updateStatus('DRV Circuit',0);
    this.data.database.updateStatus('RC Servo 590',0);
  }
}

export {SoilMonitor, AirMonitor, LightMonitor};
