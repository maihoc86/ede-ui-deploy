import { CookieService } from 'ngx-cookie-service';
import { HeaderService } from './../Services/header/header.service';
import { OrderShopService } from './../Services/order-shop/order-shop.service';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserOrderService } from '../Services/user-order/user-order.service';
import { ImagesService } from '../Services/images/images.service';
@Component({
  selector: 'app-user-oder',
  templateUrl: './user-oder.component.html',
  styleUrls: ['./user-oder.component.css'],
})
export class UserOderComponent implements OnInit {
  constructor(
    private userOrderService: UserOrderService,
    private headerService: HeaderService,
    private imageService: ImagesService,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    this.getAllOrderUser();
  }

  public login: boolean = false;
  public userAcc: any;
  public listIdShopinOrder: any = [];
  public listOrder: Array<any> = [];
  public listOrderFilter: Array<any> = [];
  public listIdShop: any = [];
  imageArray: File[] = [];
  public evaluate_image = new FormGroup({
    id: new FormControl(''),
    evaluate_order: new FormControl(''),
    image_url: new FormControl(''),
  });
  public rating = new FormGroup({
    rate: new FormControl(1, Validators.required),
    content: new FormControl(''),
    date: new FormControl(new Date()),
    order: new FormControl(''),
  });
  public getAllOrderUser() {
    this.headerService
      .getUserByToken(this.cookieService.get('auth'))
      .toPromise()
      .then((data: any) => {
        this.userOrderService.getAllOrderUser(data.id).subscribe((data) => {
          this.listOrder = data;
        });
      })
      .catch((err) => {
        console.log(err);
        this.login = false;
      });
  }

  filterOrder(value: any) {
    this.getAllOrderUser();
    this.listOrderFilter = this.listOrder = this.listOrder.filter((e) => {
      return e.status === value;
    });
  }

  cancelOrder(order: any) {
    Swal.fire({
      title: 'Xác nhận hủy đơn',
      text: 'Bạn có chắc chắn muốn hủy đơn này',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy',
    }).then((result) => {
      if (result.value) {
        this.userOrderService.cancelOrder(order).subscribe(
          (data) => {
            Swal.fire({
              title: 'Thông báo',
              text: 'Hủy đơn hàng thành công',
              icon: 'success',
            }).then(() => {
              window.location.reload();
            });
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
    });
  }

  /**
   * Hiển thị modal đánh giá và load order vào controls đánh giá
   */
  showViewDanhGia(item: any) {
    this.rating.controls['order'].setValue(item);
  }

  /**
   * Đánh giá order
   */
  submitDanhGia() {
    this.userOrderService.submitDanhGia(this.rating.value).subscribe(
      (data) => {
        Swal.fire({
          title: 'Thông báo',
          text: 'Đánh giá thành công',
          icon: 'success',
        }).then(() => {
          window.location.reload();
        });
        const formData = new FormData();
        for (var i = 0; i < this.imageArray.length; i++) {
          formData.append('files', this.imageArray[i]);
        }
        if (this.imageArray.length > 0) {
          this.imageService
            .createMultiImageEvaluate(formData)
            .toPromise()
            .then((valueFile) => {
              this.evaluate_image.patchValue({
                image_url: valueFile.toString(),
              });
              this.evaluate_image.controls['evaluate_order'].setValue(data);
              this.userOrderService
                .addEvaluateImage(this.evaluate_image.value)
                .toPromise()
                .then(
                  (data) => {},
                  (error) => {
                    Swal.fire({
                      icon: 'error',
                      title: 'Lỗi',
                      text: error.error.message,
                    });
                  }
                );
            }),
            (error: any) => {
              alert('Lỗi thêm Image FTP');
            };
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
   * Truyền file vào
   * @param event
   */
  onFileChange(event: any) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[i]);
        this.imageArray.push(event.target.files[i]);
      }
    }
  }
}
