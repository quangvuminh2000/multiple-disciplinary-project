export function ReadSingleProject(projectID) {
  return new Promise((resolve, reject) => {
    SQLite.openDatabase({
      name: "database.db",
      createFromLocation: "~database.db",
      location: "Library",
    }).then((db) =>
      db
        .transaction((tx) => {
          tx.executeSql(
            "SELECT * FROM projects WHERE projectID=?",
            [projectID],
            (tx, results) => {
              var len = results.rows.length;
              if (len > 0) {
                resolve(results.rows); //results wrapped in a promise!
              }
            }
          );
        })
        .catch((e) => {
          reject(console.log("Error: " + e));
        })
        .then(() => {
          db.close().catch((e) => {
            reject(console.log("Error: " + e));
          });
        })
    );
  });
}