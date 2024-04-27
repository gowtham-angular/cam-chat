import { ViewChild, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationComponent } from '../utils/confirmation/confirmation.component';

interface EditCacheItem {
  edit: boolean;
  data: {
    userName: string;
    email: string;
    password: string;
    totalInvested: number;
    totalAmount: number;
    profit: number;
    points: number;
  };
  editName: boolean;
  editEmail: boolean;
  editPassword: boolean;
  editTotalInvested: boolean;
  editTotalAmount: boolean;
  editProfit: boolean;
  editPoints: boolean;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
  displayedColumns: string[] = ['id', 'userName', 'email', 'password', 'totalInvested', 'totalAmount', 'profit', 'points', 'actions'];
  form: FormGroup;
  lastGeneratedId!: number;
  dataSource!: MatTableDataSource<any>;
  editCache: { [key: string]: EditCacheItem } = {};

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private formBuilder: FormBuilder, private firestore: AngularFirestore, private snackBar: MatSnackBar, private dialog: MatDialog) {

    this.form = this.formBuilder.group({
      id: [{ value: '' }, Validators.required],
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      totalInvested: [0, Validators.required],
      totalAmount: [0, Validators.required],
      profit: [0, Validators.required],
      points: [0, Validators.required]
    });

    // Fetch the last generated ID from Firestore
    this.firestore.collection('id').doc('lastId').valueChanges().subscribe((data: any) => {
      this.lastGeneratedId = data.lastId;
      this.form.patchValue({ id: this.lastGeneratedId + 1 });
    });
  }

  generateUniqueId(): string {
    let newId = this.lastGeneratedId + 1;
    while (this.checkIfIdExists(newId)) {
      newId++;
    }
    return newId.toString();
  }


  checkIfIdExists(id: number): boolean {
    // Check if the generated ID already exists in Firestore
    // You need to implement this function to query Firestore and check for the existence of the ID
    // Example: 
    // return this.firestore.collection('users').doc(id.toString()).get().toPromise().then(doc => doc.exists);
    return false; // Placeholder implementation
  }

  ngOnInit(): void {
    this.getUsersData();
  }


  onSubmit() {
    if (this.form.valid) {
      // Process form data here
      const id = this.generateUniqueId();
      this.form.patchValue({
        id: id
      })

      this.addUserToFirestore(id, this.form.value);
    }
  }

  addUserToFirestore(id: string, userData: any) {

    this.firestore.collection('users').doc(id).set(userData)// Add user data to collection
      .then(() => {
        // Clear form after submission (optional)
        this.form.reset();
        this.form.markAsPristine();
        this.snackBar.open('User added successfully!', 'Close', {
          duration: 3000 // Duration in milliseconds
        });
        this.updateLastGeneratedId(id);
      })
      .catch(error => {
        console.error('Error adding user:', error);
      });

  }

  updateLastGeneratedId(id: string) {
    // Update the last generated ID in Firestore
    this.firestore.collection('id').doc('lastId').set({ lastId: parseInt(id, 10) });
  }
  getUsersData() {
    this.firestore.collection('users').snapshotChanges().subscribe(data => {
      const users = data.map((e: any) => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        };
      });
      this.dataSource = new MatTableDataSource(users);
      console.log(this.dataSource.data)
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;

      users.forEach(user => {
        this.editCache[user.id] = {
          edit: false,
          data: { ...user },
          editName: false,
          editEmail: false,
          editPassword: false,
          editTotalInvested: false,
          editTotalAmount: false,
          editProfit: false,
          editPoints: false,
        };
      });
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editSwitch(id: any, flag: boolean) {
    this.editCache[id].edit = flag;
    this.editCache[id].editTotalInvested = flag;
    this.editCache[id].editTotalAmount = flag;
    this.editCache[id].editProfit = flag;
    this.editCache[id].editPoints = flag;
  }

  startEdit(id: string): void {
    this.editSwitch(id, true);
  }

  cancelEdit(id: string): void {
    const index = this.dataSource.data.findIndex(item => item.id === id);
    this.editSwitch(id, false);
  }

  saveEdit(id: string): void {
    const index = this.dataSource.data.findIndex(item => item.id === id);
    Object.assign(this.dataSource.data[index], this.editCache[id].data);
    this.firestore.collection('users').doc(id).update(this.editCache[id].data);
    this.editSwitch(id, false);

    this.snackBar.open('User updated successfully!', 'Close', {
      duration: 3000 // Duration in milliseconds
    });
  }

  deleteRow(id: string): void {
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      data: { message: 'Are you sure you want to delete this item?' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.dataSource.data.findIndex(item => item.id === id);
        this.firestore.collection('users').doc(id).delete();
        this.dataSource.data.splice(index, 1);
        this.dataSource._updateChangeSubscription();

        this.snackBar.open('User deleted successfully!', 'Close', {
          duration: 3000 // Duration in milliseconds
        });

      } else {
        // User cancelled action
      }
    });
  }
}




