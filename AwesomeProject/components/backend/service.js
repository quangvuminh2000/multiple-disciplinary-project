import VIForegroundService from '@voximplant/react-native-foreground-service';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import emitter from 'tiny-emitter/instance';

import Database from './database';
import {testClient, testClient1} from './mqtt';
import {SoilMonitor, AirMonitor, LightMonitor} from './monitor';

PushNotification.createChannel({
  channelId: '12', // (required)
  channelName: 'Group12', // (required)
});
//Notification setting
PushNotification.configure({
  onRegister: function (token) {},

  onNotification: function (notification) {
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

class ForegroundService {
  running = false;

  constructor() {
    this.channelId = 'channelId';
    this.plantData = {};
    emitter.on('sensorDataReceived', (dataType, data) => {
      switch (dataType) {
        case 'air':
          this.plantData.airHumid = data;
          break;
        case 'soil':
          this.plantData.soilHumid = data;
          break;
        case 'light':
          this.plantData.light = data;
          break;
        case 'temperature':
          this.plantData.temp = data;
          break;
      }
    });
    this.client = testClient;
    this.client1 = testClient1;
    this.soilMonitor = new SoilMonitor(
      this.client,
      this.client1,
      this.plantData,
    );
    this.airMonitor = new AirMonitor(this.client, this.client1, this.plantData);
    this.lightMonitor = new LightMonitor(
      this.client,
      this.client1,
      this.plantData,
    );
    this.database = new Database({
      name: 'test4.db',
      createFromLocation: '~test4.db',
    });
  }

  getApiKeys = async () => {
    let response = await fetch('http://dadn.esp32thanhdanh.link');
    let json = await response.json();
    return json.key.split(':');
  };

  start = async () => {
    if (this.running) {
      return;
    }
    this.running = true;
    const channelConfig = {
      id: this.channelId,
      name: 'Channel name',
      description: 'Channel description',
      enableVibration: false,
    };
    VIForegroundService.createNotificationChannel(channelConfig);
    const notificationConfig = {
      channelId: this.channelId,
      id: 3456,
      title: 'Title',
      text: 'Some text',
      icon: 'ic_icon',
    };
    try {
      await VIForegroundService.startService(notificationConfig);
      let apiKeys = await this.getApiKeys();
      this.client.options.password = apiKeys[0];
      this.client1.options.password = apiKeys[1];
      this.client.start();
      this.client1.start();
      await this.database.init();
      await this.database.preparePlantData(this.plantData);
      emitter.once('userLogin', this.startMonitors);
    } catch (e) {
      console.error(e);
    }
  };

  startMonitors = userEmail => {
    this.soilMonitor.start();
    this.airMonitor.start();
    this.lightMonitor.start();
  };

  stop = async () => {
    this.running = false;
    this.client.stop();
    this.client1.stop();
    await this.database.cleanup();
    await VIForegroundService.stopService();
  };
}

const service = new ForegroundService();
const plantData = service.plantData;
const database = service.database;

export {service, plantData, database};
