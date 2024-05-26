import { Component, Input } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ConfirmationComponent } from '../utils/confirmation/confirmation.component';
import { MatDialog } from '@angular/material/dialog';
import { ProductService } from '../products.service';

@Component({
  selector: 'app-mission-card',
  templateUrl: './mission-card.component.html',
  styleUrl: './mission-card.component.scss'
})
export class MissionCardComponent {
  @Input() product: any;
  @Input() id: any;
  editing = false;
  newPrice!: number;

  constructor(private firestore: AngularFirestore, private dialog: MatDialog, private productService: ProductService) {}

  editPrice() {
    this.editing = true;
    this.newPrice = this.product.missionAmount;
  }

  updatePrice() {
    if (this.newPrice != null) {
      this.firestore.collection('vip_two').doc(this.id).get().subscribe((doc:any) => {
        if (doc.exists) {
          const arrayField = doc.data().arrayField;
          const productIndex = arrayField.findIndex((item:any) => item.id === this.product.id);

          if (productIndex !== -1) {
            arrayField[productIndex].missionAmount = Number(this.newPrice);

            this.firestore.collection('vip_two').doc(this.id).update({ arrayField })
              .then(() => {
                this.product.missionAmount = this.newPrice;
                this.editing = false;
              })
              .catch(error => {
                console.error("Error updating price: ", error);
              });
          }
        }
      });
    }
  }
 
}
