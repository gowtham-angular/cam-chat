import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersComponent } from './users/users.component';
import { ProductsComponent } from './products/products.component';
import { RechargeComponent } from './recharge/recharge.component';
import { WithdrawalComponent } from './withdrawal/withdrawal.component';
import { BankAccountsComponent } from './bank-accounts/bank-accounts.component';
import { UserControlComponent } from './user-control/user-control.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'users', component: UsersComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'recharge', component: RechargeComponent },
  { path: 'withdrawal', component: WithdrawalComponent },
  { path: 'bankaccounts', component: BankAccountsComponent },
  { path: 'userControl', component: UserControlComponent },
  // { path: 'usdt', component: UsdtComponent },
  // { path: 'expense', component: ExpenseComponent },
  { path: '', redirectTo: '/users', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
