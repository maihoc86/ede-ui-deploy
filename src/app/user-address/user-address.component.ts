import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { AddressUserService } from '../Services/address-user/address-user.service';
import { ApiAddressService } from '../Services/api-address/api-address.service';
import { HeaderService } from '../Services/header/header.service';
import { UserAddress } from '../models/user-address.model';
import Swal from 'sweetalert2';
import { C } from '@angular/cdk/keycodes';
@Component({
  selector: 'app-user-address',
  templateUrl: './user-address.component.html',
  styleUrls: ['./user-address.component.css'],
})
export class UserAddressComponent implements OnInit {
  constructor(
    private headerService: HeaderService,
    private address_user: AddressUserService,
    private cookieService: CookieService,
    private apiAddressService: ApiAddressService
  ) {}

  ngOnInit(): void {
    this.getUserLogin();
    this.getAllAddressUser();
    this.getApiCity();
  }
  public address = new FormGroup({
    id: new FormControl(''),
    first_name: new FormControl('', [
      Validators.required,
      Validators.pattern(
        "^\\S([a-zA-Z\\xC0-\\uFFFF]{0,25}[ \\-\\']{0,}){1,25}$"
      ),
    ]),
    last_name: new FormControl('', [
      Validators.required,
      Validators.pattern(
        "^\\S([a-zA-Z\\xC0-\\uFFFF]{0,25}[ \\-\\']{0,}){1,25}$"
      ),
    ]),
    user: new FormControl(''),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern('(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\\b'),
    ]),
    city: new FormControl(null, Validators.required),
    district: new FormControl(null, Validators.required),
    wards: new FormControl(null, Validators.required),
    address: new FormControl(null, [
      Validators.required,
      Validators.pattern(
        "^\\S([a-zA-Z0-9\\xC0-\\uFFFF\\.]{1,}[ \\-\\' \\.-/,]{0,}){5,}$"
      ),
    ]),
    main_address: new FormControl(false),
  });
  public loading: boolean = true;
  public listAddressUser: any = {};
  public listCitys: any = [];
  public listDistricts: any = [];
  public listWards: any = [];
  isHiddenAddress: boolean = true;
  isHiddenWards: boolean = true;
  isHiddenDistrict: boolean = true;

  public clearAddresModal() {
    this.address.reset();
  }

  /**
   * H??m l???y ra user ??ang ????ng nh???p
   */
  public getUserLogin() {
    this.headerService
      .getUserByToken(this.cookieService.get('auth'))
      .toPromise()
      .then((data) => {
        this.address.controls['user'].setValue(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  /**
   * H??m t???o c???u tr??c d??? li???u theo b???ng AddressUser ????? g???i l??n server
   */
  private createDataAddress() {
    const newAddress: any = {};
    for (const controlName in this.address.controls) {
      if (controlName) {
        newAddress[controlName] = this.address.controls[controlName].value;
      }
    }
    return newAddress as UserAddress;
  }

  /**
   * H??m l???y ra t???t c??? ?????a ch??? c???a User
   */
  public getAllAddressUser() {
    this.loading = true;
    this.address_user.getAllAdressByUser().subscribe(
      (data) => {
        this.listAddressUser = data;
        this.loading = false;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  /**
   * H??m l???y ra t???t c??? c??c th??nh ph???
   * @returns {obj} danh s??ch th??nh ph???
   */
  public getApiCity() {
    this.loading = true;
    this.apiAddressService.getApiCity().subscribe((data) => {
      const listCity = data.map(function (obj: {
        id: any;
        code: any;
        name: any;
      }) {
        return obj;
      });
      this.loading = false;
      this.listCitys = listCity;
    });
  }

  /**
   * H??m l???y ra t???t c??? c??c qu???n theo id c???a th??nh ph???
   * @param {string} id id c???a th??nh ph???
   * @returns {obj} danh s??ch qu???n
   */
  public getApiDistricts(id: any) {
    this.loading = true;
    this.apiAddressService.getApiDistricts(id).subscribe((data) => {
      const listDistrict = data.map(function (obj: { id: any; name: any }) {
        return obj;
      });
      this.loading = false;
      this.listDistricts = listDistrict;
    });
  }

  /**
   * H??m l???y ra t???t c??? c??c ph?????ng theo id c???a qu???n
   * @param {string} id id c???a qu???n
   * @returns {obj} danh s??ch ph?????ng
   */
  public getApiWards(id: any) {
    this.loading = true;
    this.apiAddressService.getApiWards(id).subscribe((data) => {
      const listWard = data.map(function (obj: { id: any; name: any }) {
        return obj;
      });
      this.loading = false;
      this.listWards = listWard;
    });
  }

  /**
   * H??m ch???n ?????a ch??? Th??nh ph??? / t???nh
   */
  chooseCity() {
    this.isHiddenDistrict = false;
    this.isHiddenWards = true;
    this.isHiddenAddress = true;
    this.getApiDistricts(this.address.controls['city'].value.id);
  }

  /**
   * H??m ch???n ?????a ch??? Qu???n / huy???n
   */
  chooseDistrict() {
    this.isHiddenWards = false;
    this.getApiWards(this.address.controls['district'].value.id);
  }

  /**
   * H??m ch???n ?????a ch??? Ph?????ng / x??
   */
  chooseWards() {
    this.isHiddenAddress = false;
  }

  /**
   * H??m c???p nh???t ho???c th??m m???i ?????a ch???
   */
  public async updateAddressUser() {
    this.address.controls['address'].setValue(
      this.address.controls['address'].value +
        ',' +
        this.address.controls['wards'].value.name +
        ',' +
        this.address.controls['district'].value.name +
        ',' +
        this.address.controls['city'].value.name
    );
    await this.headerService
      .getUserByToken(this.cookieService.get('auth'))
      .toPromise()
      .then((data) => {
        this.address.controls['user'].setValue(data);
      })
      .catch((err) => {
        console.log(err);
      });

    if (this.address.controls['id'].value == '') {
      this.address_user.addAddress(this.createDataAddress()).subscribe(
        (data) => {
          this.getAllAddressUser();
          Swal.fire({
            title: 'Th??ng b??o!',
            text: 'Th??nh c??ng !',
            icon: 'success',
          }).then(() => {
            window.location.reload();
          });
        },
        (error) => {
          Swal.fire({
            title: 'Th??ng b??o!',
            text: error.error.errors[0].defaultMessage,
            icon: 'error',
          });
        }
      );
    } else {
      if (this.address.controls['main_address'].value == true) {
        this.setAddressMain(this.createDataAddress());
      } else {
        this.address_user.updateAddress(this.createDataAddress()).subscribe(
          (data) => {
            this.getAllAddressUser();
            Swal.fire({
              title: 'Th??ng b??o!',
              text: 'Th??nh c??ng !',
              icon: 'success',
            }).then(() => {
              window.location.reload();
            });
          },
          (error) => {
            Swal.fire({
              title: 'Th??ng b??o!',
              text: error.error.errors[0].defaultMessage,
              icon: 'error',
            });
          }
        );
      }
    }
  }

  /**
   * H??m hi???n th??? ?????a ch??? l??n Modal
   * @params user ?????a ch??? g???c (ch??nh)
   * @params address ?????a ch??? ph???
   */
  public showAddressUserModal(user: any, address_user: any) {
    if (user) {
      // this.address.controls['user'].setValue(user);
      this.address.controls['first_name'].setValue(user.first_name);
      this.address.controls['last_name'].setValue(user.last_name);
      this.address.controls['phone'].setValue(user.phone);
      this.changeSelectionAddress(user.address);
    } else if (address_user) {
      this.address.controls['id'].setValue(address_user.id);
      this.address.controls['user'].setValue(address_user.user);
      this.address.controls['first_name'].setValue(address_user.first_name);
      this.address.controls['last_name'].setValue(address_user.last_name);
      this.address.controls['phone'].setValue(address_user.phone);
      this.changeSelectionAddress(address_user.address);
    }
  }

  /**
   * H??m x??a ?????a ch??? ph???
   * @params id ?????a ch??? c???n x??a
   */
  public deleteAddress(id: any) {
    this.address_user.deleteAddress(id).subscribe(
      (data) => {
        this.getAllAddressUser();
      },
      (error) => {
        Swal.fire({
          title: 'Th??ng b??o!',
          text: error.error.errors[0].defaultMessage,
          icon: 'error',
        });
      }
    );
  }

  /**
   * H??m load l??n ?????a t??? c???t t??? address th??nh city , district , wards
   */
  public changeSelectionAddress(address: any) {
    let idCity = '';
    let idDistrict = '';
    let idWard = '';
    let address_split = address.split(',');

    this.address.controls['address'].setValue(address_split[0]);

    // L???y ra id c???a th??nh ph??? khi user c?? ?????a ch??? th??nh ph??? tr??ng
    setTimeout(() => {
      for (let i = 0; i < this.listCitys.length; i++) {
        if (this.listCitys[i].name.includes(address_split[3].trim())) {
          idCity = this.listCitys[i];
          this.address.controls['city'].setValue(idCity);
          this.getApiDistricts(this.address.controls['city'].value.id);
          this.isHiddenDistrict = false;
        }
      }
    }, 1000);

    setTimeout(() => {
      // L???y ra id c???a qu???n khi user c?? ?????a ch??? qu???n tr??ng
      for (let i = 0; i < this.listDistricts.length; i++) {
        if (this.listDistricts[i].name.includes(address_split[2].trim())) {
          idDistrict = this.listDistricts[i];
          this.address.controls['district'].setValue(idDistrict);
          this.getApiWards(this.address.controls['district'].value.id);
          this.isHiddenWards = false;
        }
      }
    }, 2500);
    setTimeout(() => {
      // L???y ra id c???a ph?????ng khi user c?? ?????a ch??? ph?????ng tr??ng
      for (let i = 0; i < this.listWards.length; i++) {
        if (this.listWards[i].name.includes(address_split[1].trim())) {
          idWard = this.listWards[i];
          this.address.controls['wards'].setValue(idWard);
          this.isHiddenAddress = false;
        }
      }
    }, 4500);
  }

  /**
   * H??m ch???nh s???a ?????a ch??? ph??? th??nh ?????a ch??? ch??nh
   */
  public setAddressMain(address: any) {
    this.address_user.updateAddressMain(address).subscribe(
      (data) => {
        this.getAllAddressUser();
        Swal.fire({
          title: 'Th??ng b??o!',
          text: 'Th??nh c??ng !',
          icon: 'success',
        }).then(() => {
          window.location.reload();
        });
      },
      (error) => {
        Swal.fire({
          title: 'Th??ng b??o!',
          text: error.error.errors[0].defaultMessage,
          icon: 'error',
        });
      }
    );
  }
}
