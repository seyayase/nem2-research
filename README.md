# NEM2 Research

NEM2調査用

## 環境構築

### Angular CLIのインストール

```
npm i -g @angular/cli@8.0.2
```

### nem2-cliのインストール

```
npm i -g nem2-cli
```

### TypeScriptのインストール
nem2-sdk は TypeScript で実装されています。NEM ブロックチェーンのアプリケーションの構築には JavaScript の代わりに TypeScript を使うことを推奨します。
バージョン 2.5.X 以上がインストールされていることを確認してください。
```
npm i -g typescript
```

インストールの確認
```
tsc -v
```
Version X.X.Xと出ればOK

### ts-nodeのインストール
ts-node を使うと TypeScript ファイルを node で実行できます。
```
npm i -g ts-node
```


### 

### node.jsのバージョン

```
v10.16.3
```

## 開発時
### ローカルサーバー立ち上げ

```
$ ng serve --open
```
`--open` オプション追加で `http://localhost:4200/` ブラウザ起動。
ソースファイルのいずれかを変更すると、アプリは自動的にリロードされます。

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
