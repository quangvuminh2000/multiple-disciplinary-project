import SQLite from 'react-native-sqlite-storage';

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
  }

  async init() {
    console.log(this.dataTable);
    // await SQLite.deleteDatabase({name: 'test4.db', location: 'default'});
    this.db = await SQLite.openDatabase(this.args);
    // await this.db.transaction(this.populateDB);
    // await this.updateData('soil', 50);
    await this.fetchData3();
    this.#fetchIntervalID = setInterval(this.fetchData3, 5000);
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
      throw ('Cannot find user with email ' + email);
    }
    this.userId = rows.item(0);
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

  fetchData3 = async () => {
    for (const table of this.dataTable) {
      let [result] = await this.db.executeSql(
        'SELECT * FROM ' + table + ' ORDER BY time DESC LIMIT 5',
      );
      console.log('result query', result);
      let rows = result.rows;
      this[table] = range(rows.length)
        .reverse()
        .map(i => rows.item(i).value);
    }
    for (const callback of this.fetchCallbacks) {
      callback.bind(this)();
    }
  };

  async fetchData2() {
    let results = await this.db.transaction(tx => {
      for (const table of this.dataTable) {
        tx.executeSql('SELECT * FROM ' + table + ' ORDER BY time DESC LIMIT 5');
      }
    });
    console.log('result query', results);
    for (const i of this.dataTable.keys()) {
      let rows = results[i].rows;
      this[this.dataTable[i]] = range(rows.length).map(i => rows.item(i).value);
    }
  }

  async fetchData(table, setter) {
    let [result] = await this.db.executeSql(
      'SELECT * FROM ' + table + ' ORDER BY time DESC LIMIT 5',
    );
    var rows = result.rows;
    if (rows.length > 0) {
      let dataList = range(rows.length).map(i => rows.item(i).value);
      setter(dataList.reverse());
    }
  }

  async updateData(table, value) {
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
  }

  // updatePlant = async (param, value) => {
  //   let [result] = await this.db.executeSql(
  //     'UPDATE (
}
