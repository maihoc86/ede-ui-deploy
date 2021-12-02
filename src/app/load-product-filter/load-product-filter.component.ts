import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ProductSearchService } from '../Services/product-search/product-search.service';

@Component({
  selector: 'app-load-product-filter',
  templateUrl: './load-product-filter.component.html',
  styleUrls: ['./load-product-filter.component.css']
})
export class LoadProductFilterComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private productSearchService: ProductSearchService,
    private router: Router,
   
  ) { }

  public param: any = '';
  public listProductAll: any = [];
  public page: any = '';
  public count: number = 0;

  ngOnInit(): void {
    this.getPageinParam();
    this.LoadProduct();

  }


  getProductAll(page: any){
    this.productSearchService.loadListProductAllShop(page).subscribe(
      data => {
        this.listProductAll = data.content;
        this.count = data.totalElements;
        console.log(data);
      }
    )}

    getPageinParam(){
      this.activatedRoute.queryParams.subscribe((param) => {
        let getPage = param['page'];
        if (getPage !== undefined) {
          this.page = getPage;
        }else{
          this.page = 1;
        }
      });
    }

    public handlePageChange(event: number) {
      this.page = event;
      this.routeParams();
    }

    routeParams() {
      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: this.getRequestParams( this.page),
        queryParamsHandling: 'merge', // remove to replace all query params by provided
      });
      this.LoadProduct();
    }

    LoadProduct(){
      this.activatedRoute.params.subscribe(({ param }) => {
        this.param = param;
        if(this.param == 'all'){
          this.getProductAll(this.page -1);
        }
        else{
        this.router.navigate(['/load/product/filter/all']);
        }
      });
    }


    getRequestParams(page: number): any {
      let params: any = {};
      if (page) {
        params[`page`] = page;
      }
      console.log(params)
      return params;
    }

}
