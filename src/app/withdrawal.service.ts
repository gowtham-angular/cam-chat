import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class WithdrawalService {

  constructor(private firestore: AngularFirestore) { }

  getWithdrawalData() {
    return this.firestore.collection('withdrawal').valueChanges();
  }

  addWithdrawalToDB(data: any) {
    return this.firestore.collection('withdrawal').add({
      data
    });
  }
}
