import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import {  
  Account, 
  Address, 
  AssetId, 
  TimeWindow, 
  TransactionHttp, 
  AssetDefinition, 
  AssetDefinitionCreationTransaction, 
  PublicAccount, 
  AssetProperties, 
  AssetLevy, 
  AssetLevyType, 
  Password, 
  EncryptedPrivateKey,
  SimpleWallet,
  ProvisionNamespaceTransaction,
  AccountHttp

 } from "nem-library";
import { nodes } from '../../classes/nodes';

@Component({
  selector: 'app-mosaic-art-creator',
  templateUrl: './mosaic-art-creator.component.html',
  styleUrls: ['./mosaic-art-creator.component.scss']
})
export class MosaicArtCreatorComponent implements OnInit {
  reactiveForm: FormGroup;
  selected = 'option2';

  generateAccount = {
    status: 'Success',
    address: 'TBU64P26SEY3OJ6FEBPEVOZR237ZWY2GJMHMKR7W',
    privateKey: 'e2c441e3b568d9434fff8b255c95def8fc8761d60d02c619e0fbf24a8f8bb63d'
  }

  registerNamespaceform = new FormGroup({
    parent: new FormControl(),
    namaspace: new FormControl(),
    password: new FormControl()
  });

  admin = {
    address: 'TBU64P26SEY3OJ6FEBPEVOZR237ZWY2GJMHMKR7W',
    privateKey: 'e2c441e3b568d9434fff8b255c95def8fc8761d60d02c619e0fbf24a8f8bb63d',
    mosaic: {
      nameSpace: null,
      name: null,
      balance: 0
    }
  }

  nameSpace = {
    no01: {
      rns: 'ascii_art',
      sns: '2019_nice'
    },
    no02: {
      rns: 'ascii_art',
      sns1: 'certificate',
      sns2: '2019_nice-tbu64p26sey3oj6febpevozr237zwy2gjmhmkr7w'
    }
  }

  mosaics = {
    nice: {
      rootNameSpace: this.nameSpace.no01.rns,
      subNameSapce: this.nameSpace.no01.sns,
      cert_mosaic: {
        mosaicName: 'cert'
      },
      art_mosaic0: {
        id: '0-',
        data: '3y5gg237dw3nt003dsmp6s9eehw78'
      },
      art_mosaic1: {
        id: '1-',
        data: '05njprgx0s02107ffp2e0xnqgymrk2'
      },
      art_mosaic2: {
        id: '2-',
        data: 't8je3nnz04mwkzvzj89xppt0f8e7ck'
      },
      art_mosaic3: {
        id: '3-',
        data: 'ctbxhrs29t1he4rg3hcqkhsw03t84z'
      },
      art_mosaic4: {
        id: '4-',
        data: 'gmzgaacw3bnkgakbtgf65c3djrh7tt'
      },
      art_mosaic5: {
        id: '5-',
        data: '8kyde3t5ge4ee4ff4mthd8wwyagdry'
      },
      art_mosaic6: {
        id: '6-',
        data: 'f3339q0ncasegfd2mjz7bdg5nka1dj'
      },
      art_mosaic7: {
        id: '7-',
        data: 'wpg1nnazn3b4g2f1vvdn5ebcf81v4v'
      },
      art_mosaic8: {
        id: '8-',
        data: 'vws557m2tkjf1fkm1vzeqrje36pzav'
      },
      art_mosaic9: {
        id: '9-',
        data: 'w769qms3b36vfhk9ap7afnsf60rv5z'
      },
      art_mosaic10: {
        id: '10-',
        data: 's8xst5sab56j9pc30000'
      }
    }
  }


  wallet: {
    name: string,
    address: any,
    publicKey: string,
    password: string,
    timestamp:object,
    encryptedPrivateKey: {
      encryptedKey: string,
      iv: string
    }
  }

  createWalletFrom: FormGroup;
  generateNamespaceForm: FormGroup;
  createMosaicFirm: FormGroup;
  transferMosaicForm: FormGroup;

  walletCreateStatus = false;

  nameSpaces: any;


  constructor(
    public fb: FormBuilder
  ) {}

  ngOnInit() {
    this.initForms();
    this.getNamespacesInfoFromAccount();
  }


  // フォームの初期化
  initForms(): void {
    this.createWalletFrom = this.fb.group({
      walletName: ['', Validators.required],
      password: ['', Validators.compose([Validators.minLength(8), Validators.required])]
    });

    this.generateNamespaceForm = this.fb.group({
      namaspace: ['', Validators.compose([Validators.maxLength(16), Validators.required])],
      password: ['', Validators.required]
    });
  }


  // NEMアカウント新規作成
  openDialog(): void {
    if(window.confirm('これで作成しますか？')) {
      this.createSimpleWallet(this.createWalletFrom.value.walletName, this.createWalletFrom.value.password);
      this.getNamespacesInfoFromAccount();
    }
  }

  createSimpleWallet(name, psw): void {
    const password = new Password(psw);
    const createSimpleWallet = SimpleWallet.create(name, password);
    console.log(createSimpleWallet);

    this.wallet = {
      address: createSimpleWallet.address,
      timestamp: createSimpleWallet.creationDate,
      publicKey: '',
      encryptedPrivateKey: {
        encryptedKey: createSimpleWallet.encryptedPrivateKey.encryptedKey,
        iv: createSimpleWallet.encryptedPrivateKey.iv
      },
      password: this.createWalletFrom.value.password,
      name: createSimpleWallet.name
    }

    if(this.wallet !== null) {
      this.walletCreateStatus = true;
    }

  }


  // 作成ウォレットを保存&DL
  dlWalletData() {
    const json_wallets = JSON.stringify(this.wallet);
    const blob = new Blob([json_wallets],{type: 'application\/json'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'wallet_'+ this.wallet.address.value + '.json';
    link.click();
    URL.revokeObjectURL(url);
  }


  // アカウント情報からnamespace情報を取得
  getNamespacesInfoFromAccount() {
    const accountHttp = new AccountHttp();
    const address = new Address('TBU64P-26SEY3-OJ6FEB-PEVOZR-237ZWY-2GJMHM-KR7W');
    accountHttp.getNamespaceOwnedByAddress(address).subscribe(
      x => this.nameSpaces = x,
      err => console.log(err)
    );
    // if(this.wallet == undefined) {
    //   console.log('Error: wallet addres is empty');
    //   return false;
    // } else {
    //   console.log(accountHttp.getNamespaceOwnedByAddress(address));
    // }
  }


  // ネームスペース登録
  regiterNamespace() {
    const privateKey: string = this.admin.privateKey;
    const account = Account.createWithPrivateKey(privateKey);
    const namespace = this.nameSpace.no01.rns;
    const transactionHttp = new TransactionHttp();

    const provisionNamespaceTransaction = ProvisionNamespaceTransaction.create(
      TimeWindow.createWithDeadline(),
      namespace
    );

    const signedTx = account.signTransaction(provisionNamespaceTransaction);
    transactionHttp
      .announceTransaction(signedTx)
      .subscribe(
        x => console.log(x),
        err => console.log(err)
      );
  }


  // subnamespace登録
  regiterSubNamespace() {
    const privateKey: string = this.admin.privateKey;
    const account = Account.createWithPrivateKey(privateKey);
    const namespace = this.nameSpace.no02.rns + '.' + this.nameSpace.no02.sns1;
    const subNamespace = this.nameSpace.no02.sns2;
    const transactionHttp = new TransactionHttp();

    const provisionNamespaceTransaction = ProvisionNamespaceTransaction.create(
      TimeWindow.createWithDeadline(),
      subNamespace,
      namespace
    );

    const signedTx = account.signTransaction(provisionNamespaceTransaction);
    transactionHttp
      .announceTransaction(signedTx)
      .subscribe(
        x => console.log(x),
        err => console.log(err)
      );
  }


  // オーナー証明モザイク作成
  createOwnerCertMosaic() {
    const privateKey: string = this.admin.privateKey;
    const account = Account.createWithPrivateKey(privateKey);
    const transactionHttp = new TransactionHttp(nodes);

    const mosaicDefinitionTransaction = AssetDefinitionCreationTransaction.create(
      TimeWindow.createWithDeadline(),
      new AssetDefinition(
        PublicAccount.createWithPublicKey(account.publicKey),
        new AssetId(
          this.nameSpace.no02.rns + '.' + this.nameSpace.no02.sns1 + '.' + this.nameSpace.no02.sns2, 
          this.mosaics.nice.cert_mosaic.mosaicName),
        'cert nice owner',
        new AssetProperties(0, 1, false, true),
        new AssetLevy(
          AssetLevyType.Percentil,
          account.address,
          new AssetId("nem", "xem"),
          2
        )
      ),
    );

    const signedTx = account.signTransaction(mosaicDefinitionTransaction);
    transactionHttp
      .announceTransaction(signedTx)
      .subscribe(
        x => console.log("success" + x),
        err => console.log("error" + err)
      )
  }


  // mosaicArt作成
  createMosaicArt() {
    const privateKey: string = this.admin.privateKey;
    const account = Account.createWithPrivateKey(privateKey);
    const transactionHttp = new TransactionHttp(nodes);

    const mosaicDefinitionTransaction = AssetDefinitionCreationTransaction.create(
      TimeWindow.createWithDeadline(),
      new AssetDefinition(
        PublicAccount.createWithPublicKey(account.publicKey),
        new AssetId(this.nameSpace.no01.rns + '.' + this.nameSpace.no01.sns, this.mosaics.nice.art_mosaic10.id + this.mosaics.nice.art_mosaic10.data),
        'ascii art 3',
        new AssetProperties(0, 1, false, false)
      ),
    );

    const signedTx = account.signTransaction(mosaicDefinitionTransaction);
    transactionHttp
      .announceTransaction(signedTx)
      .subscribe(
        x => console.log("success" + x),
        err => console.log("error" + err)
      )
  }

}