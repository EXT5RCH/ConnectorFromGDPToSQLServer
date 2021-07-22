/*
 * SQLServerへの接続
 */
function connectionSQLServer(sql, configParams) {
  var connectionString =
    "jdbc:sqlserver://" +
    configParams.hostname +
    ":" +
    configParams.port +
    ";databaseName=" +
    configParams.instance;
  var conn = Jdbc.getConnection(
    connectionString,
    configParams.username,
    configParams.password
  );
  return conn.prepareStatement(sql);
}

/*
 * SQLServerから対象のテーブルのフィールドを取得
 */
function getFields(configParams) {
  var fields = cc.getFields();
  var types = cc.FieldType;
  var sql =
    "SELECT * FROM sys.columns WHERE object_id = (SELECT object_id FROM sys.tables WHERE name = ? and schema_id = (SELECT schema_id FROM sys.schemas where name = ?))";

  var rs = null;

  configParams = configParams || {};

  try {
    var ps = connectionSQLServer(sql, configParams);
    ps.setString(1, configParams.table);
    ps.setString(2, configParams.schema);
    rs = ps.executeQuery();
    while (rs.next()) {
      fields
        .newDimension()
        .setId(rs.getString("name"))
        .setName(rs.getString("name"))
        .setType(setFieldType(types, rs.getInt("system_type_id")));
    }
  } catch (e) {
    throw e;
  } finally {
    if (rs !== null) {
      rs.close();
    }
  }

  return fields;
}

/*
 * SQLServerのデータ型をGoogleDataPortalのデータ型に変換
 */
function setFieldType(types, typeId) {
  switch (typeId) {
    case 36: // uniqueidentifier
    case 167: // varchar
    case 231: // nvarchar
    case 239: // nchar
    case 241: // xml
      type = types.TEXT;
      break;
    case 48: // tinyint
    case 52: // smallint
    case 56: // int
    case 60: // money
    case 108: // numeric
      type = types.NUMBER;
      break;
    case 104: // bit
      type = types.BOOLEAN;
      break;
    case 61: // datetime
      type = types.YEAR_MONTH_DAY_SECOND;
      break;
    default:
      // 対応していないものは随時追加
      throwUserError(JSON.stringify(field));
      break;
  }
  return type;
}

/*
 * GoogleDataPortalのデータ型を元にレコードセットからデータ取得
 */
function getFieldDataOfRecordSet(rs, field) {
  var value = null;
  switch (field.semantics.semanticType) {
    case "TEXT":
      value = rs.getString(field.name);
      break;
    case "NUMBER":
      value = rs.getBigDecimal(field.name);
      break;
    case "BOOLEAN":
      value = rs.getBoolean(field.name);
      break;
    case "YEAR_MONTH_DAY_SECOND":
      value = dateTimeFormat(rs.getTimestamp(field.name));
      break;
    default:
      // 対応していないものは随時追加してください。
      throwUserError(JSON.stringify(field));
      break;
  }
  return value;
}

/*
 * SQLServerからグラフで指定したデータを取得
 */
function getDataFromSqlServer(configParams, requestedFields) {
  var sql = "SELECT * FROM " + configParams.schema + "." + configParams.table;
  var rs = null;
  configParams = configParams || {};
  var records = [];

  try {
    var ps = connectionSQLServer(sql, configParams);
    rs = ps.executeQuery();
    while (rs.next()) {
      var record = [];
      requestedFields.build().forEach(function (field) {
        record.push(getFieldDataOfRecordSet(rs, field));
      });
      records.push(record);
    }
  } catch (e) {
    throw e;
  } finally {
    if (rs !== null) {
      rs.close();
    }
  }

  return cc
    .newGetDataResponse()
    .setFields(requestedFields)
    .addAllRows(records)
    .build();
}
