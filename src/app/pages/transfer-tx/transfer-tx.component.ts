import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { 
  Account, 
  AccountHttp, 
  Address, 
  NetworkCurrencyMosaic, 
  NetworkType, 
  Deadline, 
  PublicAccount, 
  TransferTransaction, 
  TransactionHttp, 
  MosaicHttp, 
  MosaicService } from 'nem2-sdk';
import { mergeMap } from 'rxjs/operators';
import { MosaicInfo } from '../../models/mosaicInfo';

@Component({
  selector: 'app-transfer-tx',
  templateUrl: './transfer-tx.component.html',
  styleUrls: ['./transfer-tx.component.scss']
})
export class TransferTxComponent implements OnInit {
  env = environment;
  txHash: string;
  txInfo: any;
  mosaic: MosaicInfo;
  adminHoldMosaics: Array<any>;
  getTxDisp: FormGroup;

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.mosaic = {
      mosaicId: null,
      amount: null
    }

    this.getTxDisp = this.fb.group({
      recipient: ['', Validators.required],
      publicKey: ['', Validators.required],
      mosaicId: ['', Validators.required],
      amount: ['', Validators.required],
      message: ['', Validators.required]
    });

    this.getHoldMosaics();
  }


  // 保有モザイク情報取得
  getHoldMosaics() {
    this.adminHoldMosaics = [];
    const accountHttp = new AccountHttp(this.env.node.url);
    const mosaicHttp = new MosaicHttp(this.env.node.url);
    const mosaicService = new MosaicService(accountHttp, mosaicHttp);
    const address = Address.createFromRawAddress(this.env.admin.address);

    mosaicService
      .mosaicsAmountViewFromAddress(address)
      .pipe(
        mergeMap((_) => _)
      )
      .subscribe(mo => {
        this.mosaic = {
          mosaicId: mo.fullName(),
          amount: mo.relativeAmount()
        }
        this.adminHoldMosaics.push(this.mosaic);
      },
        err => console.log(err));
  }


  // Admin KYC Mosaic送信
  sendMosaic() {
    const recipient = Address.createFromRawAddress(this.getTxDisp.value.recipient);
    const recipientPublicAccount = PublicAccount.createFromPublicKey(this.getTxDisp.value.publicKey, NetworkType.MIJIN_TEST, 2);
    const senderPrivateKey = this.env.admin.privateKey;
    const sender = Account.createFromPrivateKey(senderPrivateKey, NetworkType.MIJIN_TEST);
    const networkGenerationHash = this.env.node.networkGenerationHash;
    const encryptedMessage = sender.encryptMessage(this.getTxDisp.value.message, recipientPublicAccount, 2);

    const transferTx = TransferTransaction.create(
      Deadline.create(),
      recipient,
      [NetworkCurrencyMosaic.createRelative(10)],
      encryptedMessage,
      NetworkType.MIJIN_TEST);
    
    const signedTx = sender.sign(transferTx, networkGenerationHash);
    this.txHash = signedTx.hash;
    const txHttp = new TransactionHttp(this.env.node.url);
    txHttp
      .announce(signedTx)
      .subscribe(success => {
        console.log(success);
      },
        err => console.log(err),
        () => this.getTx(this.txHash));
  }


  // トランザクション情報取得
  getTx(txHash) {
    const txHttp = new TransactionHttp(this.env.node.url);
    txHttp
      .getTransaction(txHash)
      .subscribe(res => {
        this.txInfo = JSON.stringify(res, null, 4);
      },
        err => console.log(err));
  }


  // フォームリセット
  onCreateAccountFromReset() {
    this.getTxDisp.reset();
  }  

}
