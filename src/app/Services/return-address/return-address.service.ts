import { Injectable } from '@angular/core';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class ReturnAddressService {

  constructor(
    private router: Router,
  ) { }
  public returnAddress(){
    if(localStorage.getItem('returnAddress')){
      const segments: any = localStorage.getItem('returnAddress');
      localStorage.removeItem('returnAddress');
      document.location.href = segments;
  }
  else{
    document.location.href='';
  }
  }

  public addAddress(){
    const segments: any = window.location.href;
    localStorage.setItem('returnAddress', segments)
    this.router.navigate(['/login'])
  }
}
