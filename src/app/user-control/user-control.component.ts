import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { UserService } from '../user.service';
import { ConfirmationComponent } from '../utils/confirmation/confirmation.component';
import { MatDialog } from '@angular/material/dialog';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-user-control',
  templateUrl: './user-control.component.html',
  styleUrl: './user-control.component.scss'
})
export class UserControlComponent {
  users: any;
  form!: FormGroup;
  options: any;
  id: any;
  filteredOptions!: Observable<{ id: string, name: string }[]>;
  
  items: any;
  products: any[] = [];
  isenabled: boolean = false;

  constructor(
    private userService: UserService, private fb: FormBuilder,
    private dialog: MatDialog, private fireStore: AngularFirestore) {
    this.getUsers();
    this.isenabled = false;
  }


  getUsers() {
    this.userService.getUsers().subscribe((data: any) => {
      this.options = data;
    })
  }

  ngOnInit() {
    this.form = this.fb.group({
      search: ['']
    });

    this.filteredOptions = this.form.get('search')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  private _filter(value: string): { id: string, name: string }[] {
    const filterValue = value.toLowerCase();
    return this.options?.filter((option: any) => option?.id.toLowerCase().includes(filterValue));
  }

  onOptionSelected(event: any) {
    this.getVipFlags(event.option.value);
    this.getVipTwoProducts(event.option.value);
    this.id = event.option.value;
    this.isenabled = true;
  }


  getUserAmout() { }

  getProfit() { }

  getPoints() { }

  getMissionvalue() { }

  getVipFlags(id: any) {
    this.userService.getVipFlags(id).subscribe(data => {
      if (data && data) {
        this.items = data;
      }
    });
  }

  onToggleChange(index: number, event: any) {

    const dialogRef = this.dialog.open(ConfirmationComponent, {
      data: { message: 'Are you sure you want to Enable this ?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        this.items['data'][index].value = event.checked;

        this.userService.updateVipFlags(this.id, this.items);

      } else {
        this.items['data'][index].value = !event.checked;
      }
    });

  }


  getVipTwoProducts(id: any) {
    this.fireStore.collection('vip_two').doc(id).valueChanges().subscribe((data:any) => {
      this.products = data?.arrayField;
    });
  }
}
