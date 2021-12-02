import { CookieService } from 'ngx-cookie-service';
import { HeaderService } from 'src/app/Services/header/header.service';
import { Component, OnInit } from '@angular/core';
import { AddProductService } from '../Services/product-shop/add-product.service';
import { Router, ActivatedRoute, NavigationEnd, NavigationStart, NavigationError, Event } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-product-all',
  templateUrl: './product-all.component.html',
  styleUrls: ['./product-all.component.css']
})
export class ProductAllComponent implements OnInit {

  constructor(private productService: AddProductService, private router: Router, private route: ActivatedRoute, private cookieService: CookieService,    private headerService: HeaderService,) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        // Show loading indicator
      }
      if (event instanceof NavigationEnd) {
        this.route.queryParams.subscribe(params => {
          let getSize = params['size'];
          let getPage = params['page'];
          let getKeyword = params['keyword'];
          if(getKeyword !== undefined){
            this.keywordProductAll = getKeyword;
          }
          if(getPage !== undefined){
            this.p = getPage;
          }
          if(getSize !== undefined){
            // this.size = getSize;
          }
        });
      }
      if (event instanceof NavigationError) {
        // Hide loading indicator
        // Present error to user
        console.log(event.error);
      }
    });
  }

  ngOnInit(): void {
    this.loadParams().then(result => {
      this.loadProductAll(this.keywordProductAll,this.p,this.size).then(result2 => {
        this.headerService.getShopByToken(this.cookieService.get('auth')).subscribe(data=>{
          this.idShop=data.id;
          this.getAllProductDefault(this.idShop,this.p - 1,this.size,this.keywordProductAll); // this.p-1
        })
      })
    })
  }
  filterEnableFalse() {
    this.loadProductEnableFalse("",false, 1,5);
  }
  filterEnableTrue() {
    this.loadProductEnableTrue("",true, 1,5);
  }
  filterQuantity0() {
    this.loadProductQty0("",1,5);
  }
  public idShop:string="";
  public keywordProductAll: string="";
  public keywordEnableTrue: string="";
  public keywordEnableFalse: string="";
  public keywordQty0: string="";

  public size: number = 5;
  public sizeEnableTrue: number = 5;
  public sizeEnableFalse: number = 5;
  public sizeQuantity0: number = 5;

  public count: any;
  // count item filter enable true
  public countEnableTrue: any;
  // count item filter enable false
  public countEnableFalse: any;
  // count item filter quantity 0
  public countQty0: any;
  public page: any = [];
  public pageEnableTrue: any = [];
  public pageEnableFalse: any = [];
  public pageQty0: any = [];

  public listProductOption: any = { };
  public p: number = 1;
  // page filter enable true
  public pEnableTrue: number = 1;
  // page filter enable false
  public pEnableFalse: number = 1;
  // page filter quantity 0
  public pQty0: number = 1;
  public items: any = [];
  public itemsEnableTrue: any = [];
  public itemsEnableFalse: any = [];
  public itemsQuantity0: any = [];

  public itemProduct: any = [];

  public async loadProductAll(keyword: any, page: any, size: any) {
    page = page - 1;
    await this.productService.getAllProductOption(keyword,page, size).subscribe((data) => {
      const item = data.content.map(function (obj: {
        id: any;
        id_product: any;
        display_name: any;
        price: any;
        size: any;
        quantity: any;
      }) {
        return obj;
      })
      this.items = item;
      // this.page = data; // xxabc 
      // this.arrays = [];
      this.count = this.page.totalElements;
      //this.arrays = Array(this.page.totalPages).fill(0).map((x, i) => ({ id: (i + 1), name: `Item ${i + 1}`}));
      this.itemsEnableTrue = item;
      this.itemsEnableFalse = item;
      this.itemsQuantity0 = item;
    },
    (err) => {
      console.log("Chưa đăng nhập " + err.error)
      if (err.status == 401) {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: "Chưa đăng nhập",
        });
        this.router.navigate(['/login'])
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: err.error.message,
        });
      }
    })
  }




  // load all produt filter by quantity
  public loadProductQty0(keyword: any, page: any, size: any) {
    page = page - 1;
    this.productService.getAllProductByQty0(keyword,page, size).subscribe((data) => {
      this.itemsQuantity0 = data.content.map(function (obj: {
        id: any;
        id_product: any;
        display_name: any;
        price: any;
        size: any;
        quantity: any;
      }) {
        return obj;
      });
      this.pageQty0 = data;
      this.countQty0 = this.pageQty0.totalElements;
    },
      (err) => {
        if (err.status == 401) {
          Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: "Chưa đăng nhập",
          });
          this.router.navigate(['/login'])
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: err.message,
          });
        }
      });

  }





  // load all product filter by enable
  public loadProductEnableTrue(keyword: any, value: boolean, page: any, size: any) {
    page = page - 1;
    this.productService.getAllProductByEnable(this.keywordEnableTrue, true, page, size,this.idShop).subscribe((data) => {
      console.log(data);
        this.itemsEnableTrue = data.content;
        this.countEnableTrue = data.totalElements;
        this.pageEnableTrue = data;
        if(this.pEnableTrue-1>this.page.totalPages){
          this.pEnableTrue=1;
        }
    }, error => {
      if (error.status == 404) {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: "Chưa đăng nhập",
        });
        this.router.navigate(['/login'])
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: error.error.message,
        });
      }
    })
  }





  public loadProductEnableFalse(keyword: any, value: boolean, page: any, size: any) {
    page = page - 1;
    this.productService.getAllProductByEnable(this.keywordEnableFalse, false, page, this.sizeEnableFalse,this.idShop).subscribe((data) => {
      console.log(data);
      this.itemsEnableFalse = data.content;
      this.countEnableFalse = data.totalElements;
      this.pageEnableFalse = data;
      if(this.pEnableFalse-1>this.page.totalPages){
        this.pEnableFalse=1;
      }
    }, error => {
      if (error.status == 401) {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: "Chưa đăng nhập",
        });
        this.router.navigate(['/login'])
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: error.error.message,
        });
      }
    })
  }




  public handlePageChange(event:number){
    this.p = event;
    //this.router.navigate(["/shop/product/all?page=" + this.p+"&size="+this]);
    this.showParamsURL("",this.p,this.size);
    this.getAllProductDefault(this.idShop,this.p - 1,this.size,"");
  }





  public handlePageChangeEnableTrue(event: number) {
    this.pEnableTrue = event;
    console.log("pEnableTrue in handlePageChangeEnableTrue: "+this.pEnableTrue);
    this.showParamsURL("",this.pEnableTrue,this.sizeEnableTrue);
    this.loadProductEnableTrue(this.keywordEnableTrue,true, this.pEnableTrue, this.sizeEnableTrue);
  }





  public showParamsURL(keyword: string, page: number, size: number){
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: this.getRequestParams(keyword,page,size),
        queryParamsHandling: 'merge', // remove to replace all query params by provided
      });
  }





  // action change page filter enable true
  public handlePageChangeEnableFalse(event: number) {
    this.pEnableFalse = event;
    this.showParamsURL("",this.pEnableFalse,this.sizeEnableFalse);
    this.loadProductEnableFalse(this.keywordEnableFalse,false, this.pEnableFalse,this.sizeEnableFalse);
  }




  // action change page filter quantity
  public handlePageChangeQty0(event: number) {
    this.pQty0 = event;
    this.showParamsURL("",this.pQty0,this.sizeQuantity0);
    this.loadProductQty0(this.keywordQty0,this.pQty0, this.sizeQuantity0);
  }





  getRequestParams(searchKeyword: string, page: number, pageSize: number): any {
    let params: any = {};

    if (searchKeyword) {
      params[`keyword`] = searchKeyword;
    }

    if (page) {
      params[`page`] = page;
    }

    // if (pageSize) {
    //   params[`size`] = pageSize;
    // }

    return params;
  }





  public changeSize(event: any){
    this.p = 1;
    this.size = event.target.value;
    this.showParamsURL("",this.p,this.size);
    this.getAllProductDefault(this.idShop,this.p-1, this.size,"");
  }





  public changeSizeEnableTrue(event: any){
    this.pEnableTrue = 1;
    this.sizeEnableTrue = event.target.value;
    console.log("size nè: "+event.target.value);
    this.loadProductEnableTrue(this.keywordEnableTrue,true,this.pEnableTrue, this.sizeEnableTrue);

  }





  public changeSizeEnableFalse(event: any){
    this.pEnableFalse= 1;
    this.sizeEnableFalse = event.target.value;
    console.log("size nè: "+event.target.value);
    console.log("pEnableFalse in changeSizeEnableFalse: "+ this.pEnableFalse);
    this.loadProductEnableFalse(this.keywordEnableFalse,false,this.pEnableFalse, this.sizeEnableFalse);

  }





  public changeSizeQuantity0(event: any){
    this.pQty0= 1;
    this.sizeQuantity0 = event.target.value;
    console.log("size nè: "+event.target.value);
    console.log("pQty0 in changeSizeQuantity0: "+ this.pQty0);
    this.loadProductQty0(this.keywordQty0,this.pQty0, this.sizeQuantity0);

  }



  public editProduct(id: string) {
    //routerLink="[`/shop/product/manager`,e.product.id,'id']"
    this.router.navigate(['shop/product/manager', id]);
  }




  public countOrder: any = "";
  public countProductOder(id: string) {
    this.productService.countProductOrder(id).subscribe((data) => {
      this.countOrder = data;
    })

  }


  public searchProductAll(keywordProductAll: string){
    this.keywordProductAll = keywordProductAll;
    this.p = 1;
    this.showParamsURL(this.keywordProductAll,this.p,this.size);
    this.getAllProductDefault(this.idShop,this.p-1,this.size, this.keywordProductAll)
  }



  public searchEnableTrue(keywordEnableTrue: string){
    this.keywordEnableTrue = keywordEnableTrue;
    this.pEnableTrue = 1;
    this.showParamsURL(this.keywordEnableTrue,this.pEnableTrue,this.sizeEnableTrue);
    this.loadProductEnableTrue(this.keywordEnableTrue,true,this.pEnableTrue,this.sizeEnableTrue)
  }



  public searchEnableFalse(keywordEnableFalse: string){
    this.keywordEnableFalse = keywordEnableFalse;
    this.pEnableFalse = 1;
    this.showParamsURL(this.keywordEnableFalse,this.pEnableFalse,this.sizeEnableFalse);
    this.loadProductEnableFalse(this.keywordEnableFalse,false,this.pEnableFalse,this.sizeEnableFalse)
  }


  public searchQty0(keywordQty0: string){
    this.keywordQty0 = keywordQty0;
    this.pQty0 = 1;
    this.showParamsURL(this.keywordQty0,this.pQty0,this.sizeQuantity0);
    this.loadProductQty0(this.keywordQty0,this.pQty0,this.sizeQuantity0)
  }

  public getAllProductDefault(idShop: any, page: any, size: any,keyword: any) {
    this.productService.getAllProductShopByCustomer(idShop, page, size,keyword).subscribe (
      (data) => {
        console.log(data);
        this.itemProduct = data.content;
        this.count = data.totalElements;
        this.page = data;
        // if(this.p-1 > this.page.totalPages){
        //   this.p = 1;
        // }
      // this.arrays = [];
      // this.arrays = Array(this.page.totalPages).fill(0).map((x, i) => ({ id: (i + 1), name: `Item ${i + 1}`}));
      }
    );
  }

  public showProductOption(id:string){
    this.listProductOption=[]
    this.itemProduct.forEach((e:any) => {
        if(e.idProduct==id){
          this.listProductOption=e.productOptions
        }
    });
  }

  public showProductOptionEnableTrue(id:string){
    this.listProductOption=[]
    this.itemsEnableTrue.forEach((e:any) => {

        if(e.idProduct==id){
          this.listProductOption=e.productOptions
        }
    });

    console.log( this.listProductOption)
  }
  public showProductOptionEnableFalse(id:string){
    this.listProductOption=[]
    this.itemsEnableFalse.forEach((e:any) => {

        if(e.idProduct==id){
          this.listProductOption=e.productOptions
        }
    });

    console.log( this.listProductOption)
  }
  public async loadParams() {
    await this.route.queryParams.subscribe(value => {
      this.p = value.page || 1
      // this.size = value.size || 10
    })
  }
}
