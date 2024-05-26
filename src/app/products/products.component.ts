import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize, take } from 'rxjs/operators';
import { ProductService } from '../products.service';
import { MatTableDataSource } from '@angular/material/table';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationComponent } from '../utils/confirmation/confirmation.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
interface Level {
  value: string;
  viewValue: string;
}


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})

export class ProductsComponent implements OnInit {

  selectedFile!: File;
  displayedColumns: string[] = ['thumbnail', 'imageName', 'price', 'level', 'actions'];
  dataSource!: MatTableDataSource<any>;
  uploading: boolean = false;
  form: FormGroup;
  products: any[] = [];

  levels: Level[] = [
    { value: 'products', viewValue: 'Display' },
    { value: 'vip_1', viewValue: 'VIP 1' },
    { value: 'vip_2', viewValue: 'VIP 2' },
    { value: 'vip_3', viewValue: 'VIP 3' },
    { value: 'vip_3', viewValue: 'VIP 4' },
    { value: 'vip_5', viewValue: 'VIP 5' },
  ];

  vipOne: any[] = [];
  vipTwo: any[] = [];
  vipThree: any[] = [];
  constructor(
    private storage: AngularFireStorage,
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private firestore: AngularFirestore
  ) {

    this.form = this.formBuilder.group({
      level: ['', Validators.required],
      imageName: ['', Validators.required],
      price: ['', Validators.required],
    });
    this.firestore.collection('products').valueChanges({ idField: 'id' }).subscribe(data => {
      this.products = data.filter((item: any) => item.level === 'products');
      this.vipOne = data.filter((item: any) => item.level === 'vip_1');
      this.vipTwo= data.filter((item: any) => item.level === 'vip_2');
      this.vipThree = data.filter((item: any) => item.level === 'vip_3');
    });
  }

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe((products: any[]) => {
      this.dataSource = new MatTableDataSource(products);
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadImage() {
    if (!this.selectedFile || !this.form.valid) {
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
          this.productService.addProduct(this.form.value, downloadURL)
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


}
