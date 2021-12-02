import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnChanges, SimpleChanges, Input } from '@angular/core';
import { UserOrderService } from '../Services/user-order/user-order.service';
import Swal from 'sweetalert2';
import { ShipService } from '../Services/ship/ship.service';
import { FormControl, FormGroup } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { HeaderService } from '../Services/header/header.service';
import { AddressUserService } from '../Services/address-user/address-user.service';
import { PaymentSystemService } from '../Services/payment-system/payment-system.service';
import CryptoJS from 'crypto-js';
(window as any).global = window;
declare const Buffer: { byteLength: (arg0: string) => any };
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnChanges {
  @Input()

  // Payment
  public listPaymentSystem: any = [];
  public listDetailPaymentSystem: any = [];
  public showDetailPayment: any = 'Tiền mặt';

  // End Paymen
  public productList: any = [];
  public totalPriceBeforeDiscount: number = 0;
  public totalprice: number = 0;
  public discountPrice: number = 0;

  public listDiscountOrder: any = [];
  public discountOrder: any = null; // Mã giảm giá sau khi chọn

  public loadingFeeShip: boolean = true;
  public loadingAddress: boolean = true;
  public listCitys: any = [];
  public listDistricts: any = [];
  public listWards: any = [];
  public listShippingCompany: any = [];
  public listMethodShip: any = [];
  public listAddressUser: any = [];
  public feeShip: number = 0; // phí ship sau khi tính toán

  isHiddenCity: boolean = true;
  isHiddenAddress: boolean = true;
  isHiddenWards: boolean = true;
  isHiddenDistrict: boolean = true;

  public user: any = {};

  constructor(
    private userOrderService: UserOrderService,
    private address_ship: ShipService,
    private cookieService: CookieService,
    private headerService: HeaderService,
    private address_user: AddressUserService,
    private paymentSystemService: PaymentSystemService
  ) {
    this.productList = JSON.parse('' + localStorage.getItem('cart')) || [];
    this.totalprice = this.totalPriceBeforeDiscount = this.productList.reduce(
      (last: number, item: any) =>
        last + item?.product_option?.price * item?.quantity,
      0
    );
  }
  ngOnInit(): void {
    this.getAllPaymentSystem();
    this.getShippingCompany();
    this.getApiCity();
    this.getAddressMainUser();
  }
  ngOnChanges(_changes: SimpleChanges): void {
    this.totalprice = this.totalPriceBeforeDiscount = this.productList.reduce(
      (last: number, item: any) =>
        last + item?.product_option?.price * item?.quantity,
      0
    );
  }

  /**
   * Hàm lấy ra tất cả phương thức thanh toán có trong hệ thống
   */
  getAllPaymentSystem() {
    this.paymentSystemService.getAllPaymentSystem().subscribe(
      (data: any) => {
        this.listPaymentSystem = data;
      },
      (error: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: error.error.message,
        });
      }
    );
  }

  showDetailMethodPayment(name: string) {
    this.showDetailPayment = name;
    this.getDetailPaymentByName(name);
  }

  getDetailPaymentByName(name: String) {
    this.listPaymentSystem
      .filter((x: any) => x.name == name)
      .map((x: any) => {
        this.listDetailPaymentSystem = JSON.parse(
          x.detail.replace(/ 0+(?![\. }])/g, ' ')
        );
        if (x.name == 'Momo') {
          this.getQrCodeMomo();
        }
      });
  }

  public ship = new FormGroup({
    company: new FormControl('GHN'), // Đối tác vận chuyển default Giao hàng nhanh
    city: new FormControl(''), // city default Hòa Bình
    from_district: new FormControl(''), // district của shop
    district: new FormControl(''), // to_district Huyện Yên Thủy
    wards: new FormControl(''), // wards default Xã Yên Trị
    method: new FormControl(''), // phương thức vận chuyện [đi bộ, máy bay ...] default là bay
    address: new FormControl(''), // địa chỉ nhận hàng
  });

  /**
   * Hàm thay đổi số lượng
   * @param qtyCurrent số lượng hiện tại
   * @param qtyChange số lượng muốn thay đổi
   */
  changeQty(qtyCurrent: any, qtyChange: any) {
    if (qtyChange == 0) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Số lượng không được bằng 0',
      });
      qtyCurrent.quantity = 1;
      return;
    } else {
      qtyCurrent.quantity = qtyChange;
      qtyChange > qtyCurrent.quantity
        ? qtyCurrent.quantity++
        : qtyCurrent.quantity == qtyChange
        ? (qtyCurrent.quantity = qtyChange)
        : qtyCurrent.quantity--;
      qtyCurrent.quantity == 0 ? (this.productList = '') : '';
      this.changeFeeShipOrder(
        qtyCurrent,
        this.productList.findIndex((x: any) => x === qtyCurrent)
      );
    }
  }

  /**
   * Hàm thay đổi phí ship khi thay đổi số lượng sản phẩm trong order
   * @param item sản phẩm trong order
   * @param index vị trí của sản phẩm trong order
   */
  changeFeeShipOrder(item: any, index: number) {
    var address_product_order =
      item.product_option.product.shop.address.split(','); // lấy ra địa chỉ của shop
    let idCity = '';

    // Lấy ra id của thành phố khi shop có địa chỉ thành phố trùng
    for (let i = 0; i < this.listCitys.length; i++) {
      if (this.listCitys[i].name.includes(address_product_order[3].trim())) {
        idCity = this.listCitys[i].id;
      }
    }

    // Lấy ra danh sách quận huyện theo id của thành phố
    this.address_ship
      .getApiDistricts_byCity(this.ship.controls['company'].value, idCity)
      .subscribe(
        (data) => {
          const listDistrict = data.map(function (obj: { id: any; name: any }) {
            return obj;
          });

          // Lấy ra id của quận huyện khi shop có địa chỉ quận huyện trùng
          for (let i = 0; i < listDistrict.length; i++) {
            if (
              listDistrict[i].name.includes(address_product_order[2].trim())
            ) {
              this.ship.controls['from_district'].setValue(listDistrict[i].id);
              // Bắt đầu tính phương tiện vận chuyển từ quận huyện shop tới địa chỉ đã chọn
              this.address_ship
                .getApiMethodShip(
                  this.ship.controls['company'].value,
                  this.ship.controls['from_district'].value,
                  this.ship.controls['district'].value
                )
                .subscribe(
                  (data) => {
                    const listMethodShip = data.map(function (obj: {
                      id: any;
                      name: any;
                    }) {
                      return obj;
                    });
                    this.listMethodShip = listMethodShip;
                    this.ship.controls['method'].setValue(
                      this.listMethodShip[0].id // TODO xem phí nào rẻ nhất lấy phương thức đó
                    );
                    console.log(item.product_option.weight);
                    let total_weight =
                      item.product_option.weight * item.quantity;
                    this.address_ship
                      .getFeeShip(
                        this.ship.controls['company'].value,
                        this.ship.controls['from_district'].value,
                        this.ship.controls['district'].value,
                        this.ship.controls['method'].value,
                        total_weight
                      )
                      .subscribe(
                        (data: any) => {
                          this.productList[index].feeShip = data.total;
                          // TODO thay đổi giá tạm tính: (Chưa có tính mã giảm giá) và tổng tiền sau giảm giá
                          this.loadingFeeShip = false;
                        },
                        (error) => {
                          console.log(error);
                        }
                      );
                  },
                  (error) => {
                    console.log(error);
                  }
                );
            }
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }

  /**
   * Hàm lấy ra danh sách các mã giảm giá có trong hệ thống áp dụng cho hóa đơn
   */
  getAllOrderDiscount() {
    this.userOrderService.getAllDiscountOrderSystem().subscribe(
      (data: any) => {
        this.listDiscountOrder = data;
      },
      (error: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: error.error.message,
        });
      }
    );
  }

  /**
   * Chọn mã giảm giá để áp dụng cho hóa đơn
   * @param item mã giảm giá
   */
  chooseDiscountOrder(item: any) {
    // Kiểm tra mã giảm giá
    this.userOrderService.checkOrderDiscount(item.id).subscribe(
      (data: any) => {
        if (data.length > 0) {
          // Đã từng sài mã giảm giá này
          Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: 'Mã giảm giá đã được sử dụng trước đó',
          });
        } else {
          // User này chưa sài mã giảm giá này trước đó
          if (item.status == true) {
            this.discountOrder = item;
            this.discountPrice =
              (this.totalPriceBeforeDiscount * item.discount) / 100;
            this.totalprice =
              this.totalPriceBeforeDiscount - this.discountPrice;
          } else {
            Swal.fire({
              title: 'Thông báo',
              text: 'Mã giảm giá đã hết hạn hoặc đã bị khóa',
              icon: 'warning',
              confirmButtonText: 'OK',
            });
          }
        }
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

  /**
   * Xóa mã giảm gía đã chọn
   */
  removeDiscount() {
    this.discountOrder = null;
    this.discountPrice = 0;
    this.totalprice = this.totalPriceBeforeDiscount;
  }

  /**
   * Hàm lấy ra địa chỉ chính của User
   */
  getAddressMainUser() {
    if (this.cookieService.get('auth') != '') {
      this.headerService
        .getUserByToken(this.cookieService.get('auth'))
        .subscribe(
          (data) => {
            this.user = data;
            this.changeAddressUser(this.user.address); // TODO
          },
          (err) => {
            console.log(err);
          }
        );
    } else {
      this.user = {};
    }
  }

  /**
   * Hàm lấy ra tất cả địa chỉ của User bao gồm địa chỉ phụ và chính
   */
  getAllAddressUser() {
    this.address_user.getAllAdressByUser().subscribe((data: any) => {
      const listAddressUser = data.map(function (obj: {
        id: any;
        address: any;
      }) {
        return obj;
      });
      this.listAddressUser = listAddressUser;
    });
  }

  /**
   * Hàm lấy ra danh sách công ty vận chuyển
   */
  public getShippingCompany() {
    this.loadingAddress = true;
    this.address_ship.getShippingCompany().subscribe((data) => {
      const listShippingCompany = data.map(function (obj: {
        id: any;
        name: any;
      }) {
        return obj;
      });
      this.listShippingCompany = listShippingCompany;
    });
  }

  /**
   * Hàm lấy ra tất cả các thành phố
   * @param company đơn vị vận chuyển
   * @returns {obj} danh sách thành phố
   */
  public getApiCity() {
    this.loadingAddress = true;
    this.address_ship
      .getApiCity(this.ship.controls['company'].value)
      .subscribe((data) => {
        const listCity = data.map(function (obj: {
          id: any;
          code: any;
          name: any;
        }) {
          return obj;
        });
        this.listCitys = listCity;
        this.ship.controls['city'].setValue(this.listCitys[0].id);
        this.getApiDistricts(this.listCitys[0].id);
      });
  }

  /**
   * Hàm lấy ra tất cả các quận theo id của thành phố
   * @param company đơn vị vận chuyển
   * @param {string} id id của thành phố
   * @returns {obj} danh sách quận
   */
  public getApiDistricts(idCity: any) {
    this.loadingAddress = true;
    this.address_ship
      .getApiDistricts_byCity(this.ship.controls['company'].value, idCity)
      .subscribe(
        (data) => {
          const listDistrict = data.map(function (obj: { id: any; name: any }) {
            return obj;
          });
          this.listDistricts = listDistrict;
          this.ship.controls['district'].setValue(this.listDistricts[0].id);
          this.getApiWards(this.ship.controls['district'].value);
          // this.getFeeShip(); // TODO
        },
        (err) => {
          console.log(err);
        }
      );
  }

  /**
   * Hàm lấy ra tất cả các phường theo id của quận
   * @param {string} id id của quận
   * @returns {obj} danh sách phường
   */
  public getApiWards(id: any) {
    this.loadingAddress = true;
    this.address_ship
      .getApiWardsByDisctrict(this.ship.controls['company'].value, id)
      .subscribe((data) => {
        const listWard = data.map(function (obj: { id: any; name: any }) {
          return obj;
        });
        this.listWards = listWard;
        this.ship.controls['wards'].setValue(this.listWards[0].id);
        // this.getFeeShip(); // TODO
        this.loadingAddress = false;
      });
  }

  // Chọn đơn vị vận chuyển sau đó hiển thị lên danh sách thành phố
  chooseShippingCompany() {
    if (
      this.ship.controls['city'].value != '' &&
      this.ship.controls['district'].value != '' &&
      this.ship.controls['method'].value != ''
    ) {
      // this.getFeeShip(); // TODO
    } else {
      this.getApiCity();
    }
  }

  // Chọn thành phố, sau đó hiển thị danh sách quận huyện
  chooseCity() {
    this.getApiDistricts(this.ship.controls['city'].value);
  }

  chooseDistrict() {
    this.getApiWards(this.ship.controls['district'].value);
  }

  chooseWards() {
    this.ship.controls['address'].setValue('');
    this.isHiddenAddress = !this.isHiddenAddress;
  }

  /**
   * Khi chọn địa chỉ trên Modal sẽ gọi hàm này để load lại địa chỉ của User
   */
  changeAddressUser(address: string) {
    console.log(address);
    let idCity = '';
    let idDistrict = '';
    let idWard = '';
    let address_split = (address || '').split(',');
    this.ship.controls['address'].setValue(address_split[0]);

    // Lấy ra id của thành phố khi user có địa chỉ thành phố trùng
    setTimeout(() => {
      for (let i = 0; i < this.listCitys.length; i++) {
        if (this.listCitys[i].name.includes(address_split[3]?.trim())) {
          idCity = this.listCitys[i].id;
          this.ship.controls['city'].setValue(idCity);
          this.getApiDistricts(idCity);
        }
      }
    }, 1000);

    setTimeout(() => {
      // Lấy ra id của quận khi user có địa chỉ quận trùng
      for (let i = 0; i < this.listDistricts.length; i++) {
        if (this.listDistricts[i].name.includes(address_split[2]?.trim())) {
          idDistrict = this.listDistricts[i].id;
          this.ship.controls['district'].setValue(idDistrict);
          this.getApiWards(this.ship.controls['district'].value);
        }
      }
    }, 2500);
    setTimeout(() => {
      // Lấy ra id của phường khi user có địa chỉ phường trùng
      for (let i = 0; i < this.listWards.length; i++) {
        if (this.listWards[i].name.includes(address_split[1]?.trim())) {
          idWard = this.listWards[i].id;
          this.ship.controls['wards'].setValue(idWard);
        }
      }
    }, 4500);
  }

  /**
   * Chuyển đến trang thêm địa chỉ mới
   */
  addNewAddressUser() {
    window.location.href = '/user/account/address';
  }

  /**
   * Hàm chỉ được dùng số
   * @param event sự kiện change input
   */
  numberOnly(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * Lấy về mã thanh toán Qr theo nội dung và số tiền
   */
  getQrCodeMomo() {
    //parameters
    var partnerCode = 'MOMO';
    var accessKey = 'nrb8QxS7d8mHNdIz';
    var secretkey = 'GNQAprmcFKpKWQpEM1YxPC73tfMsTiaG';
    var requestId = partnerCode + new Date().getTime();
    var orderId = requestId;
    // Nội dung
    var orderInfo = 'pay with MoMo test Thái Học';
    var redirectUrl = 'https://momo.vn/return';
    var ipnUrl = 'http://localhost:4200/notify';
    // var ipnUrl = redirectUrl = "https://webhook.site/454e7b77-f177-4ece-8236-ddf1c26ba7f8";
    var amount = '50000';
    var requestType = 'captureWallet';
    var extraData = ''; //pass empty value if your merchant does not have stores

    var rawSignature =
      'accessKey=' +
      accessKey +
      '&amount=' +
      amount +
      '&extraData=' +
      extraData +
      '&ipnUrl=' +
      ipnUrl +
      '&orderId=' +
      orderId +
      '&orderInfo=' +
      orderInfo +
      '&partnerCode=' +
      partnerCode +
      '&redirectUrl=' +
      redirectUrl +
      '&requestId=' +
      requestId +
      '&requestType=' +
      requestType;
    var rawSignature =
      'accessKey=' +
      accessKey +
      '&amount=' +
      amount +
      '&extraData=' +
      extraData +
      '&ipnUrl=' +
      ipnUrl +
      '&orderId=' +
      orderId +
      '&orderInfo=' +
      orderInfo +
      '&partnerCode=' +
      partnerCode +
      '&redirectUrl=' +
      redirectUrl +
      '&requestId=' +
      requestId +
      '&requestType=' +
      requestType;
    //puts raw signature
    console.log('--------------------RAW SIGNATURE----------------');
    console.log(rawSignature);
    var signature = CryptoJS.HmacSHA256(rawSignature, secretkey);
    console.log('--------------------SIGNATURE----------------');
    console.log(signature);
    //json object send to MoMo endpoint
    const requestBody = JSON.stringify({
      partnerCode: partnerCode,
      accessKey: accessKey,
      requestId: requestId,
      amount: amount,
      orderId: orderId,
      orderInfo: orderInfo,
      redirectUrl: redirectUrl,
      ipnUrl: ipnUrl,
      extraData: extraData,
      requestType: requestType,
      signature: signature,
      lang: 'vi',
    });
    const options = {
      hostname: 'test-payment.momo.vn',
      port: 443,
      path: '/v2/gateway/api/create',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestBody),
      },
    };
    console.log("Thai học -------------------------");
    this.paymentSystemService.getQrCodeMomo(options.headers).subscribe(
      (res: any) => {
        console.log(`Status: ${res.statusCode}`);
        console.log(`Headers: ${JSON.stringify(res.headers)}`);
        res.setEncoding('utf8');
        res.on('data', (body: any) => {
          console.log('Body: ');
          console.log(body);
          console.log('payUrl: ');
          console.log(JSON.parse(body).payUrl);
        });
        res.on('end', () => {
          console.log('No more data in response.');
        });
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
