import { Component } from '@angular/core';

@Component({
  selector: 'app-side-navigation',
  templateUrl: './side-navigation.component.html',
  styleUrl: './side-navigation.component.scss'
})
export class SideNavigationComponent {
  sideNavOptions: any[] = [
    
    // {
    //   name: 'Dashboard',
    //   link: 'dashboard'
    // }, 
    {
      name: 'Users',
      link: 'users'
    }, 
    {
      name: 'Products',
      link: 'products'
    }, 
    {
      name: 'Recharge',
      link: 'recharge'
    }, 
    {
      name: 'Withdrawal',
      link: 'withdrawal'
    }, 
    {
      name: 'Bank Accounts',
      link: 'bankaccounts'
    }, 
    // {
    //   name: 'USDT',
    //   link: 'usdt'
    // }, 
    // {
    //   name: 'Expenses',
    //   link: 'expense'
    // }, 
  ];
  showFiller = false;
}
