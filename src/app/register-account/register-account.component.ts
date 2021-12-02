import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../models/user.model';
import { RegisterService } from '../Services/register/register-service';
import { ApiAddressService } from '../Services/api-address/api-address.service';
import { Genders } from '../models/genders.model';

@Component({
  selector: 'app-register-account',
  templateUrl: './register-account.component.html',
  styleUrls: ['./register-account.component.css'],
})
export class RegisterAccountComponent implements OnInit {
  public register = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-z0-9_-]{6,50}$'),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,50}$'),
    ]),
    first_name: new FormControl('', [
      Validators.required,
      Validators.pattern(
        "^\\S([a-zA-Z\\xC0-\\uFFFF]{0,25}[ \\-\\']{0,}){1,25}$"
      ),
    ]),
    address: new FormControl('', [
      Validators.required,
      Validators.pattern(
        "^\\S([a-zA-Z0-9\\xC0-\\uFFFF\\.]{1,}[ \\-\\' \\.-/,]{0,}){5,}$"
      ),
    ]),
    last_name: new FormControl('', [
      Validators.required,
      Validators.pattern(
        "^\\S([a-zA-Z\\xC0-\\uFFFF]{0,25}[ \\-\\']{0,}){1,25}$"
      ),
    ]),
    gender: new FormControl('', Validators.required),
    photo: new FormControl(null),
    email: new FormControl('', [Validators.required, Validators.email]),
    is_delete: new FormControl(false),
    is_active: new FormControl(false),
    otp: new FormControl(null),
    city: new FormControl('', Validators.required),
    district: new FormControl('', Validators.required),
    wards: new FormControl('', Validators.required),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern('(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\\b'),
    ]),
    confirmPassword: new FormControl('', Validators.required),
  });
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private registerService: RegisterService,
    private apiAddressService: ApiAddressService
  ) {}
  get f(): { [key: string]: AbstractControl } {
    return this.register.controls;
  }
  public listCitys: any = [];
  public listDistricts: any = [];
  public listWards: any = [];

  /**
   * Hàm dùng để so sánh mật khẩu
   * @returns thành công nếu khớp và lỗi khi không khớp
   */
  onPasswordChange() {
    if (this.confirm_password.value == this.password.value) {
      this.confirm_password.setErrors(null);
    } else {
      this.confirm_password.setErrors({ mismatch: true });
    }
  }
  // get city
  getDistricts() {
    this.getApiDistricts(this.register.controls['city'].value.id);
  }
  // get wards
  getWards() {
    this.getApiWards(this.register.controls['district'].value.id);
  }
  //get password
  get password(): AbstractControl {
    return this.register.controls['password'];
  }
  //get confirm password
  get confirm_password(): AbstractControl {
    return this.register.controls['confirmPassword'];
  }
  ngOnInit(): void {
    this.getApiCity();
    this.listCitys;
    this.genders;
  }
  private createNewData() {
    const newUser: any = {};
    for (const controlName in this.register.controls) {
      if (controlName) {
        newUser[controlName] = this.register.controls[controlName].value;
      }
    }
    return newUser as User;
  }
  /**
   * Hàm dùng để đăng ký tài khoản
   * @returns Thêm thông tin người dùng vào DB
   */
  public registerUser() {
    const oldAddress = this.register.controls['address'].value;

    // Tạo một địa chỉ mới = 'Địa chỉ cụ thể' + 'Phường' + 'Quận' + 'Thành phố'
    const newAddress =
      this.register.controls['address'].value +
      ', ' +
      this.register.controls['wards'].value.name +
      ', ' +
      this.register.controls['district'].value.name +
      ', ' +
      this.register.controls['city'].value.name;
    this.register.controls['address'].setValue(newAddress);
    this.registerService.registerAccount(this.createNewData()).subscribe(
      (data) => {
        this.registerService.sendEmail(data.email);
        Swal.fire({
          icon: 'success',
          title: 'Đăng ký thành công!',
          text: 'Một liên kết đã gửi tới email của bạn, vui lòng xác nhận nó để kích hoạt tài khoản',
          confirmButtonText: `OK`,
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigate(['login']);
          } else {
            this.router.navigate(['login']);
          }
        });
      },
      (err) => {
        this.register.controls['address'].setValue(oldAddress);
        Swal.fire({
          icon: 'error',
          title: err.error.errors[0].defaultMessage,
          text: err.error.message,
        });
      }
    );
  }

  /**
   * Hàm dùng để lấy danh sách thành phố
   * @returns Danh sách thành phố
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
   * Hàm dùng để lấy danh sách quận
   * @returns Danh sách quận
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
   * Hàm dùng để lấy danh sách phường
   * @returns Danh sách phường
   */
  public getApiWards(id: any) {
    this.apiAddressService.getApiWards(id).subscribe((data) => {
      const listWard = data.map(function (obj: { id: any; name: any }) {
        return obj;
      });
      this.listWards = listWard;
    });
  }
  genders = [
    new Genders('N', 'M'),
    new Genders('NU', 'W'),
    new Genders('K', 'D'),
  ];
}
