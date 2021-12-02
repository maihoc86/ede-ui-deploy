import { ProductSearchService } from './../Services/product-search/product-search.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../Services/header/header.service';
import { AddProductService } from '../Services/product-shop/add-product.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ShipService } from '../Services/ship/ship.service';
import { ReturnAddressService } from '../Services/return-address/return-address.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent implements OnInit {
  public HOST_ORIGIN = 'http://localhost:8080';

  constructor(
    private activatedRoute: ActivatedRoute,
    private productService: AddProductService,
    private router: Router,
    private productSearchSrv: ProductSearchService,
    private headerService: HeaderService,
    private cookieService: CookieService,
    private address_ship: ShipService,
    private addAddress: ReturnAddressService
  ) {
    this.activatedRoute.params.subscribe(({ idProduct }) => {
      this.productSearchSrv
        .getProductSearchById(idProduct)
        .subscribe((result) => {
          this.productShow = result.optionDef;
          console.log(result)
          this.product = result;
          this.ShowAllComment(idProduct);
          console.log(this.product);
          this.loadListProductRelatedShop(
            result.shop.id,
            result.childCategory.id
          );
          this.loadListProductRelatedCategory(result.childCategory.id);
          // this.getApiMethodShip();
        });
    });
  }
  public ship = new FormGroup({
    company: new FormControl('GHN'), // Đối tác vận chuyển default Giao hàng nhanh
    city: new FormControl(''), // city default Hòa Bình
    from_district: new FormControl(''), // district của shop
    district: new FormControl(''), // to_district Huyện Yên Thủy
    wards: new FormControl(''), // wards default Xã Yên Trị
    method: new FormControl(''), // phương thức vận chuyện [đi bộ, máy bay ...] default là bay
  });

  public fromComment = new FormGroup({
    id: new FormControl(''),
    rate: new FormControl('5'),
    content: new FormControl('', [Validators.required]),
    date: new FormControl(new Date()),
    id_user: new FormControl(''),
    id_product: new FormControl(''),
  });

  public userLogin: any = null;
  public qty: number = 1;
  public product: any = {};
  public cart: Array<any> = [];
  public listProductRelatedShop: any = [];
  public listProductRelatedProduct: any = [];
  public listProductRelatedCategory: any = [];
  public listCitys: any = [];
  public listDistricts: any = [];
  public listWards: any = [];
  public listShippingCompany: any = [];
  public listMethodShip: any = [];
  public listComment: Array<any> = [];
  public feeShip: number = 0; // phí ship sau khi tính toán
  public fakeArrayRate: any = [];
  public nameOption: any = 'nameOption';
  public productShow: any = [];
  ngOnInit(): void {
    this.getUserLogin();
    this.addHistoryView();
  }
  addToCart( qty: any) {
    if( this.userLogin != null){
      var json = localStorage.getItem('cart');
    this.cart = json ? JSON.parse(json) : [];
    var item: any;
    this.cart.forEach((e) => {
      if (e.product_option.id == this.productShow.id) {
        item = e;
      }
    });
    if (item) {
      item.quantity=Number( item.quantity)+Number(qty);
    } else {
      this.cart.push({
        quantity: qty,
        feeShip:0,
        product_option: this.productShow,
      });
    }
    localStorage.setItem('cart', JSON.stringify(this.cart));
    this.headerService.myMethod(this.cart);
    }
    else{
     this.addAddress.addAddress();
    }
  }
  public loadListProductRelatedShop(idShop: string, idcate: string) {
    this.productSearchSrv
      .loadListProductRelatedShop(idShop, idcate)
      .subscribe((data) => {
        this.listProductRelatedShop = data.content;
      });
  }
  public loadListProductRelatedCategory(idCategory: string) {
    this.productService
      .getAllProductByCategory(idCategory)
      .subscribe((data) => {
        this.listProductRelatedCategory = data.content;
      });
  }

  public openDetailByRelated(id: string) {
    document.location.href = 'http://localhost:4200/product/detail/' + id;
  }
  public toInterfaceShop(id: any) {
    this.router.navigate(['/shop/interface/' + id]);
  }

  public ShowAllComment(id: any) {
    this.productService.getAllCommentByIdPeoduct(id).subscribe((data) => {
      this.listComment = data;
      for (let index = 0; index < this.listComment.length; index++) {
        this.productService
          .getOptionProduct(
            this.listComment[index].user.id,
            this.listComment[index].product.id
          )
          .subscribe((data2) => {
            this.listComment[index].product.name = data2[0].display_name;
            console.log('nameOption: ' + data2[0].display_name);
            console.log(data2);
          });
      }

      console.log(this.listComment);
    });
  }

  public fakeArray(num: any) {
    this.fakeArrayRate = [];
    for (let index = 0; index < num; index++) {
      this.fakeArrayRate.push(index);
    }
    // console.log('rate: ' + this.fakeArrayRate)
    return this.fakeArrayRate;
  }

  public showNameOption(idUser: any, id: any) {
    this.productService.getOptionProduct(idUser, id).subscribe((data) => {
      return this.nameOption;
    });
  }

  public CreateComment() {
    this.headerService.getUserByToken(this.cookieService.get('auth')).subscribe(
      (data) => {
        if (!this.fromComment.valid) {
          alert('Bạn chưa nhập bình luận');
        } else {
          this.fromComment.controls['id_product'] = this.product.idProduct;
          this.productService
            .createCommentProductByIdUser(
              this.userLogin.id,
              this.product.idProduct,
              this.fromComment
            )
            .subscribe(
              (data) => {
                this.ShowAllComment(this.product.idProduct);
              },
              (error) => {
                // console.log(error)
                if (error.status == 403) {
                  Swal.fire({
                    title: 'Thông báo',
                    icon: 'warning',
                    text: error.error.message,
                    showConfirmButton: true,
                    showCancelButton: true,
                    confirmButtonText: 'Cập nhật lại bình luận trước?',
                    cancelButtonText: 'Hủy',
                  }).then((rs) => {
                    if (rs.isConfirmed) {
                      this.productService
                        .updateCommentProductByIdUser(
                          this.userLogin.id,
                          this.product.idProduct,
                          this.fromComment
                        )
                        .subscribe(() => {
                          this.ShowAllComment(this.product.idProduct);
                        });
                    }
                  });
                } else {
                  Swal.fire({
                    title: 'Thông báo',
                    icon: 'error',
                    text: error.error.message,
                  });
                }
              }
            );
          //console.log(this.product)
        }
      },
      (error) => {
        Swal.fire({
          title: 'Thông báo',
          icon: 'warning',
          text: 'Bạn chưa đăng nhập',
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: 'Đăng nhập ngay?',
          cancelButtonText: 'Để sau',
        }).then((rs) => {
          if (rs.isConfirmed) {
            this.addAddress.addAddress();
          }
        });
      }
    );
  }

  public getUserLogin() {
    this.headerService
      .getUserByToken(this.cookieService.get('auth'))
      .subscribe((data) => {
        this.userLogin = data;
      });
  }

  /** Hàm thêm lịch sử view của người dùng khi xem product
   *
   */
  public addHistoryView() {
    let ProductMetaList: any = {};

    this.headerService
      .getUserByToken(this.cookieService.get('auth'))
      .subscribe((user) => {
            this.activatedRoute.params.subscribe(({ idProduct }) => {
        this.productService.getProduct(idProduct).subscribe((product) => {
          ProductMetaList = {
            date_view: new Date(),
            cookie: this.cookieService.get('auth'),
            user: user,
            product: product,
          };

          this.productService
            .getProductMetaView(user.id, product.id)
            .subscribe((dataGet: any) => {
              if (dataGet == null) {
                this.productService
                  .addProductMetaView(ProductMetaList)
                  .subscribe(
                    (data: any) => {},
                    (error: any) => {
                      console.log(error);
                    }
                  );
              }
            });
        });

      });
    })
  }
  changeOptione(option: any){
    this.productShow=option
  }
}
