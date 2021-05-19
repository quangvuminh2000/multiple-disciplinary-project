var results: SQLite.ResultSetRowList;
const response = async (): Promise<any> => {
  await ReadSingleProject(projectID).then((value) => {
    results = value as SQLite.ResultSetRowList; //defined 'undefined' value as ResultSetRowList and populate already defined results variable
    setSingleProject({
      projectName: results.item(0).projectName,
      projectID: results.item(0).projectID,
    });
  });
};
response();