import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { environment } from '../../../environments/environment';

import { NetworkType, Password, SimpleWallet } from 'nem2-sdk';

import { OrgAccount } from '../../models/org-account';
import { OperatorAccount } from '../../models/operator-account';
import { FormSelectItem } from '../../models/form-select-item';


@Component({
  selector: 'app-metadata',
  templateUrl: './metadata.component.html',
  styleUrls: ['./metadata.component.scss']
})
export class MetadataComponent implements OnInit {
  env = environment;

  newOrgAccount: OrgAccount;
  orgAccount: OrgAccount;
  newOperatorAccount: OperatorAccount;
  orgAccounts: Array<any> = [];
  operatorAccounts: Array<any> = [];
  createAccountResponce: any;
  
  createOrgAccountFrom: FormGroup;
  createOperatorAccountFrom: FormGroup;
  createQRForm: FormGroup;

  orgNames: FormSelectItem[];
  submitted = false;

  constructor(
    private afStore: AngularFirestore,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    // Initialize of Interface
    this.newOrgAccount = {
      name: '',
      password: '',
      accountType: 'company',
      address: '',
      networktype: null,
      signSchema: null,
      privateKey: '',
      publicKey: '',
      created: null,
      tel: null,
      email: ''
    }

    this.newOperatorAccount = {
      name: '',
      password: '',
      accountType: 'operator',
      address: null,
      networktype: null,
      signSchema: null,
      privateKey: null,
      publicKey: null,
      created: null,
      orgName: '',
      employeeNum: '',
      tel: null,
      email: ''
    }

    // Initialize of Form
    this.createOrgAccountFrom = this.fb.group({
      company: ['', Validators.required],
      department: ['', Validators.required],
      tel: ['', Validators.required],
      email: ['', Validators.required]
    })

    this.createOperatorAccountFrom = this.fb.group({
      orgName: ['', Validators.required],
      operator: ['', Validators.required],
      employeeNum: ['', Validators.required],
      tel: ['', Validators.required],
      email: ['', Validators.required]
    })

    this.createQRForm = this.fb.group({
      address: ['', Validators.required],
      charge: ['', Validators.required],
      message: ['', Validators.required],
      invoiceName: ['', Validators.required]
    })

    this.getOrgAccounts();
  } 


  // 法人アカウント情報取得
  getOrgAccounts() {
    this.orgAccounts = [];
    const docRef = this.afStore.collection('accounts', ref => ref.orderBy('created', 'desc'));

    docRef
      .get()
      .subscribe(querySnapshot => {
        querySnapshot.docs.map(doc => {
          this.orgAccount = {
            name: doc.data().name,
            password: doc.data().password,
            accountType: doc.data().accountType,
            address: doc.data().address,
            networktype: doc.data().networktype,
            signSchema: doc.data().signSchema,
            privateKey: doc.data().privateKey,
            publicKey: doc.data().publicKey,
            created: doc.data().created,
            tel: doc.data().tel,
            email: doc.data().email,
          }
          this.orgAccounts.push(this.orgAccount);
        });
      },
        err => console.log(err.toString()),
        () => this.extractOrgName(this.orgAccounts));
  }


  // 法人名抽出
  extractOrgName(orgAccounts) {
    this.orgNames = [];

    orgAccounts.forEach(el => {
      this.orgNames.push({value: el.name, viewValue: el.name});
    });
    this.getOperatorAccounts();
  }


  // 担当者コレクション取得
  getOperatorAccounts() {
    this.operatorAccounts = [];

    this.orgNames.forEach(org => {
      let docRef = this.afStore.collection('accounts', ref => ref.orderBy('created', 'desc')).doc(org.value).collection('operators');
      
      docRef
        .get()
        .subscribe(querySnapshot => {
          querySnapshot.docs.map(doc => {
            this.operatorAccounts.push(doc.data());
          });
        },
          err => console.log(err.toString));

      this.orgAccounts.forEach(el => {
        if(el.name == org.value) {
          el.operators = (this.operatorAccounts); // this.orgAccountsにoperatorsを追加
        }
      });
    });
  }


  // 法人アカウント作成
  createOrgAccount() {
    const randomStr = this.getRandomStr();
    const password = new Password(randomStr);
    const wallet = SimpleWallet.create(this.createOrgAccountFrom.value.company, password, NetworkType.MIJIN_TEST);
    const encryptedPrivateKey:any = wallet.encryptedPrivateKey;
    const account = wallet.open(password);
    const accountType = this.newOrgAccount.accountType;
    this.createAccountResponce = wallet;


    if(account !== null) {
      this.addNewAccount(account, randomStr, encryptedPrivateKey, accountType);
      this.submitted = true;
    }
  }


  // 担当者アカウント作成
  createOperatorAccount() {
    const randomStr = this.getRandomStr();
    const password = new Password(randomStr);
    const wallet = SimpleWallet.create(this.createOperatorAccountFrom.value.name, password, NetworkType.MIJIN_TEST);
    const encryptedPrivateKey:any = wallet.encryptedPrivateKey;
    const account = wallet.open(password);
    const accountType = this.newOperatorAccount.accountType;
    this.createAccountResponce = wallet;

    if(account !== null) {
      this.addNewAccount(account, randomStr, encryptedPrivateKey, accountType);
      this.submitted = true;
    }
  }


  // アカウント永続化
  addNewAccount(account, randomStr, encryptedPrivateKey, accountType) {    
    switch(accountType) {
      case 'company':
        this.newOrgAccount = {
          name: this.createOrgAccountFrom.value.company,
          password: randomStr,
          accountType: 'company',
          address: account.address.address,
          networktype: account.address.networkType,
          signSchema: account.signSchema,
          privateKey: JSON.stringify(encryptedPrivateKey),
          publicKey: account.publicKey,
          created: firebase.firestore.FieldValue.serverTimestamp(),
          tel: this.createOrgAccountFrom.value.tel,
          email: this.createOrgAccountFrom.value.email
        }

        this.afStore
        .collection('accounts')
        .doc(this.newOrgAccount.name)
        .set(this.newOrgAccount)
        .then(async docRef => {
          await this.snackBar.open('Success!');
          this.getOrgAccounts();
          this.onCreateAccountFromReset();
        })
        .catch(async err => {
          this.snackBar.open(err.toString());
        });
        break;

      case 'operator':
        this.newOperatorAccount = {
          name: this.createOperatorAccountFrom.value.operator,
          password: randomStr,
          accountType: 'operator',
          address: account.address.address,
          networktype: account.address.networkType,
          signSchema: account.signSchema,
          privateKey: JSON.stringify(encryptedPrivateKey),
          publicKey: account.publicKey,
          created: firebase.firestore.FieldValue.serverTimestamp(),
          orgName: this.createOperatorAccountFrom.value.orgName,
          employeeNum: this.createOperatorAccountFrom.value.employeeNum,
          tel: this.createOperatorAccountFrom.value.tel,
          email: this.createOperatorAccountFrom.value.email,
        }

        this.afStore
        .collection('accounts')
        .doc(this.newOperatorAccount.orgName)
        .collection('operators')
        .doc(this.newOperatorAccount.name)
        .set(this.newOperatorAccount)
        .then(async docRef => {
          await this.snackBar.open('Success!');
          this.onCreateAccountFromReset();
        })
        .catch(async err => {
          this.snackBar.open(err.toString());
        });
        break;

      default:
        console.log('Error: Failed to add to the database.');
        break;
    }
  }

  getRandomStr(){
    const str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!#$%&=~/*-+";
    const len = 20;
    let result = "";

    for(var i=0; i<len; i++){
      result += str.charAt(Math.floor(Math.random() * str.length));
    }
    return result;
  }


  onCreateAccountFromReset() {
    this.submitted = false;
    this.createOrgAccountFrom.reset();
    this.createOperatorAccountFrom.reset();
  }  
}
