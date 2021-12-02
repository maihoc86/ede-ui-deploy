import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderService } from '../Services/header/header.service';
import { CookieService } from 'ngx-cookie-service';
import { MyShopService } from '../Services/my-shop/my-shop.service';

@Component({
  selector: 'app-shop-interface',
  templateUrl: './shop-interface.component.html',
  styleUrls: ['./shop-interface.component.css'],
})
export class ShopInterfaceComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private shopService: MyShopService,
    private headerService: HeaderService,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    this.loadInterfaceShop(this.getParam());
    this.LoadProductTable();
  }
  public toBot() {
    document.getElementById('table')?.scrollIntoView({ behavior: 'smooth' });
  }
  public loadingProductSelling = true;
  public loadingProductNew = true;
  public loadingProductDiscount = true;
  public loadingProductTable = true;

  public fakeArraySalling5: any = [];
  public fakeArrayNew5: any = [];
  public fakeArrayDiscount5: any = [];
  public cart: Array<any> = [];
  public location: any = 'selling';
  public count: number = 0;
  public page: number = 0;
  public keySearch : any = '';
  public listProduct: any = [];
  public listNew: any = [];
  public listSelling: any = [];

  public sortBy: any;
  public shopInfor: any = {};
  public array: any = [7, 6, 5, 4, 3];
  public getParam() {
    var id = '';
    this.route.params.subscribe((params) => {
      id = params['id'];
    });
    return id;
  }
  loadInterfaceShop(idShop: string) {
    this.shopService.getShopInfo(idShop).subscribe(
      (data) => {
        this.shopInfor = data;
        this.load5ProductDiscount(idShop);
        this.load5ProductNew(idShop);
        this.load5ProductSalling(idShop);
      },
      (err) => {
        this.router.navigate(['']);
      }
    );
  }
  public ToAllProductInterfaceShop() {
    document.location.href =
      '/shop/showall/interface?idShop=' + this.getParam();
  }
  public LoadProductTable() {
    if (this.location == 'discount') {
      this.loadProductSale();
    } else if (this.location == 'selling') {
      this.loadProductSalling();
    } else if (this.location == 'new') {
      this.loadProductNew();
    }
  }
  public loadProductSale() {
    this.loadingProductTable = true;
    this.route.queryParams.subscribe((params) => {
      this.page = params['page'];
    });
    this.page == undefined ? (this.page = 1) : 0;
    this.shopService.getProductSale(this.getParam(), this.page - 1, this.keySearch).subscribe(
      (data) => {
        this.listProduct = data.content;
        this.count = 0;
        this.count = data.content.length;
        this.loadingProductTable = false;
        this.sortHandler();
      },
      (err) => {
        console.log(err);
        this.loadingProductTable = false;
      }
    );
  }
  public loadProductNew() {
    this.loadingProductTable = true;
    this.route.queryParams.subscribe((params) => {
      this.page = params['page'];
    });
    this.page == undefined ? (this.page = 1) : 0;
    this.shopService.getProductNew(this.getParam(), this.page - 1, this.keySearch).subscribe(
      (data) => {
        this.listProduct = data.content;
        this.count = 0;
        this.count = data.content.length;
        this.loadingProductTable = false;
        this.sortHandler();
      },
      (err) => {
        this.loadingProductTable = false;
        console.log(err);
      }
    );
  }
  public loadProductSalling() {
    this.loadingProductTable = true;
    this.route.queryParams.subscribe((params) => {
      this.page = params['page'];
    });
    this.page == undefined ? (this.page = 1) : 0;
    this.shopService
      .getProductSalling(this.getParam(), this.page - 1, this.keySearch)
      .subscribe(
        (data) => {
          this.listProduct = data.content;
          this.count = 0;
          this.count = data.content.length;
          this.loadingProductTable = false;
          this.sortHandler();
        },
        (err) => {
          this.loadingProductTable = false;
          console.log(err);
        }
      );
  }
  public handlePageChange(event: number) {
    this.page = event;
    this.routeParams();
  }
  routeParams() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: this.getRequestParams(this.location, this.page, this.sortBy, this.keySearch),
      queryParamsHandling: 'merge', // remove to replace all query params by provided
    });
    this.LoadProductTable();
  }
  getRequestParams(location: any, page: number, sortBy: any, keySearch: any): any {
    let params: any = {};
    if (page) {
      params[`page`] = page;
    }
    if (page) {
      params[`location`] = location;
    }
    if (sortBy) {
      params[`sortBy`] = sortBy;
    }
    if (this.keySearch !=''){
      params['keySearch'] = keySearch;
    }
    if (this.keySearch ==''){
      params['keySearch'] = '';
    }
    console.log(params)
    return params;
  }
  addToCart(product: any) {
    var json = localStorage.getItem('cart');
    this.cart = json ? JSON.parse(json) : [];
    var item: any;
    this.cart.forEach((e) => {
      if (e.product_option.id == product.optionDef.id) {
        item = e;
      }
    });
    if (item) {
      item.quantity++;
    } else {
      this.cart.push({
        quantity: 1,
        product_option: product.optionDef
      
      });
    }
    localStorage.setItem('cart', JSON.stringify(this.cart));
    this.headerService.myMethod(this.cart);
  }
  public load5ProductDiscount(idshop: any) {
    this.loadingProductDiscount = true;
    this.shopService.get5ProductDiscount(idshop).subscribe(
      (data) => {
        this.fakeArrayDiscount5 = data;
        this.loadingProductDiscount = false;
        console.log(data);
      },
      (err) => {
        console.log(err);
        this.loadingProductDiscount = false;
      }
    );
  }
  public load5ProductNew(idshop: any) {
    this.loadingProductNew = true;
    this.shopService.get5ProductNew(idshop).subscribe(
      (data) => {
        this.fakeArrayNew5 = data.content;
        this.loadingProductNew = false;
      },
      (err) => {
        console.log(err);
        this.loadingProductNew = false;
      }
    );
  }
  public load5ProductSalling(idshop: any) {
    this.loadingProductSelling = true;
    this.shopService.get5ProductSalling(idshop).subscribe(
      (data) => {
        this.fakeArraySalling5 = data;
        this.loadingProductSelling = false;
      },
      (err) => {
        console.log(err);
        this.loadingProductSelling = false;
      }
    );
  }
  public ClickProductNew() {
    if (this.location != 'new') {
      this.location = 'new';
      this.page = 1;
      this.keySearch = '';
      this.routeParams();
    }
  }
  public ClickProductDiscount() {
    if (this.location != 'discount') {
      this.location = 'discount';
      this.page = 1;
      this.keySearch = '';
      this.routeParams();
    }
  }
  public ClickProductSalling() {
    if (this.location != 'selling') {
      this.location = 'selling';
      this.page = 1;
      this.keySearch = '';
      this.routeParams();
    }
  }
  async sortProduct(value: any) {
    this.sortBy = value;
    this.routeParams();
  }

  async sortPriceProduct(event: any) {
    this.sortBy = event.target.value;
    this.routeParams();
  }

  sortHandler() {
    if (this.sortBy === 'ctime') {
      this.listProduct.sort((a: any, b: any) => {
        return a == null || b == null
          ? 0
          : a.createdate > b.createdate
          ? -1
          : 1;
      });
    } else if (this.sortBy === 'discount') {
      this.listProduct.sort((a: any, b: any) => {
        // 0 có nghĩa là giống nhau
        // -1 có nghĩa là a < b
        // 1 có nghĩa là a > b
        return a.optionDef.productDiscount.length == 0 &&
          b.optionDef.productDiscount.length == 0
          ? 0
          : a.optionDef.productDiscount.length == 0
          ? 1
          : b.optionDef.productDiscount.length == 0
          ? -1
          : a.optionDef.productDiscount[0].discount >
            b.optionDef.productDiscount[0].discount
          ? -1
          : 1;
      });
    } else if (this.sortBy == 'evaluate') {
      this.listProduct.sort((a: any, b: any) => {
        return a.evaluateDef == null && b.evaluateDef == null
          ? 0
          : a.evaluateDef == null
          ? 1
          : b.evaluateDef == null
          ? -1
          : a.evaluateDef > b.evaluateDef
          ? -1
          : 1;
      });
    } else if (this.sortBy == 'DESC') {
      this.listProduct.sort((a: any, b: any) => {
        return a.optionDef.price > b.optionDef.price ? -1 : 1;
      });
    } else if (this.sortBy == 'ASC') {
      this.listProduct.sort((a: any, b: any) => {
        return a.optionDef.price < b.optionDef.price ? -1 : 1;
      });
    }
  }
  showDetailProduct(product: any) {
    this.router.navigate([`/product/detail/${product}`]);
  }

  searchProduct(keySearch: any){   
    this.keySearch = keySearch;
    this.routeParams();
  }
}
