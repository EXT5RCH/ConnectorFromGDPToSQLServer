var cc = DataStudioApp.createCommunityConnector();

/*
 * 認証処理
 */
function getAuthType() {
  var response = { type: "NONE" };
  return response;
}

/*
 * ユーザー項目の設定
 */
function getConfig() {
  var config = cc.getConfig();

  config.newInfo().setId("instructions").setText("データベース認証");

  config
    .newTextInput()
    .setId("hostname")
    .setName("ホスト名")
    .setPlaceholder("localhost");

  config
    .newTextInput()
    .setId("port")
    .setName("ポート (任意指定)")
    .setPlaceholder("1433");

  config
    .newTextInput()
    .setId("instance")
    .setName("インスタンス名")
    .setPlaceholder("instance1");

  config
    .newTextInput()
    .setId("username")
    .setName("ユーザー名")
    .setPlaceholder("scott");

  config
    .newTextInput()
    .setId("password")
    .setName("パスワード")
    .setPlaceholder("tiger");

  config
    .newTextInput()
    .setId("schema")
    .setName("スキーマ名")
    .setPlaceholder("SalesLT");

  config
    .newTextInput()
    .setId("table")
    .setName("テーブル名")
    .setPlaceholder("Customer");

  return config.build();
}

/*
 * 接続ボタン押下後の処理
 */
function getSchema(request) {
  var configParams = validateConfig(request.configParams);
  try {
    var fields = getFields(configParams);
    return cc.newGetSchemaResponse().setFields(fields).build();
  } catch (err) {
    throwUserError(err.message);
  }
}

/*
 * フィールド情報の取得処理
 */
function getData(request) {
  var configParams = validateConfig(request.configParams);

  try {
    // リクエストからテーブルへ表示したいフィールド一覧を取得
    var requestedFields = getFields(configParams).forIds(
      request.fields.map(function (field) {
        return field.name;
      })
    );
    return getDataFromSqlServer(configParams, requestedFields);
  } catch (err) {
    throwUserError(err.message);
  }
}
