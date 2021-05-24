import SQLite from 'react-native-sqlite-storage';

// Like Python range function
function range(end) {
  return [...Array(end).keys()];
}

export default class Database {
  constructor(args) {
    SQLite.DEBUG(true);
    SQLite.enablePromise(true);
    this.args = args;
  }

  async init() {
    this.db = await SQLite.openDatabase(this.args);
  }

  async setUser(username) {
    let [result] = await this.db.executeSql(
      'SELECT plant_id, max_air_humidity, max_soil_humidity, min_soil_humidity, min_air_humidity, max_temperature, min_temperature FROM plant NATURAL JOIN user WHERE username = ? ORDER BY time DESC LIMIT 5',
      [username],
    );
    let rows = result.rows;
    this.plants = range(rows.length).map(i => rows.item(i));
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
}
