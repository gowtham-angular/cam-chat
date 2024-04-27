import { Component, OnInit } from '@angular/core';
import { AngularFirestore, } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { WithdrawalService } from '../withdrawal.service';
import { ProductService } from '../products.service';

interface User {
  id: string;
  userName: string;
}


@Component({
  selector: 'app-withdrawal',
  templateUrl: './withdrawal.component.html',
  styleUrl: './withdrawal.component.scss'
})
export class WithdrawalComponent {
  dataSource!: MatTableDataSource<any>;
  displayedColumns: string[] = ['id', 'userName', 'amount', 'date'];
  selectedUserId: any;
  withdrawalAmount: number = 0;
  filteredUsers: Observable<User[]> = new Observable<User[]>();

  user: any;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private firestore: AngularFirestore, private withdrawalService: WithdrawalService, private productService: ProductService) { }

  ngOnInit(): void {
    this.filteredUsers = this.firestore.collection<User>('users').valueChanges()
      .pipe(
        map(users => users.map(user => ({ id: user.id, userName: user.userName })))
      );

    this.getWithdrawalData();
  }

  displayUser(user: User): string {
    return user && user.userName ? `${user.userName}` : '';
  }

  withdrawal(): void {

    // Retrieve the user document from Firestore based on the selected user's ID
    const userDocRef = this.firestore.collection('users').doc(this.selectedUserId.id);
    let tempwithdrawalAmount = 0;
    userDocRef.get().subscribe(docSnapshot => {
      if (docSnapshot.exists) {
        // Access field data
        let data: any = docSnapshot.data();

        if (data) {
          tempwithdrawalAmount = data.totalInvested - this.withdrawalAmount

        }
      } else {
        this.productService.getSnackBar('No such document!');
      }
    })

    //Update the totalInvested field in the user document
    setTimeout(() => {
      userDocRef.update({
        totalInvested: tempwithdrawalAmount
      }).then(() => {
        this.updateWithdrawalTable();
      })
        .catch(error => {
          this.productService.getSnackBar('Error updating totalInvested:');
          console.error('Error updating totalInvested:', error);
        });
    }, 2000)
  }

  getWithdrawalData() {
    this.withdrawalService.getWithdrawalData().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;

    });
  }

  applyFilter(event: Event) {

    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    console.log(this.dataSource)

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

  }

  updateWithdrawalTable() {
    let withdrawalData = {
      ...this.selectedUserId,
      date: Date.now(),
      amount: this.withdrawalAmount
    }
    this.withdrawalService.addWithdrawalToDB(withdrawalData).then((res) => {
      this.productService.getSnackBar(`₹${this.withdrawalAmount}  Withdrawed Successfully`);
      //Reset form after recharge
      this.selectedUserId = '';
      this.withdrawalAmount = 0;
    });
  }
}
