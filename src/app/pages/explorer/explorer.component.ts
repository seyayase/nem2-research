import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { environment } from '../../../environments/environment';

import { AccountHttp, Address } from 'nem2-sdk';

@Component({
  selector: 'app-explorer',
  templateUrl: './explorer.component.html',
  styleUrls: ['./explorer.component.scss']
})
export class ExplorerComponent implements OnInit {
  env = environment;
  getAccountAddress: FormGroup;
  resultAccountInfo: any;
  resultTxs: any;

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.getAccountAddress = this.fb.group({
      userAddress: ['', Validators.required]
    })
  }


  // Submitで実行
  searchAccount() {
    const accountHttp = new AccountHttp(this.env.node.url);

    this.getAccountInfo(accountHttp);
    this.getConfirmedTxs(accountHttp);
  }


  // アカウント情報を取得
  getAccountInfo(accountHttp) {
    const address = Address.createFromRawAddress(this.getAccountAddress.value.userAddress);

    accountHttp
      .getAccountInfo(address)
      .subscribe(accoutInfo => {
        this.resultAccountInfo = JSON.stringify(accoutInfo, null, 4)
      }, err => console.error(err));
  }


  // 承認済みトランザクションの取得
  getConfirmedTxs(accountHttp) {
    this.resultTxs = 'Tx一覧だよ';
  }
}
