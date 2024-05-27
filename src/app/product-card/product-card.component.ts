import { Component, Input } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ConfirmationComponent } from '../utils/confirmation/confirmation.component';
import { MatDialog } from '@angular/material/dialog';
import { ProductService } from '../products.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {
  @Input() product: any;
  editing = false;
  newPrice!: number;

  constructor(private firestore: AngularFirestore, private dialog: MatDialog, private productService: ProductService) { }

  editPrice() {
    this.editing = true;
    this.newPrice = this.product.price;
  }

  updatePrice() {
    if (this.newPrice != null) {
      this.firestore.collection('products').doc(this.product.id).update({ price: Number(this.newPrice) })
        .then(() => {
          this.product.price = Number(this.newPrice);
          this.editing = false;
        })
        .catch(error => {
          console.error("Error updating price: ", error);
        });
    }
  }

  deleteProduct(productId: string) {

    const dialogRef = this.dialog.open(ConfirmationComponent, {
      data: { message: 'Are you sure you want to delete this item?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productService.deleteProduct(productId).then(() => {
          this.productService.getSnackBar('Product deleted successfully.');
        }).catch(error => {
          this.productService.getSnackBar('Error deleting product.');
          console.error('Error deleting product:', error);
        });
      } else {
        return
      }
    });
  }
}
