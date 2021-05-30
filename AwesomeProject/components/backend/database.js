import SQLite from 'react-native-sqlite-storage';
import emitter from 'tiny-emitter/instance';
var RNFS = require('react-native-fs');
// Like Python range function
function range(end) {
  return [...Array(end).keys()];
}

export default class Database {
  #fetchIntervalID;
  dataTable = ['light', 'temperature', 'air', 'soil'];
  fetchCallbacks = [];

  constructor(args) {
    SQLite.DEBUG(true);
    SQLite.enablePromise(true);
    this.args = args;

    emitter.on('pumpActivated', activated => {
      this.updateStatus('Relay Circuit', activated);
      this.updateStatus('Mini Pump', activated);
    });
    emitter.on('sprayActivated', activated => {
      this.updateStatus('Relay Circuit 2', activated);
      this.updateStatus('Mini Pump 2', activated);
    });
    emitter.on('netActivated', activated => {
      this.updateStatus('DRV Circuit', activated);
      this.updateStatus('RC Servo 590', activated);
    });
    emitter.on('sensorDataReceived', this.updateData);
  }

  async init() {
    // await SQLite.deleteDatabase({name: 'test4.db', location: 'default'});
    this.db = await SQLite.openDatabase(this.args);
    // await this.db.transaction(this.populateDB);
    // await this.updateData('soil', 50);
    this.cleanupOldData();
    this.fetchData();
    this.#fetchIntervalID = setInterval(this.fetchData, 5000);
    console.log('database', this.db);
  }

  async cleanup() {
    console.log('close database');
    if (this.#fetchIntervalID) {
      clearInterval(this.#fetchIntervalID);
      this.#fetchIntervalID = undefined;
    }
    await this.db.close();
  }

  preparePlantData = async plantData => {
    plantData.soilList = await this.fetchTable('soil');
    plantData.soilHumid = plantData.soilList[plantData.soilList.length - 1];
    plantData.airList = await this.fetchTable('air');
    plantData.airHumid = plantData.airList[plantData.airList.length - 1];
    plantData.tempList = await this.fetchTable('temperature');
    plantData.temp = plantData.tempList[plantData.tempList.length - 1];
    plantData.lightList = await this.fetchTable('light');
    plantData.light = plantData.lightList[plantData.lightList.length - 1];
    let sensorList = await this.fetchSensor();
    sensorList.forEach(sensor => {
      switch (sensor.name) {
        case 'Relay Circuit':
          plantData.soilIrrigation = sensor.online;
          break;
        case 'Relay Circuit 2':
          plantData.mistSpray = sensor.online;
          break;
        case 'DRV Circuit':
          plantData.net = sensor.online;
          break;
      }
    });
    emitter.once('userLogin', this.getUserSettings(plantData));
  };

  getUserSettings = plantData => async email => {
    let results = await this.db.executeSql(
      'SELECT user_id FROM user WHERE email = ?',
      [email],
    );
    let rows = results[0].rows;
    if (rows.length === 0) {
      throw 'Cannot find user with email ' + email;
    }
    this.userId = rows.item(0).user_id;
    results = await this.db.executeSql(
      'SELECT max_air_humidity, max_soil_humidity, min_soil_humidity, min_air_humidity, max_temperature, min_temperature FROM plant WHERE user_id = ?',
      [this.userId],
    );
    // let rows = result.rows;
    // this.plants = range(rows.length).map(i => rows.item(i));
    let plant = results[0].rows.item(0);
    console.log('query plant', plant);
    plantData.maxAirHumid = plant.max_air_humidity;
    plantData.maxSoilHumid = plant.max_soil_humidity;
    plantData.minSoilHumid = plant.min_soil_humidity;
    plantData.minAirHumid = plant.min_air_humidity;
    plantData.maxTemp = plant.max_temperature;
    plantData.minTemp = plant.min_temperature;
  };

  fetchTable = async table => {
    let results = await this.db.executeSql(
      'SELECT * FROM ' + table + ' ORDER BY time DESC LIMIT 5',
    );
    console.log('result query', results[0]);
    let rows = results[0].rows;
    let data = range(rows.length)
      .reverse()
      .map(i => rows.item(i).value);
    emitter.emit('databaseFetched', table, data);
    return data;
  };

  fetchData = () => Promise.all(this.dataTable.map(this.fetchTable));

  cleanupOldData = () => {
    for (const table of this.dataTable) {
      this.db
        .executeSql(
          'DELETE FROM ' + table + " WHERE date('now', '-7 day') >= date(time)",
        )
        .then(results => {
          if (results[0].rowsAffected > 0) {
            console.log('Data cleaned!');
          } else {
            console.log('Cleaning Failed');
          }
        });
    }
  };

  updateData = async (table, value) => {
    try {
      let date = new Date().toISOString().slice(0, 19).replace('T', ' ');
      // let date = new Date();
      // let time = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
      let [result] = await this.db.executeSql(
        'INSERT INTO ' + table + '(time, value) VALUES (?,?)',
        [date, value],
      );
      console.log('Results', result.rowsAffected);
      if (result.rowsAffected > 0) {
        console.log('Success');
      } else {
        console.log('Registration Failed');
      }
    } catch (err) {
      console.error(err.message);
      let [result] = await this.db.executeSql('SELECT * FROM ' + table);
      let rows = result.rows;
      let data = range(rows.length).map(i => rows.item(i));
      console.log('current data', data);
    }
  };

  // updatePlant = async (param, value) => {
  //   let [result] = await this.db.executeSql(
  //     'UPDATE (
  async updateStatus(sensorname, value) {
    let [
      result,
    ] = await this.db.executeSql(
      'UPDATE sensor SET online = ? WHERE name = ?',
      [value, sensorname],
    );
    console.log('Results', result.rowsAffected);
    if (result.rowsAffected > 0) {
      console.log('Update Success');
    } else {
      console.log('Update Failed');
    }
  }

  fetchSensor = async () => {
    let [result] = await this.db.executeSql('SELECT name, online FROM sensor');
    var rows = result.rows;
    let dataList = range(rows.length).map(i => rows.item(i));
    console.log('DATAFUCK: ', dataList);
    return dataList;
  };

  exportTable = async table => {
    let content = 'time,value\n';
    let results = await this.db.executeSql(
      'SELECT * FROM ' + table + ' ORDER BY time',
    );
    let rows = results[0].rows;
    content += range(rows.length)
      .map(i => rows.item(i))
      .map(row => row.time + ',' + row.value)
      .join('\n');
    let path = `${RNFS.DownloadDirectoryPath}/${table}.csv`;
    RNFS.writeFile(path, content,'utf8').then((success) => {
    console.log('FILE WRITTEN!');
    })
    .catch((err) => {
      console.log(err.message);
    });;
  };
}
