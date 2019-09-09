import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Address, AccountHttp, MosaicHttp, MosaicService } from 'nem2-sdk';
import { MosaicInfo } from '../../models/mosaicInfo';
import { mergeMap, filter } from 'rxjs/operators';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit {
  env = environment;
  mosaic: MosaicInfo;

  constructor() { }

  ngOnInit() {
    this.mosaic = {
      mosaicId: null,
      amount: null
    }

    this.getNemBalance();
  }

  // 保有モザイク情報取得
  getNemBalance() {
    const accountHttp = new AccountHttp(this.env.node.url);
    const mosaicHttp = new MosaicHttp(this.env.node.url);
    const mosaicService = new MosaicService(accountHttp, mosaicHttp);
    const address = Address.createFromRawAddress(this.env.admin.address);

    mosaicService
      .mosaicsAmountViewFromAddress(address)
      .pipe(
        mergeMap((_) => _),
        filter((mo) => mo.fullName() === '0bf26981a0ed862d')
      )
      .subscribe(mo => {
        this.mosaic = {
          mosaicId: mo.fullName(),
          amount: mo.relativeAmount()
        }
      },
        err => console.log(err));
  }

}
