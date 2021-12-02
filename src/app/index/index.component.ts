import { ProductSearchService } from './../Services/product-search/product-search.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Product } from '../models/product.model';
import { HeaderService } from '../Services/header/header.service';
import { IndexService } from '../Services/index/index.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
})
export class IndexComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private headerService: HeaderService,
    private cookieService: CookieService,
    private indexService: IndexService,
    private productSearchService: ProductSearchService,
  ) {}

  public productValue: Product = {} as Product;
  public carasel:any = [];
  public listProductAll: any = []



  ngOnInit(): void {
    this.loadProductSalling();
    this.getTopTag();
    this.getProductAll(0);
  }
  public loadingProductSelling = true;
  public listProductSelling: any = [];
  public listTopTag: any = [];

  public loadProductSalling() {
    this.loadingProductSelling = true;
    this.indexService.getProductSelling().subscribe(
      (data) => {
        this.listProductSelling = data;
        var tempData = [...data]
        // if (tempData.length > 4) {
        //   tempData.length = 4
        // }
        while (tempData.length > 0){
          this.carasel.push(tempData.splice(0,2))
        }
        console.log(this.carasel, tempData)
        this.loadingProductSelling = false;
      },
      (err) => {
        console.log(err);
        this.loadingProductSelling = false;
      }
    );
  }

  /**
   * Hàm xem chi tiết sản phẩm từ cửa hàng
   * @param product id product truyền vào
   */
  showDetailProduct(product: any) {
    this.router.navigate([`/product/detail` + '/' + product]);
  }

  /**
   * Lấy danh sách top nhãn được tìm kiếm
   */
  getTopTag() {
    this.indexService.getTopTag().subscribe(
      (data) => {
        this.listTopTag = data;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getProductAll(page: any){
    this.productSearchService.loadListProductAllShop(page).subscribe(
      data => {
        this.listProductAll = data.content
      }
    )}
  
}
