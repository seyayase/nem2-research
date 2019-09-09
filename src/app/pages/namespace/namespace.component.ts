import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormSelectItem } from '../../models/form-select-item';
import { Account, RegisterNamespaceTransaction, NamespaceHttp, NamespaceId, TransactionHttp, UInt64, NetworkType, Deadline, Address } from 'nem2-sdk';
import { environment } from '../../../environments/environment';
import { NamespaceInfo } from '../../models/namespaceInfo';

@Component({
  selector: 'app-namespace',
  templateUrl: './namespace.component.html',
  styleUrls: ['./namespace.component.scss']
})
export class NamespaceComponent implements OnInit {
  env = environment;
  txHash: string;
  txInfo: any;

  registerNamespaceForm: FormGroup;
  registerSubNamespaceForm: FormGroup;

  parentNamespaces: FormSelectItem[];

  registerdNamespace: NamespaceInfo;
  registerdNamespaces: Array<any>;

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    // Initialize Form
    this.registerNamespaceForm = this.fb.group({
      namespaceName: ['', Validators.required]
    });

    this.registerSubNamespaceForm = this.fb.group({
      parentNamespace: ['', Validators.required],
      namespaceName: ['', Validators.required]
    });

    this.registerdNamespace = {
      namespaceId: null,
      namespaceName: null
    }

    this.getNamespacesFromAdmin();
  }


  // Namespaceの登録
  registerNamespace() {
    const namespaceName = this.registerNamespaceForm.value.namespaceName;
    const privateKey = this.env.admin.privateKey;
    const admin = Account.createFromPrivateKey(privateKey, NetworkType.MIJIN_TEST);
    const networkGenerationHash = this.env.node.networkGenerationHash;
    
    const registerNamespaceTx = RegisterNamespaceTransaction.createRootNamespace(
      Deadline.create(),
      namespaceName,
      UInt64.fromUint(1000),
      NetworkType.MIJIN_TEST);
    
    const signedTx = admin.sign(registerNamespaceTx, networkGenerationHash);
    this.txHash = signedTx.hash;

    const txHttp = new TransactionHttp(this.env.node.url);
    txHttp
      .announce(signedTx)
      .subscribe(
        x => console.log(x),
        err => console.log(err),
        () => this.getTx(this.txHash));
  }


  // SubNamespaceの登録
  registerSubNamespace() {
    const rootNamespace = 'hage';
    const subNamespace = 'hoge';
    const privateKey = this.env.admin.privateKey;
    const admin = Account.createFromPrivateKey(privateKey, NetworkType.MIJIN_TEST);
    const networkGenerationHash = this.env.node.networkGenerationHash;

    const registerSubNamespaceTx = RegisterNamespaceTransaction.createSubNamespace(
      Deadline.create(),
      rootNamespace,
      subNamespace,
      NetworkType.MIJIN_TEST);

    const signedTx = admin.sign(registerSubNamespaceTx, networkGenerationHash);
    this.txHash = signedTx.hash;

    const txHttp = new TransactionHttp(this.env.node.url);
    txHttp
      .announce(signedTx)
      .subscribe(
        x => console.log(x),
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
