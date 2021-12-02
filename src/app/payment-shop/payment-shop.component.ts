import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { HeaderService } from '../Services/header/header.service';
import { PaymentShopService } from '../Services/payment-shop/payment-shop.service';
import Swal from 'sweetalert2';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentShop } from '../models/payment.model';

@Component({
  selector: 'app-payment-shop',
  templateUrl: './payment-shop.component.html',
  styleUrls: ['./payment-shop.component.css'],
})
export class PaymentShopComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private headerService: HeaderService,
    private paymentService: PaymentShopService,
    private fb: FormBuilder
  ) {}
  public activeTab: any = 1;
  listDetail: any = [0];
  public fields: any;
  public managePayment: any = FormGroup;

  public page: any = [];
  public p: number = 1;
  public count: number = 0;
  public keyword: any = '';
  public listAllPaymentShop: any = [];
  ngOnInit(): void {
    this.listPayment();

    this.fields = {
      isRequired: true,
      detailTemp: {
        options: [
          {
            key: this.makeid(5) + this.listDetail.length,
            label: '',
            value: '',
          },
        ],
      },
    };

    this.managePayment = this.fb.group({
      id: '',
      name: [
        '',
        [
          Validators.required,
          Validators.pattern(
            "^\\S([a-zA-Z0-9\\xC0-\\uFFFF]{1,100}[ \\-\\']{0,}){1,100}$"
          ),
        ],
      ],
      detailTemp: this.fb.group({
        options: this.fb.array([], Validators.required),
      }),
      detail: [''],
      createdate: '',
      user: '',
      status: '',
    });
    this.patch();
  }

  patch() {
    const control = <FormArray>this.managePayment.get('detailTemp.options');
    this.fields.detailTemp.options.forEach((x: any) => {
      control.push(this.patchValues(x.key, x.label, x.value));
    });
  }

  patchValues(key: any, label: any, value: any) {
    return this.fb.group({
      key: [key],
      label: [label],
      value: [value],
    });
  }
  validator(): any {
    var check = true;
    this.managePayment.value.detailTemp.options.forEach((x: any) => {
      if (x.key === '' || x.label === '' || x.value === '') {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: 'Vui lòng nhập đầy đủ thông tin',
        });
        check = false;
      }
    });
    return check;
  }

  addNewInputDetail() {
    this.fields.detailTemp.options.push({
      key: this.makeid(5) + this.listDetail.length,
      label: '',
      value: '',
    });
    this.listDetail.push(this.makeid(5) + this.listDetail.length);
    const control = <FormArray>this.managePayment.get('detailTemp.options');
    control.push(
      this.patchValues(this.makeid(5) + this.listDetail.length, '', '')
    );
  }

  removeInputDetail(detail: any) {
    const control = <FormArray>this.managePayment.get('detailTemp.options');
    if (control.length > 1) {
      control.removeAt(detail);
    }
  }

  addNewPayment() {
    if (this.validator()) {
      var detail = JSON.stringify(this.managePayment.value.detailTemp.options);
      this.managePayment.controls['detail'].setValue(detail);
      this.paymentService.addPaymentShop(this.managePayment.value).subscribe(
        (data: any) => {
          Swal.fire({
            icon: 'success',
            title: 'Thêm phương thức thanh toán',
            text: 'Thêm thành công',
          }).then(() => {
            this.resetForm();
            this.listAllPaymentShop();
          });
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Thêm thất bại',
            text: error.error.message,
          });
        }
      );
    }
  }
  activeTabPane(tab: any) {
    this.activeTab = tab;
  }

  editPayment(payment: any) {
    this.activeTab = 1;
    const newPayment: any = {};

    const detail = JSON.parse(payment.detail.replace(/ 0+(?![\. }])/g, ' '));
    const control = <FormArray>this.managePayment.get('detailTemp.options');
    control.clear();
    detail.forEach((x: any) => {
      control.push(this.patchValues(x.key, x.label, x.value));
    });
    for (const controlName in this.managePayment.controls) {
      if (controlName != 'detailTemp') {
        this.managePayment.controls[controlName].setValue(payment[controlName]);
      }
    }

    return newPayment as PaymentShop;
  }

  deletePaymentById(id: any) {
    this.paymentService.deletePaymentById(id).subscribe(
      (data: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Xóa',
          text: 'Xóa thành công',
        }).then(() => {
          this.listPayment();
        });
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Xóa thất bại',
          text: error.error.message,
        });
      }
    );
  }

  deletePayment() {
    this.paymentService
      .deletePaymentById(this.managePayment.value.id)
      .subscribe(
        (data: any) => {
          Swal.fire({
            icon: 'success',
            title: 'Xóa',
            text: 'Xóa thành công',
          }).then(() => {
            this.resetForm();
            this.listPayment();
          });
        },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Xóa thất bại',
            text: error.error.message,
          });
        }
      );
  }

  updatePayment() {
    var detail = JSON.stringify(this.managePayment.value.detailTemp.options);
    this.managePayment.controls['detail'].setValue(detail);
    this.paymentService.updatePaymentShop(this.managePayment.value).subscribe(
      (data: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Cập nhật phương thức thanh toán',
          text: 'Cập nhật thành công',
        }).then(() => {
          this.resetForm();
          this.listPayment();
        });
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Cập nhật thất bại',
          text: error.error.message,
        });
      }
    );
  }
  /**
   * Hàm thực hiện load phương thức thanh toán theo param trên url
   */
  public listPayment() {
    var param = this.route.snapshot.queryParamMap;
    this.page = param.get('page');
    this.keyword = param.get('keyword') ? param.get('keyword') : '';
    this.p = this.page;
    if (this.page != undefined) {
      this.page = this.page - 1;
      this.getAllPaymentDefault(this.page, 5, this.keyword);
    } else {
      // DEFAULT IF NO PRESENT PAGE
      this.getAllPaymentDefault(0, 5, this.keyword);
    }
  }

  /**
   * Hàm lấy ra tất cả sản phẩm của shop
   * @param page trang số
   */
  public getAllPaymentDefault(page: any, size: any, keyword: any) {
    this.paymentService.getAllPayment(page, size, keyword).subscribe(
      (data) => {
        console.log(data);
        this.listAllPaymentShop = data.content.map(function (obj: {
          id: any;
          name: any;
          detail: any;
          shop: any;
          createdate: any;
          status: any;
        }) {
          return obj;
        });
        this.page = data;
        this.count = this.page.totalElements;
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: error.error.message,
        });
      }
    );
  }

  makeid(length: any) {
    var result = '';
    var characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  resetForm() {
    window.location.reload();
  }

  /**
   * Hàm lấy các tham số truyền vào
   * @param category loại sản phẩm
   * @param location mảng địa chỉ sản phẩm
   * @param brand mảng nhãn hàng
   * @param page trang số ?
   * @returns
   */
  getRequestParams(page: number, keyword: string): any {
    let params: any = {};
    if (keyword) {
      params[`keyword`] = keyword;
    }
    if (page) {
      params[`page`] = page;
    }
    return params;
  }

  /**
   * Hàm đưa dữ liệu lên param url
   */
  routeParams() {
    this.router
      .navigate([], {
        relativeTo: this.route,
        queryParams: this.getRequestParams(this.p, this.keyword),
        queryParamsHandling: 'merge', // remove to replace all query params by provided
      })
      .then(() => {
        this.listPayment();
      });
  }
  /**
   * Hàm chuyển trang
   * @param event số trang cần đến
   */
  public handlePageChange(event: number) {
    this.p = event;
    this.routeParams();
  }

  search(value: any) {
    this.keyword = value;
    this.routeParams();
  }
}
