import VIForegroundService from '@voximplant/react-native-foreground-service';
import emitter from 'tiny-emitter/instance';

import Database from './database';
import {testClient, testClient1} from './mqtt';
import {SoilMonitor, AirMonitor, LightMonitor} from './monitor';

export default class ForegroundService {
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

  start = async () => {
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
      this.client.start();
      this.client1.start();
      await this.database.init();
      emitter.once('userLogin', this.startMonitors);
    } catch (e) {
      console.error(e);
    }
  };

  startMonitors = async userEmail => {
    let plant = await this.database.getUserSettings(userEmail);
    this.plantData.maxAirHumid = plant.max_air_humidity;
    this.plantData.maxSoilHumid = plant.max_soil_humidity;
    this.plantData.minSoilHumid = plant.min_soil_humidity;
    this.plantData.minAirHumid = plant.min_air_humidity;
    this.plantData.maxTemp = plant.max_temperature;
    this.plantData.minTemp = plant.min_temperature;
    this.database.fetchData();
    this.plantData.soilHumid = this.database.soil[
      this.database.soil.length - 1
    ];
    this.plantData.airHumid = this.database.air[this.database.air.length - 1];
    this.plantData.temp = this.database.temperature[
      this.database.temperature.length - 1
    ];
    this.plantData.light = this.database.light[this.database.light.length - 1];
    this.soilMonitor.start();
    this.airMonitor.start();
    this.lightMonitor.start();
  };

  stop = async () => {
    this.client.stop();
    this.client1.stop();
    await this.database.cleanup();
    await VIForegroundService.stopService();
  };
}
