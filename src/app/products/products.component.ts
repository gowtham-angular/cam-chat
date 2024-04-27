import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { ProductService } from '../products.service';
import { MatTableDataSource } from '@angular/material/table';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationComponent } from '../utils/confirmation/confirmation.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})

export class ProductsComponent implements OnInit {

  imageName!: string;
  price!: number;
  selectedFile!: File;
  displayedColumns: string[] = ['thumbnail', 'imageName', 'price', 'actions'];
  dataSource!: MatTableDataSource<any>;
  uploading: boolean = false;

  constructor(
    private storage: AngularFireStorage,
    private productService: ProductService,
    private afs: AngularFirestore,
    private dialog: MatDialog
  ) { }


  ngOnInit(): void {
    this.productService.getAllProducts().subscribe((products: any[]) => {
      this.dataSource = new MatTableDataSource(products);
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadImage() {
    if (!this.selectedFile || !this.imageName || !this.price) {
      this.productService.getSnackBar('Please fill all fields.');
      return;
    }

    this.uploading = true;

    const filePath = `products/${this.selectedFile.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, this.selectedFile);

    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe(downloadURL => {
          this.productService.addProduct(this.imageName, this.price, downloadURL)
            .then(() => {
              this.productService.getSnackBar('Product added successfully.');
            })
            .catch(error => {
              this.productService.getSnackBar('Error adding product.');
              console.error('Error adding product:', error);
            }).finally(() => {
              this.uploading = false;
            });
        });
      })
    ).subscribe();
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
