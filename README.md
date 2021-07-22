# ConnectorFromGDPToSQLServer
Google Data Portal から SQLServer への接続用コネクタ

# 使用上の注意
- `.clasp.json` の `scriptId` については、コネクタを実装するGoogle Apps Scriptのプロジェクトに対し、一意に発行されるIDを設定する必要があります。
設定方法は以下になります。
  1. Google App Scripts にて新規プロジェクトを作成する。
  1. 「プロジェクトの設定」を選択する。
  1. ID欄にて「スクリプトID」と記載されているのでこちらをコピーする。
  1. `.clasp.json` の `scriptId` へ先ほどコピーした「スクリプトID」を設定する。


- VSCodeで編集される場合はGoogle Apps Script APIの設定を`ON`にし、`package.json`へ記載されているscriptsを使用してください。
