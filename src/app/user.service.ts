import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { arrayUnion } from 'firebase/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private fireStore: AngularFirestore
  ) { }

  getUsers() {
    return this.fireStore.collection('users').valueChanges();
  }

  getVipFlags(id: string) {
    return this.fireStore.collection('vip_flag_collection').doc(id).valueChanges();
  }

  createUserMetrics(id: any) {

    let docData = [{ name: 'vipOne', value: true }, { name: 'vipTwo', value: false }, { name: 'vipThree', value: false }];
    this.fireStore.collection('count').doc(id).set({ taskCount: 0 });
    this.fireStore.collection('total_invested').doc(id).set({ totalInvested: 0 });
    this.fireStore.collection('profit').doc(id).set({ profit: 0 });
    this.fireStore.collection('mission_amount').doc(id).set({ missionAmount: 0 });
    this.fireStore.collection('count').doc(id).set({ taskCount: 0 });
    this.fireStore.collection('vip_flag_collection').doc(id).set({ data: docData });

  }

  updateVipFlags(id: any, data: any) {
    return this.fireStore.collection('vip_flag_collection').doc(id).update(data);
  }

}
