import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormSelectItem } from '../../models/form-select-item';
import { 
  Address,
  Account, 
  AggregateTransaction,
  MosaicDefinitionTransaction,
  MosaicId,
  MosaicNonce,
  MosaicProperties,
  MosaicSupplyChangeTransaction,
  MosaicSupplyType,
  NamespaceHttp,
  NetworkType, 
  TransactionHttp, 
  Deadline,
  UInt64 } from 'nem2-sdk';
import { environment } from '../../../environments/environment';
import { NamespaceInfo } from '../../models/namespaceInfo';


@Component({
  selector: 'app-mosaic',
  templateUrl: './mosaic.component.html',
  styleUrls: ['./mosaic.component.scss']
})
export class MosaicComponent implements OnInit {
  env = environment;
  createMosaicForm: FormGroup;
  commissionType: {
    fixed: string,
    percentile: string
  } = {
    fixed: '固定徴収方式を選択すると、固定の徴収が発生します。' + 0.000005 + 'nem:xem',
    percentile: 'パーセンタイル徴収方式を選択すると、送信量により徴収量が変動します。送信モザイク 100 . score: の場合、徴収されるモザイクは 0 .000000 nem:xem送信モザイク 1 000 . score: の場合、徴収されるモザイクは 0 .000000 nem:xem 送信モザイク 3 145 . score: の場合、徴収されるモザイクは 0 .000001 nem:xem 送信モザイク 10 000 . score: の場合、徴収されるモザイクは 0 .000005 nem:xem 送信モザイク 0 . score: の場合、徴収されるモザイクは 0 .000000 nem:xem'
  }

  registerdNamespace: NamespaceInfo;
  registerdNamespaces: Array<any>;
  parentNamespaces: FormSelectItem[];

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    // Initialize Form
    this.createMosaicForm = this.fb.group({
      parentNamespace: ['', Validators.required],
      mosaicName: ['', Validators.required],
      initialSupply: ['', Validators.required],
      divisibility: [0, Validators.required],
      transferable: [false, Validators.required],
      supplyMutable: [false, Validators.required]
    })

    // Initialize Interface
    this.registerdNamespace = {
      namespaceId: null,
      namespaceName: null
    }

    this.getNamespacesFromAdmin();
  }

  cresteMosaic() {
    const txHttp = new TransactionHttp(this.env.node.url);
    const privateKey = this.env.admin.privateKey;
    const account = Account.createFromPrivateKey(privateKey, NetworkType.MIJIN_TEST);
    const nonce = MosaicNonce.createRandom();

    // モザイク定義
    const mosaicDefinitionTransaction = MosaicDefinitionTransaction.create(
      Deadline.create(),
      nonce,
      MosaicId.createFromNonce(nonce, account.publicAccount),
      MosaicProperties.create({
        supplyMutable: true,
        transferable: true,
        divisibility: 0
      }),
      NetworkType.MIJIN_TEST
    )

    // 供給量設定
    const mosaicSupplyChangeTransaction = MosaicSupplyChangeTransaction.create(
      Deadline.create(),
      mosaicDefinitionTransaction.mosaicId,
      MosaicSupplyType.Increase,
      UInt64.fromUint(1000000),
      NetworkType.MIJIN_TEST
    )

    // アグリゲートトランザクション
    const aggregateTransaction = AggregateTransaction.createComplete(
      Deadline.create(),
      [
        mosaicDefinitionTransaction.toAggregate(account.publicAccount),
        mosaicSupplyChangeTransaction.toAggregate(account.publicAccount)
      ],
      NetworkType.MIJIN_TEST,
      []);

      const networkGenerationHash = this.env.node.networkGenerationHash;
      const signedTx = account.sign(aggregateTransaction, networkGenerationHash);

      // キャスト
      txHttp
        .announce(signedTx)
        .subscribe(
          x => console.log(x),
          err => console.log(err)
        )      
  }


  // アカウントからネームスペース一覧取得
  getNamespacesFromAdmin() {
    const admin = Address.createFromRawAddress(this.env.admin.address);
    const nsHttp = new NamespaceHttp(this.env.node.url);

    nsHttp
      .getNamespacesFromAccount(admin)
      .subscribe(x => {
        x.forEach(el => {
          this.getNamespacesName(el.levels);
        });
      },
        err => console.log(err));
  }


  // NamespaceIdからネームスペース名取得
  getNamespacesName(namespaceId) {
    this.registerdNamespaces = [];
    const nsHttp = new NamespaceHttp(this.env.node.url);
    nsHttp
      .getNamespacesName(namespaceId)
      .subscribe(x => {
        this.registerdNamespace = {
          namespaceId: namespaceId,
          namespaceName: x[0].name
        }
        this.registerdNamespaces.push(this.registerdNamespace);
        console.log(this.registerdNamespaces);
      },
        err => console.log(err));
  }


}
