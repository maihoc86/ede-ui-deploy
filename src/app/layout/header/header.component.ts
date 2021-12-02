import { AddProductService } from './../../Services/product-shop/add-product.service';
import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute } from '@angular/router';
import { HeaderService } from 'src/app/Services/header/header.service';
import { User } from 'src/app/models/user.model';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { OrderShopService } from 'src/app/Services/order-shop/order-shop.service';
declare var $: any;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: [
    './header.component.css',
    '../../../assets/css/header/header1.css',
  ],
})
export class HeaderComponent implements OnInit {
  constructor(
    private cookieService: CookieService,
    private headerService: HeaderService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private producService: AddProductService,
    private orderShop: OrderShopService
  ) {
    this.addViewPage();
    router.events.subscribe(() => {
      this.hidenSearch();
    });
    this.u = {} as User;
    this.headerService.myMethod$.subscribe((data) => {
      this.cart = data;
      this.loadTotal();
      if (this.login) {
        this.headerService
          .updateCart(this.cart, this.u.id)
          .subscribe((data) => {
            // console.log(data)
          });
      }
    });
  }

  public txtKeysearch: string = '';
  public time: any = '';
  public listOrderShop: any = [];
  public idCheckAlertOrder: any = '';
  ngOnInit(): void {
    this.getUserLogin();

    this.activatedRoute.queryParams.subscribe((params) => {
      this.params = params;
      this.txtKeysearch = params.search;
    });
    this.loadCart();
    this.getAllCategory();
  }
  public totalCart: any = 0;
  public cart: Array<any> = [];
  public params = {};

  public login: boolean = false;
  public u: User;
  public active: boolean = false;

  public list_parent_category: any = [];
  public list_parent_child_category: any = [];
  public list_child_category: any = [];

  public viewPage = new FormGroup({
    id: new FormControl(''),
    ip: new FormControl(''),
    cookie: new FormControl(null),
    date_view: new FormControl(''),
  });

  addViewPage() {
    this.headerService.getIpAddress().subscribe((ip: any) => {
      this.headerService.getIpAddressDB(ip.ip).subscribe((data) => {
        if (data == null) {
          this.viewPage.controls['ip'].setValue(ip.ip);
          if (this.cookieService.get('auth') != '') {
            this.viewPage.controls['cookie'].setValue(
              this.cookieService.get('auth')
            );
          }
          this.headerService.insertViewPage(this.viewPage.value).subscribe(
            (data) => {},
            (err) => {
              console.log(err);
            }
          );
        }
      });
    });
  }
  /**
   * Hàm kiểm tra xem Shop đang có đơn nào cần xác nhận giao hàng hay không
   */
  public getOrderShop() {
    setInterval(() => {
      this.orderShop.getListOrderShop().subscribe(
        (data) => {
          this.listOrderShop = data;
          this.listOrderShop.forEach((element: any) => {
            if (
              element.status === 'Chờ xác nhận' &&
              element.id != this.idCheckAlertOrder
            ) {
              this.idCheckAlertOrder = element.id;
              $.jGrowl.defaults.closer = false;
              var tpl =
                '<img src="/assets/image/demo/order.png" alt="">' +
                '<h3><a href="/shop/order/all?page=1&size=5&status=Chờ%20xác%20nhận">Xem ngay</a> ' +
                'Bạn đang có đơn chờ xác nhận giao hàng' +
                '</h3>';
              $.jGrowl(tpl, {
                life: 50000,
                header: 'Đơn xác nhận giành cho Shop',
                speed: 'speed',
                theme: 'success',
              });
            }
          });
        },
        (error) => {
          console.log(error);
        }
      );
    }, 1000);
  }

  public async getUserLogin() {
    await this.headerService
      .getUserByToken(this.cookieService.get('auth'))
      .toPromise()
      .then((data) => {
        this.login = true;
        this.u = data;
        this.getOrderShop();
      })
      .catch((err) => {
        console.log('login with role Guest');
        this.login = false;
      });
  }

  public async logout() {
    this.router.navigate(['/']);
    this.cookieService.delete('auth', '/');
    localStorage.removeItem('cart');
    document.location.href = '';
  }

  loadCart() {
    var json = localStorage.getItem('cart');

    this.cart = json ? JSON.parse(json) : [];
    this.loadTotal();
  }
  public removeItemCart(e: any) {
    this.cart.splice(
      this.cart.findIndex((es) => es.id == e.id),
      1
    );
    localStorage.setItem('cart', JSON.stringify(this.cart));
    this.loadTotal();
    this.headerService.myMethod(this.cart);
  }
  /**
   * Hàm thay đổi số lượng
   */
  changeQty(qtyCurrent: any, qtyChange: any) {
    qtyCurrent.quantity = qtyChange;
    qtyChange > qtyCurrent.qty
      ? qtyCurrent.quantity++
      : qtyCurrent.quantity == qtyChange
      ? (qtyCurrent.quantity = qtyChange)
      : qtyCurrent.quantity--;
    qtyChange == 0 ? this.removeItemCart(qtyCurrent) : '';
    localStorage.setItem('cart', JSON.stringify(this.cart));
    this.loadTotal();
    this.headerService.myMethod(this.cart);
  }
  /**
   * Hàm chỉ được dùng số
   */
  numberOnly(event: any, qtyCurrent: any, qtyChange: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    } else {
      qtyCurrent.qty = qtyChange;
      localStorage.setItem('cart', JSON.stringify(this.cart));
      this.loadTotal();
      return true;
    }
  }
  loadTotal() {
    console.log(this.cart);
    this.totalCart = 0;
    this.cart.forEach((e) => {
      this.totalCart +=
        e.quantity *
        (e.product_option.productDiscount == 0
          ? e.product_option.price
          : e.product_option.price -
            e.product_option.price *
              (e.product_option.productDiscount[0].discount / 100));
    });
  }

  openShop() {
    this.headerService.getShopByToken(this.cookieService.get('auth')).subscribe(
      (data) => {
        console.log(data);
        if (data.status) {
          this.router.navigate(['shop/product/all']);
        } else {
          Swal.fire({
            title: 'Thông báo',
            text: 'Shop của bạn đã bị tạm khoá',
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: 'Liên hệ hỗ trợ?',
            cancelButtonText: 'Trở lại',
          });
        }
      },
      (error) => {
        console.log(error);
        if (error.status == 404) {
          document.location.href = 'http://localhost:4200/login';
        }
      }
    );
    //
  }

  hidenSearch() {
    const segments: any = window.location.href;
    if (segments.indexOf('/shop/') > -1) {
      this.active = true;
    }
  }

  getAllCategory() {
    this.producService.getChildCategories().subscribe((data) => {
      this.list_child_category = data;
    });
    this.producService.getParentChildCategories().subscribe((data) => {
      this.list_parent_child_category = data;
    });
    this.producService.getParentCategories().subscribe((data) => {
      this.list_parent_category = data;
    });
  }
}
