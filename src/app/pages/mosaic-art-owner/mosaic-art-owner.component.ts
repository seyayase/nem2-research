import { Component, OnInit } from '@angular/core';
import { 
  Address, 
  AccountHttp, 
  AccountOwnedAssetService, 
  AssetHttp, 
  TransferTransaction,
  TransactionTypes } from "nem-library";
import { nodes } from '../../classes/nodes';
import { map } from 'rxjs/operators';

const base32Decode = require('base32-decode');
const pako = require('pako');

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  // admin
  admin = 'TBU64P26SEY3OJ6FEBPEVOZR237ZWY2GJMHMKR7W';

  // Frame
  frame: {
    address: any,
    privateKey: string
  } = {
    address: 'TDRWBJBA4T7KEQRNK66QD7DOZX7X7FSUEIUOVJEZ',
    privateKey: '7e93ae8b4855a45d4f4c6a520d4425f06fb0f1bf272b9dd37c699e5eeebaa2a1'
  }

  // Certification mosaic info
  ownerMosaic: {
    ns: string,
    mosaicName: string,
    quantity: number,
    data: any
  } = {
    ns: '',
    mosaicName: '',
    quantity: 0,
    data: ''
  }

  // Art mosaic info
  artMosaic :{
    txHash: any,
    txId: any,
    blockHeight: any,
    address: any,
    ns: any,
    mosaicName: any,
    quantity: any,
    base32Txt: any,
    data: any
  }= {
    txHash: null,
    txId: null,
    blockHeight: null,
    address: null,
    ns: null,
    mosaicName: null,
    quantity: 0,
    base32Txt: null,
    data: null
  }

  // Hold cert mosaics array
  holdCertMosaics:Array<any> = [];

  // img path
  imgPath: {
    iconArrowUnchanged: '../../../assets/images/icons/icon_arrow-unchanged.svg',
    iconArrowUp: '../../../assets/images/icons/icon_arrow-up.svg',
    iconArrowDown: '../../../assets/images/icons/icon_arrow-down.svg'
  }

  constructor() { }

  ngOnInit() {
    this.holdCertMosaics = [];
    this.getArtUserOwnedMosaics(this.frame.address);
  }


  // Owner保有の認証用モザイク取得
  getArtUserOwnedMosaics(frameAddress) {
    const accountOwnedMosaics = new AccountOwnedAssetService(new AccountHttp(nodes), new AssetHttp(nodes));
    accountOwnedMosaics
      .fromAddress(new Address(frameAddress))
      .subscribe((mosaics) => {
        for(let key of Object.keys(mosaics)) {
          if(mosaics[key].assetId.name == "cert"){
            // ネームスペースからアートモザイクのTX hashを抽出
            const namespace = mosaics[key].assetId.namespaceId;
            const subNamespace = "certification";
            const subNamespaceLen = subNamespace.length;
            const cutStr = '.';
            const index = namespace.indexOf(cutStr);
            const txHash = namespace.slice(index + subNamespaceLen);

            // オーナーモザイク情報を格納
            this.ownerMosaic = {
              ns: mosaics[key].assetId.namespaceId,
              mosaicName: mosaics[key].assetId.name,
              quantity: mosaics[key].quantity,
              data: ''
            }

            this.holdCertMosaics.push(this.ownerMosaic);
            this.getTxInfo(txHash);
          }
        }
      },
        err => console.log(err.toString));
  }


  // TX情報の取得
  getTxInfo(txHash) {
    const accountHttp = new AccountHttp();

    accountHttp.allTransactions(new Address(this.admin))
    .pipe(map((transactions: TransferTransaction[]) => {
      return transactions.filter(txs => txs.type == TransactionTypes.TRANSFER); // outgoingだけフィルタで取得
    }))
    .subscribe(txs => {
      txs.forEach(tx => {
        const txInfo = tx.getTransactionInfo();
        if(txInfo.hash.data == txHash) {
          this.artMosaic.txHash = txHash;
          this.artMosaic.txId = txInfo.id;
          this.artMosaic.blockHeight = txInfo.height;
          this.artMosaic.address = tx.recipient.pretty();
          tx.assets().forEach(el => {
            this.artMosaic.ns = el.assetId.namespaceId;
            this.artMosaic.mosaicName = el.assetId.name;
            this.artMosaic.quantity = el.quantity;
          });
          this.artMosaic.base32Txt = this.hex2a(tx.message.payload);  // 16進数を文字列へ変換
        }
      });
    },
      err => console.log(err),
      () => this.restoreMosaicArt(this.artMosaic.base32Txt)
    );
  }

  // 16進数から文字列変換
  hex2a(hexx) {
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
      str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
  }

  
  restoreMosaicArt(base32Txt) {
    // Base32でデコード
    const decodeTxt = base32Decode(base32Txt, 'Crockford');

    // gzip文字列を解凍
    const binData = new Uint8Array(decodeTxt);
    const data = pako.inflate(binData);
    const srtData = String.fromCharCode.apply(null, new Uint16Array(data));

    // 解凍データを変数格納し表示
    this.artMosaic.data = srtData;
  }
}
