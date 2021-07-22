/*
 * エラー時の処理
 */
function throwUserError(message) {
  cc.newUserError().setText(message).throwException();
}
