import SQLite from 'react-native-sqlite-storage';
import emitter from 'tiny-emitter/instance';

// Like Python range function
function range(end) {
  return [...Array(end).keys()];
}

export default class Database {
  #fetchIntervalID;
  dataTable = ['light', 'temperature', 'air', 'soil'];
  fetchCallbacks = [];

  constructor(args, data) {
    SQLite.DEBUG(true);
    SQLite.enablePromise(true);
    this.args = args;
    this.data = data;

    emitter.on('pumpActivated', () => {
      this.updateStatus('Relay Circuit', 1);
      this.updateStatus('Mini Pump', 1);
    });
    emitter.on('pumpDeactivated', () => {
      this.updateStatus('Relay Circuit', 0);
      this.updateStatus('Mini Pump', 0);
    });
    emitter.on('sprayActivated', () => {
      this.updateStatus('Relay Circuit 2', 1);
      this.updateStatus('Mini Pump 2', 1);
    });
    emitter.on('sprayDeactivated', () => {
      this.updateStatus('Relay Circuit 2', 0);
      this.updateStatus('Mini Pump 2', 0);
    });
    emitter.on('netActivated', () => {
      this.updateStatus('DRV Circuit', 1);
      this.updateStatus('RC Servo 590', 1);
    });
    emitter.on('netDeactivated', () => {
      this.updateStatus('DRV Circuit', 0);
      this.updateStatus('RC Servo 590', 0);
    });
  }

  async init() {
    console.log(this.dataTable);
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

  async setUser(email) {
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
    this.data.maxAirHumid = parseInt(plant.max_air_humidity);
    this.data.maxSoilHumid = parseInt(plant.max_soil_humidity);
    this.data.minSoilHumid = parseInt(plant.min_soil_humidity);
    this.data.minAirHumid = parseInt(plant.min_air_humidity);
    this.data.maxTemp = parseInt(plant.max_temperature);
    this.data.minTemp = parseInt(plant.min_temperature);
  }

  fetchData = () => {
    for (const table of this.dataTable) {
      this.db
        .executeSql('SELECT * FROM ' + table + ' ORDER BY time DESC LIMIT 5')
        .then(results => {
          console.log('result query', results[0]);
          let rows = results[0].rows;
          this[table] = range(rows.length)
            .reverse()
            .map(i => rows.item(i).value);
          emitter.emit('databaseFetched', table, this[table]);
        });
    }
  };

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

  async updateData(table, value) {
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
  }

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
}
