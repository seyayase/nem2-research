import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mosaic',
  templateUrl: './mosaic.component.html',
  styleUrls: ['./mosaic.component.scss']
})
export class MosaicComponent implements OnInit {
  commissionType: {
    fixed: string,
    percentile: string
  } = {
    fixed: '固定徴収方式を選択すると、固定の徴収が発生します。' + 0.000005 + 'nem:xem',
    percentile: 'パーセンタイル徴収方式を選択すると、送信量により徴収量が変動します。送信モザイク 100 . score: の場合、徴収されるモザイクは 0 .000000 nem:xem送信モザイク 1 000 . score: の場合、徴収されるモザイクは 0 .000000 nem:xem 送信モザイク 3 145 . score: の場合、徴収されるモザイクは 0 .000001 nem:xem 送信モザイク 10 000 . score: の場合、徴収されるモザイクは 0 .000005 nem:xem 送信モザイク 0 . score: の場合、徴収されるモザイクは 0 .000000 nem:xem'
  }

  constructor() { }

  ngOnInit() {
  }

}
