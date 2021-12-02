import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiAddressService } from '../Services/api-address/api-address.service';
import { AddProductService } from '../Services/product-shop/add-product.service';
import { HeaderService } from '../Services/header/header.service';
import Swal from 'sweetalert2';
import { FormControl, FormGroup } from '@angular/forms';
import { MyShopService } from '../Services/my-shop/my-shop.service';
@Component({
  selector: 'app-show-all-products-shop-interface',
  templateUrl: './show-all-products-shop-interface.component.html',
  styleUrls: ['./show-all-products-shop-interface.component.css'],
})
export class ShowAllProductsShopInterfaceComponent implements OnInit {
  constructor(
    private AddressService: ApiAddressService,
    private router: Router,
    private ProductService: AddProductService,
    private route: ActivatedRoute,
    private headerService: HeaderService,
    private shopService: MyShopService
  ) {}
  public totalCart: any = 0;
  public cart: Array<any> = [];

  public listCities: any = [];
  public listBrands: any = [];
  public listCategories: any = [];
  public listAllProducts: any = [];
  public listAllProductsDiscount: any = [];

  public location: any = [];
  public brand: any = [];
  public category: any;
  public page: any = [];
  public p: number = 1;
  public count: number = 0;

  public sortBy: any;
  public hiddenLocation: boolean = true;
  public hiddenShowLocationMore: boolean = true;
  public loadingProductTable = true;
  public idShop: any;
  ngOnInit(): void {
    this.getCities();
    this.listProduct();
    this.getBrands(this.idShop);
    this.showShopInfo(this.idShop);
    this.getChildCategory(this.idShop);
  }

  public toBot() {
    document.getElementById('table')?.scrollIntoView({ behavior: 'smooth' });
  }

  /**
   * Hàm chưa biến hiển thị thông tin cửa hàng
   */
  public shopForm = new FormGroup({
    id: new FormControl(''),
    name: new FormControl(''),
    user: new FormControl(''),
    image: new FormControl(''),
    image_sub: new FormControl(''),
    create_date: new FormControl(''),
    description: new FormControl(''),
    address: new FormControl(''),
  });

  /**
   * Hàm thực hiện load sản phẩm theo param trên url
   * @param page trang số
   * @param category loại sản phẩm
   * @param location địa chỉ sản phẩm []
   * @param brand nhãn hàng []
   */
  public listProduct() {
    this.toBot();
    var param = this.route.snapshot.queryParamMap;

    this.category = param.get('category') ? param.get('category') : '';
    this.location = param.get('location')
      ? param.get('location')?.split(',')
      : [];
    this.idShop = param.get('idShop') ? param.get('idShop') : '';
    this.brand = param.get('brand') ? param.get('brand')?.split(',') : [];
    this.page = param.get('page');
    this.sortBy = param.get('sortBy') ? param.get('sortBy') : '';

    if (this.page != undefined) {
      this.page = this.page - 1;
      if (
        this.idShop != undefined &&
        this.idShop != '' &&
        this.category == '' &&
        this.location == '' &&
        this.brand == ''
      ) {
        this.getAllProductDefault(this.idShop, this.page, 10);
      } else {
        this.filter(
          this.idShop,
          this.category,
          this.location,
          this.brand,
          this.page
        );
      }
    } else {
      // DEFAULT IF NO PRESENT PAGE
      this.getAllProductDefault(this.idShop, 0, 10);
    }
  }

  /**
   * Hàm lấy ra tất cả sản phẩm của shop
   * @param page trang số
   */
  public getAllProductDefault(idShop: any, page: any, size: any) {
    this.loadingProductTable = true;
    this.ProductService.getAllProductShopByCustomer(idShop, page, size,"").subscribe(
      (data) => {
        this.listAllProducts = data.content.map(function (obj: {
          idProduct: any;
          name: any;
          productDiscount: any;
        }) {
          return obj;
        });
        this.loadingProductTable = false;
        this.sortHandler();
        this.page = data;
        this.count = this.page.totalElements;
      },
      (error) => {
        this.loadingProductTable = false;
        if (error.error.message == 'Của hàng không tồn tại') {
          this.router.navigate(['/']);
        }
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: error.error.message,
        });
      }
    );
  }

  /**
   *
   * @param category loại sản phẩm
   * @param location địa chỉ sản phẩm []
   * @param brand nhãn hàng []
   * @param page trang số
   */
  public filter(
    idShop: any,
    category: any,
    location: any,
    brand: any,
    page: any
  ) {
    this.loadingProductTable = true;
    this.ProductService.getAllProductShowInterfaceFilter(
      idShop,
      category,
      location,
      brand,
      page
    ).subscribe(
      (data) => {
        console.log(data)
        this.listAllProducts = data.content.map(function (obj: {
          idProduct: any;
          name: any;
          productDiscount: any;
        }) {
          return obj;
        });
        this.loadingProductTable = false;

        this.sortHandler();
        this.page = data;
        this.count = this.page.totalElements;
      },
      (error) => {
        this.loadingProductTable = false;
        if (error.error.message == 'Của hàng không tồn tại') {
          this.router.navigate(['/']);
        }
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: error.error.message,
        });
      }
    );
  }


  /**
   * Hàm lấy ra địa điểm
   */
  public getCities() {
    this.AddressService.getApiCity().subscribe((data) => {
      const listCities = data.map(function (obj: { name: any }) {
        return obj;
      });
      this.listCities = listCities;
    });
  }

  /**
   * Hàm lấy ra nhãn hàng của shop
   */
  public getBrands(idShop: any) {
    this.ProductService.getBrandByShop(idShop).subscribe(
      (data) => {
        const listBrands = data.map(function (obj: {
          id: any;
          name: any;
          avatar: any;
        }) {
          return obj;
        });
        this.listBrands = listBrands;
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: 'Không thể truy vấn sản phẩm!',
        });
      }
    );
  }

  /**
   * Hàm lấy ra loại sản phẩm của shop (child_category)
   */
  public getChildCategory(idShop: any) {
    this.ProductService.getChildCategoriesShop(idShop).subscribe(
      (data) => {
        const listCategories = data.map(function (obj: { id: any; name: any }) {
          return obj;
        });
        this.listCategories = listCategories;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  /**
   * Hàm hiển thị các địa chỉ còn lại bị ẩn
   */
  showHiddenLocation() {
    this.hiddenShowLocationMore = !this.hiddenShowLocationMore;
    this.hiddenLocation = !this.hiddenLocation;
  }

  /**
   * Hàm lọc sản phẩm theo loại
   * @param category loại sản phẩm
   */
  clickFilterCategory(category: any) {
    this.toBot();
    this.category = category;
    this.routeParams();
  }

  /**
   * Hàm lọc sản phẩm theo địa chỉ
   * @param event sự kiện click vào location
   * @param location tên location
   */
  clickFilterLocation(event: any, location: any) {
    if (event.currentTarget.checked) {
      this.location.push(location);
    } else {
      this.location.splice(this.location.indexOf(location), 1);
      if (this.location.length == 0) this.location = [];
    }
    this.routeParams();
  }

  /**
   * Hàm lọc sản phẩm theo nhãn hàng
   * @param event sự kiện click vào checkbox brand
   * @param brand tên nhãn hàng được check
   */
  clickFilterBrand(event: any, brand: any) {
    if (event.currentTarget.checked) {
      this.brand.push(brand);
    } else {
      this.brand.splice(this.brand.indexOf(brand), 1);
    }
    this.routeParams();
  }

  /**
   * Hàm chuyển trang
   * @param event số trang cần đến
   */
  public handlePageChange(event: number) {
    this.p = event;
    this.routeParams();
  }

  /**
   * Hàm đưa dữ liệu lên param url
   */
  routeParams() {
    this.router
      .navigate([], {
        relativeTo: this.route,
        queryParams: this.getRequestParams(
          this.category,
          this.location,
          this.brand,
          this.p,
          this.sortBy
        ),
        queryParamsHandling: 'merge', // remove to replace all query params by provided
      })
      .then(() => {
        this.listProduct();
      });
  }

  /**
   * Hàm lấy các tham số truyền vào
   * @param category loại sản phẩm
   * @param location mảng địa chỉ sản phẩm
   * @param brand mảng nhãn hàng
   * @param page trang số ?
   * @returns
   */
  getRequestParams(
    category: string,
    location: [] = [],
    brand: [] = [],
    page: number,
    sortBy: string
  ): any {
    let params: any = {};
    if (category) {
      params[`category`] = category;
    }
    if (page) {
      params[`page`] = page;
    }
    if (sortBy) {
      params[`sortBy`] = sortBy;
    }
    if (location != undefined && location.length > 0) {
      params[`location`] = location.toString();
    } else {
      params[`location`] = undefined;
    }
    if (brand != undefined && brand.length > 0) {
      params[`brand`] = brand.toString();
    } else {
      params[`brand`] = undefined;
    }
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

  /**
   * Hàm xem chi tiết sản phẩm từ cửa hàng
   * @param product id product truyền vào
   */
  showDetailProduct(product: any) {
    this.router.navigate([`/product/detail/${product}`]);
  }

  /**
   * Hàm hiển thị thông tin shop
   */
  showShopInfo(idShop: any) {
    this.shopService.getShopInfo(idShop).subscribe((res) => {
      this.shopForm.patchValue({
        id: res.id,
        name: res.name,
        image: res.image,
        image_sub: res.image_sub,
        create_date: res.create_date,
        description: res.description,
        address: res.address,
      });
    });
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
      this.listAllProducts.sort((a: any, b: any) => {
        return a == null || b == null
          ? 0
          : a.createdate > b.createdate
          ? -1
          : 1;
      });
    } else if (this.sortBy === 'discount') {
      this.listAllProducts.sort((a: any, b: any) => {
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
      this.listAllProducts.sort((a: any, b: any) => {
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
      this.listAllProducts.sort((a: any, b: any) => {
        return a.optionDef.price > b.optionDef.price ? -1 : 1;
      });
    } else if (this.sortBy == 'ASC') {
      this.listAllProducts.sort((a: any, b: any) => {
        return a.optionDef.price < b.optionDef.price ? -1 : 1;
      });
    }
  }
}
