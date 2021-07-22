/*
 * 入力値のチェック
 */
function validateConfig(configParams) {
  configParams = configParams || {};
  if (!configParams.hostname) {
    throwUserError("hostname が未設定です。");
  }
  if (!configParams.port) {
    throwUserError("port が未設定です。");
  }
  if (!configParams.instance) {
    throwUserError("instance が未設定です。");
  }
  if (!configParams.username) {
    throwUserError("username が未設定です。");
  }
  if (!configParams.password) {
    throwUserError("password が未設定です。");
  }
  if (!configParams.schema) {
    throwUserError("schema が未設定です。");
  }
  if (!configParams.table) {
    throwUserError("table が未設定です。");
  }
  return configParams;
}
