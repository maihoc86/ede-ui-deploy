import { Component, OnInit } from '@angular/core';
import { AddProductService } from '../Services/product-shop/add-product.service';
@Component({
  selector: 'app-category-shop',
  templateUrl: './category-shop.component.html',
  styleUrls: ['./category-shop.component.css']
})
export class CategoryShopComponent implements OnInit {

  constructor(private addproductService:AddProductService) { }
  public listAllCategory:any=[];
  public listParentCategory:any=[];
  public p:number=1;
  ngOnInit(): void {
    this.loadAllCategoryshop();
  }


  public loadAllCategoryshop(){
    this.addproductService.getAllCategoryShop().subscribe(data=>{
      console.log(data)
      this.listAllCategory=data;
      const listPa:any=[];
      const term:any=[];
     for(const item in data){
      if( term.indexOf( data[item].parentcategory.parentcategory.id)===-1){
        term.push(data[item].parentcategory.parentcategory.id)
        listPa.push({'id':data[item].parentcategory.parentcategory.id,'name':data[item].parentcategory.parentcategory.name,'p':1} )
      }
     }
     this.listParentCategory=listPa;
     console.log(this.listParentCategory)
    })
  }
}
