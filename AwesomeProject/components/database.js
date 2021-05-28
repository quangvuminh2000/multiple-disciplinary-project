import SQLite from 'react-native-sqlite-storage';

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

	populateDB(tx) {
		tx.executeSql('CREATE TABLE air (time datetime NOT NULL, value integer NOT NULL, PRIMARY KEY(time));');
		tx.executeSql('CREATE TABLE light (time datetime NOT NULL, value integer NOT NULL, PRIMARY KEY(time));');
		tx.executeSql('CREATE TABLE plant (plant_id integer NOT NULL, max_air_humidity integer NOT NULL, max_soil_humidity integer NOT NULL, min_soil_humidity integer NOT NULL, min_air_humidity integer NOT NULL, max_temperature integer NOT NULL, min_temperature integer NOT NULL, user_user_id integer NOT NULL, PRIMARY KEY (plant_id));');
		tx.executeSql('CREATE TABLE sensor (id integer NOT NULL, name varchar(100) NOT NULL, online boolean NOT NULL, user_user_id integer NOT NULL, PRIMARY KEY (id));');
		tx.executeSql('CREATE TABLE soil (time datetime NOT NULL, value integer NOT NULL, PRIMARY KEY (time));');
		tx.executeSql('CREATE TABLE temperature (time datetime NOT NULL, value integer NOT NULL, PRIMARY KEY (time));');
		tx.executeSql('CREATE TABLE user (user_id integer NOT NULL, username varchar(100) NOT NULL, password varchar(100) NOT NULL, phone_number varchar(10), email varchar(100) NOT NULL, PRIMARY KEY (user_id));');
	}

  async cleanup() {
    console.log('close database');
    if (this.#fetchIntervalID) {
      clearInterval(this.#fetchIntervalID);
      this.#fetchIntervalID = undefined;
    }
    await this.db.close();
  }

  async setUser(username) {
    let [result] = await this.db.executeSql(
      'SELECT plant_id, max_air_humidity, max_soil_humidity, min_soil_humidity, min_air_humidity, max_temperature, min_temperature FROM plant NATURAL JOIN user WHERE username = ?',
      [username],
    );
    let rows = result.rows;
    this.plants = range(rows.length).map(i => rows.item(i));
  }

  fetchData3 = async () => {
    for (const table of this.dataTable) {
      let [result] = await this.db.executeSql(
        'SELECT * FROM ' + table + ' ORDER BY time DESC LIMIT 5',
      );
      console.log('result query', result);
      let rows = result.rows;
      this[table] = range(rows.length).reverse().map(i => rows.item(i).value);
    }
	for (const callback of this.fetchCallbacks) {
		callback.bind(this)();
	}
  }

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
    // let date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    let date = new Date();
    let time = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    let [result] = await this.db.executeSql(
      'INSERT INTO ' + table + '(time, value) VALUES (?,?)',
      [time, value],
    );
    console.log('Results', result.rowsAffected);
    if (result.rowsAffected > 0) {
      console.log('Success');
    } else {
      console.log('Registration Failed');
    }
  }
}
