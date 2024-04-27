import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
@Injectable({
  providedIn: 'root'
})
export class RechargeService {

  constructor(private firestore: AngularFirestore) { }

  getRechargeData() {
    return this.firestore.collection('recharge').valueChanges();
  }

  addRechargeToDB(data: any) {
    return this.firestore.collection('recharge').add({
      data
    });
  }
}
