import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private firestore: AngularFirestore, private snackBar: MatSnackBar) { }

  getSnackBar(msg: string) {
    this.snackBar.open(msg, 'Close', {
      duration: 3000 // Duration in milliseconds
    });
  }

  addProduct(imageName: string, price: number, downloadUrl: string) {
    return this.firestore.collection('products').add({
      imageName,
      price,
      url: downloadUrl
    });
  }

  deleteProduct(productId: string) {
    return this.firestore.collection('products').doc(productId).delete();
  }

  getAllProducts() {
    return this.firestore.collection('products').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }
}
