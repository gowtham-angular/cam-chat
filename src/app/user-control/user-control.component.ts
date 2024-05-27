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
  vipOne: any[] = [];
  vipTwo: any[] = [];
  vipThree: any[] = [];
  missionData: any;
  missionEnabledModel: any;
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
    this.getVipProducts(event.option.value);
    this.getMissionEnabledFlag(event.option.value);
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

  onMissionChange(event: any) {
    this.updateMissionFlag(this.id, event.checked)
  }

  onToggleChange(index: number, event: any) {

    const dialogRef = this.dialog.open(ConfirmationComponent, {
      data: { message: 'Are you sure you want to Enable this ?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (index === 0) {
          this.items['data'][0].value = event.checked;
          this.items['data'][1].value = !event.checked;
          this.items['data'][2].value = !event.checked;
        } else if (index === 1) {
          this.items['data'][0].value = !event.checked;
          this.items['data'][1].value = event.checked;
          this.items['data'][2].value = !event.checked;
        } else if (index === 2) {
          this.items['data'][0].value = !event.checked;
          this.items['data'][1].value = !event.checked;
          this.items['data'][2].value = event.checked;
        }
        this.userService.updateVipFlags(this.id, this.items);
      } else {
        this.items['data'][index].value = !event.checked;
      }
    });

  }


  getVipProducts(id: any) {
    this.fireStore.collection('vip_one').doc(id).valueChanges().subscribe((data: any) => {
      this.vipOne = data?.arrayField;
    });
    this.fireStore.collection('vip_two').doc(id).valueChanges().subscribe((data: any) => {
      this.vipTwo = data?.arrayField;
    });
    this.fireStore.collection('vip_three').doc(id).valueChanges().subscribe((data: any) => {
      this.vipThree = data?.arrayField;
    });
  }


  getMissionEnabledFlag(id: any) {
    this.fireStore.collection('isMissionEnabled').doc(id).valueChanges().subscribe((data: any) => {
      if (data) {
        this.missionData = data;
        this.missionEnabledModel = this.missionData.missionEnabled;
      }
    });
  }

  updateMissionFlag(id: any, flag: boolean) {
    this.fireStore.collection('isMissionEnabled').doc(id).update({
      missionEnabled: flag
    })
  }
}
