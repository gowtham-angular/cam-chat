import { Component, OnInit } from '@angular/core';
import { AngularFirestore, } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { RechargeService } from '../recharge.service';

import { FieldValue } from 'firebase/firestore'
import { ProductService } from '../products.service';

interface User {
  id: string;
  userName: string;
}

@Component({
  selector: 'app-recharge',
  templateUrl: './recharge.component.html',
  styleUrls: ['./recharge.component.scss']
})
export class RechargeComponent implements OnInit {

  dataSource!: MatTableDataSource<any>;

  displayedColumns: string[] = ['id', 'userName', 'amount', 'date'];
  selectedUserId: any;
  rechargeAmount: number = 0;
  filteredUsers: Observable<User[]> = new Observable<User[]>();
  user: any;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  constructor(private firestore: AngularFirestore, private rechargeService: RechargeService, private productService: ProductService) { }

  ngOnInit(): void {
    this.filteredUsers = this.firestore.collection<User>('users').valueChanges()
      .pipe(
        map(users => users.map(user => ({ id: user.id, userName: user.userName })))
      );
    this.getRechargeData();
  }



  getRechargeData() {
    this.rechargeService.getRechargeData().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  applyFilter(event: Event) {

    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  displayUser(user: User): string {
    return user && user.userName ? `${user.userName}` : '';
  }

  recharge(): void {

    if (this.selectedUserId && this.rechargeAmount > 0) {
      // Retrieve the user document from Firestore based on the selected user's ID
      const userDocRef = this.firestore.collection('users').doc(this.selectedUserId.id);
      let tempRechargeAmount = 0;
      userDocRef.get().subscribe(docSnapshot => {
        if (docSnapshot.exists) {
          // Access field data
          let data: any = docSnapshot.data();

          if (data) {
            tempRechargeAmount = data.totalInvested + this.rechargeAmount
            
          }
        } else {
          this.productService.getSnackBar('No such document!');
        }
      })

      //Update the totalInvested field in the user document
      setTimeout(() => {
        userDocRef.update({
          totalInvested: tempRechargeAmount
        }).then(() => {
          this.updateRechargeTable();
        })
          .catch(error => {
            this.productService.getSnackBar('Error updating totalInvested:');
            console.error('Error updating totalInvested:', error);
          });
      }, 2000)

    } else {
      this.productService.getSnackBar('Please select a user and enter a valid amount.');
    }
  }

  updateRechargeTable() {
    let reachargeData = {
      ...this.selectedUserId,
      date: Date.now(),
      amount: this.rechargeAmount
    }
    this.rechargeService.addRechargeToDB(reachargeData).then((res) => {
      
    });
    this.productService.getSnackBar(`₹${this.rechargeAmount}  Recharged Successfully`);
    //Reset form after recharge
     this.selectedUserId = '';
     this.rechargeAmount = 0;
  }
}
