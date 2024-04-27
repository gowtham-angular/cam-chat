import { Component } from '@angular/core';
import { BankAccountsService } from '../bank-accounts.service';
import { ClipboardService } from 'ngx-clipboard';

@Component({
  selector: 'app-bank-accounts',
  templateUrl: './bank-accounts.component.html',
  styleUrl: './bank-accounts.component.scss'
})
export class BankAccountsComponent {
  bankAccounts!: any[];

  constructor(private bankService: BankAccountsService, private clipboardService: ClipboardService) { }

  ngOnInit(): void {
    this.bankService.getBankAccounts().subscribe((accounts: any[]) => {
      console.log(accounts);
      this.bankAccounts = accounts;
    });
  }
  copyData(data: any) {

    let tempData = `Name: ${data.name} \n 
                    Account No: ${data.accountNo} \n 
                    Bank: ${data.bank} \n
                    IFSC: ${data.ifsc} \n 
                    UPI ID: ${data.upiId}`
    this.clipboardService.copyFromContent(tempData);
    console.log(tempData)
  }

}
