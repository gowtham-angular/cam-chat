import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MaterialModule } from './material.module';
import { SideNavigationComponent } from './side-navigation/side-navigation.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersComponent } from './users/users.component';
import { ProductsComponent } from './products/products.component';
import { RechargeComponent } from './recharge/recharge.component';
import { WithdrawalComponent } from './withdrawal/withdrawal.component';
import { BankAccountsComponent } from './bank-accounts/bank-accounts.component';
import { UsdtComponent } from './usdt/usdt.component';
import { ExpenseComponent } from './expense/expense.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../../environment.prod';
import { ConfirmationComponent } from './utils/confirmation/confirmation.component';
import { DataTableComponent } from './utils/data-table/data-table.component';
import { ClipboardModule } from 'ngx-clipboard';
import { UserControlComponent } from './user-control/user-control.component';
import { ProductCardComponent } from './product-card/product-card.component';
import { MissionCardComponent } from './mission-card/mission-card.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SideNavigationComponent,
    DashboardComponent,
    UsersComponent,
    ProductsComponent,
    RechargeComponent,
    WithdrawalComponent,
    BankAccountsComponent,
    UsdtComponent,
    ExpenseComponent,
    ConfirmationComponent,
    DataTableComponent,
    UserControlComponent,
    ProductCardComponent,
    MissionCardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    ClipboardModule,
    AngularFireModule.initializeApp(environment.firebaseConfig)
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
