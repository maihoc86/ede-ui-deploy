import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { HeaderService } from '../Services/header/header.service';
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../models/user.model';
import { Shop } from '../models/shop.model';
import { MyShopService } from '../Services/my-shop/my-shop.service';
import { ApiAddressService } from '../Services/api-address/api-address.service';
import { ImagesService } from '../Services/images/images.service';

@Component({
  selector: 'app-shop-profile',
  templateUrl: './shop-profile.component.html',
  styleUrls: ['./shop-profile.component.css'],
})
export class ShopProfileComponent implements OnInit {
  @ViewChild('InputImage', { static: false })
  InputImage!: ElementRef;

  constructor(
    private headerService: HeaderService,
    private cookieService: CookieService,
    private router: Router,
    private shopService: MyShopService,
    private apiAddressService: ApiAddressService,
    private imageService: ImagesService
  ) {
    this.shop = {} as Shop;
  }

  ngOnInit(): void {
    this.getApiCity();
    this.loadProfileShopByUserLogin();
  }

  isHiddenAddress: boolean = true;
  isHiddenWards: boolean = true;
  isHiddenDistrict: boolean = true;
  urlImageLoad_Sub = '';
  urlImageLoad = '';
  imageArray_Sub!: File;
  imageArray!: File;

  public shop: Shop;
  public listCitys: any = [];
  public listDistricts: any = [];
  public listWards: any = [];

  onselectFile_Sub(e: any) {
    if (e.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      this.imageArray_Sub = e.target.files[0];
      reader.onload = (e: any) => {
        this.urlImageLoad_Sub = e.target.result;
      };
    }
  }

  onselectFile(e: any) {
    if (e.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      this.imageArray = e.target.files[0];
      reader.onload = (e: any) => {
        this.urlImageLoad = e.target.result;
      };
    }
  }

  showSelectionAddress() {
    this.formShop.controls['address'].setValue('');
    this.isHiddenAddress = !this.isHiddenAddress;
  }

  getDistricts() {
    this.isHiddenDistrict = false;
    this.getApiDistricts(this.formShop.controls['city'].value.id);
  }
  getWards() {
    this.isHiddenWards = false;
    this.getApiWards(this.formShop.controls['district'].value.id);
  }

  public formShop = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', [
      Validators.required,
      Validators.pattern(
        "^\\S([a-zA-Z0-9\\xC0-\\uFFFF]{0,25}[ \\-\\']{0,}){3,150}$"
      ),
    ]),

    image_sub: new FormControl(''),
    image: new FormControl(''),
    city: new FormControl(''),
    district: new FormControl(''),
    wards: new FormControl(''),
    address: new FormControl('', [
      Validators.required,
      Validators.pattern(
        "^\\S([a-zA-Z0-9\\xC0-\\uFFFF\\.]{1,}[ \\-\\' \\.-/,]{0,}){5,200}$"
      ),
    ]),
    description: new FormControl(''),
    user: new FormControl(''),
    create_date: new FormControl(''),
    status: new FormControl(true)
  });

  private createNewDataSop() {
    const newShop: any = {};
    for (const controlName in this.formShop.controls) {
      if (controlName) {
        newShop[controlName] = this.formShop.controls[controlName].value;
      }
    }
    return newShop as Shop;
  }

  /**
   * Hàm dùng để cập nhật thông tin shop
   * @returns thông tin sau khi cập nhật
   */
  async updateInfoShop() {
    this.headerService
      .getShopByToken(this.cookieService.get('auth'))
      .subscribe(async (data) => {
        this.shop = data;
        if (
          this.formShop.controls['wards'].value.name !== undefined &&
          this.formShop.controls['district'].value.name !== null &&
          this.formShop.controls['city'].value.name !== null
        ) {
          var newAddress =
            this.formShop.controls['address'].value +
            ', ' +
            this.formShop.controls['wards'].value.name +
            ', ' +
            this.formShop.controls['district'].value.name +
            ', ' +
            this.formShop.controls['city'].value.name;
          this.formShop.controls['address'].setValue(newAddress);
        }
        this.formShop.controls['user'].setValue(data.user);
        await this.addImage();
        this.shopService
          .updateInfoShop(this.createNewDataSop())
          .subscribe((data) => {
            Swal.fire({
              icon: 'success',
              title: 'Thành công',
              text: 'Cập nhật thành công',
            }).then(() => {
              window.location.reload();
            });
          });
      });
  }
  public loadProfileShopByUserLogin() {
    this.headerService.getShopByToken(this.cookieService.get('auth')).subscribe(
      (data) => {
        this.shop = data;
        for (const controlName in this.formShop.controls) {
          for (const node in data) {
            if (controlName && controlName == node) {
              this.formShop.controls[controlName].setValue(data[node]);
            }
          }
        }
      },
      (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: 'Lỗi đăng nhập',
        });
        this.router.navigate(['/login']);
      }
    );
  }

  /**
   * Hàm lấy ra tất cả các thành phố
   * @returns {obj} danh sách thành phố
   */
  public getApiCity() {
    this.apiAddressService.getApiCity().subscribe((data) => {
      const listCity = data.map(function (obj: {
        id: any;
        code: any;
        name: any;
      }) {
        return obj;
      });
      this.listCitys = listCity;
    });
  }

  /**
   * Hàm lấy ra tất cả các quận theo id của thành phố
   * @param {string} id id của thành phố
   * @returns {obj} danh sách quận
   */
  public getApiDistricts(id: any) {
    this.apiAddressService.getApiDistricts(id).subscribe((data) => {
      const listDistrict = data.map(function (obj: { id: any; name: any }) {
        return obj;
      });
      this.listDistricts = listDistrict;
    });
  }

  /**
   * Hàm lấy ra tất cả các phường theo id của quận
   * @param {string} id id của quận
   * @returns {obj} danh sách phường
   */
  public getApiWards(id: any) {
    this.apiAddressService.getApiWards(id).subscribe((data) => {
      const listWard = data.map(function (obj: { id: any; name: any }) {
        return obj;
      });
      this.listWards = listWard;
    });
  }

  public async addImage() {
    //!Important Optimize code
    if (
      (this.imageArray_Sub != undefined || this.imageArray_Sub != null) &&
      (this.imageArray == undefined || this.imageArray == null)
    ) {
      const formData = new FormData();
      formData.append('file', this.imageArray_Sub);
      await this.imageService
        .createImage_Sub_Shop(formData)
        .toPromise()
        .then((valueFile) => {
          this.formShop.controls['image_sub'].setValue(
            valueFile.text.toString()
          );
        }),
        (error: any) => {
          alert('Lỗi thêm Image FTP');
        };
    } else if (
      (this.imageArray != undefined || this.imageArray != null) &&
      (this.imageArray_Sub == undefined || this.imageArray_Sub == null)
    ) {
      const formData = new FormData();
      formData.append('file', this.imageArray);
      await this.imageService
        .createImage_Sub_Shop(formData)
        .toPromise()
        .then((valueFile) => {
          this.formShop.controls['image'].setValue(valueFile.text.toString());
        }),
        (error: any) => {
          alert('Lỗi thêm Image FTP');
        };
    } else if (
      (this.imageArray != undefined || this.imageArray != null) &&
      (this.imageArray_Sub != undefined || this.imageArray_Sub != null)
    ) {
      const formData = new FormData();
      formData.append('file', this.imageArray);

      const formData_Sub = new FormData();
      formData_Sub.append('file', this.imageArray_Sub);

      await this.imageService
        .createImage_Sub_Shop(formData)
        .toPromise()
        .then((valueFile) => {
          this.formShop.controls['image'].setValue(valueFile.text.toString());
        }),
        (error: any) => {
          alert('Lỗi thêm Image FTP');
        };

      await this.imageService
        .createImage_Sub_Shop(formData_Sub)
        .toPromise()
        .then((valueFile) => {
          this.formShop.controls['image_sub'].setValue(
            valueFile.text.toString()
          );
        }),
        (error: any) => {
          alert('Lỗi thêm Image FTP');
        };
    }
  }
  public toInterfaceShop(){
    this.router.navigate(['/shop/interface/'+this.shop.id]);
  }
}
