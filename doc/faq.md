# 注意事項

## Cygnusが生成する履歴データ追加するinsert文と実際のカラム名が異なる
PosgreSQLでカラム名をアッパーケースとしたい場合 ダブルクォート("") で囲む必要がある。
https://www.postgresql.org/docs/16/sql-syntax-lexical.html#SQL-SYNTAX-IDENTIFIERS

> 識別子を引用符で囲むと大文字と小文字が区別されますが、引用符で囲まれていない名前は常に小文字に変換されます。

Cygnusが生成する履歴データを追加するinsert文はカラム名にアッパーケースが使われている場合でも、ダブルクォートで囲われていないため、実際はロアケースで登録される。

動作上の問題はないが、以下の懸念がある。

- Cygnusのログ上はアッパーケースだが実際はロアケースとなり違和感がある
- PostgreSQLに登録する履歴用テーブルに使うカラム名はロアケースにする必要がある

## コンテナ起動時にCygnusスキーマが生成されない場合がある

コンテナ起動時に存在チェック機構が存在しないため、Cygnusスキーマが存在しない場合がある

### 対応方法
- [init.sql](https://github.com/c-3lab/oasismap/blob/main/setup/init.sql)を手動実行する