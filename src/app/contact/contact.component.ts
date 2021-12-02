import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RegisterService } from '../Services/register/register-service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent implements OnInit {
  constructor(private registerService: RegisterService) {}

  ngOnInit(): void {}
  filesArray: File[] = [];

  public contact = new FormGroup({
    fullName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    content: new FormControl('', [Validators.required]),
    file: new FormControl(''),
  });

  onselectFile(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.contact.controls['file'].setValue(file);
    }
  }

  sendContact() {
    const formData = new FormData();
    for (const controlName in this.contact.controls) {
      formData.append(controlName, this.contact.controls[controlName].value);
    }
    //TODO chưa add đc hình ảnh
    this.registerService.sendContact(formData).subscribe(
      (data: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Thành công',
          text: 'Bạn đã gửi yêu cầu hỗ trợ thành công !',
        });
      },
      (error: any) => {
        Swal.fire({
          icon: 'error',
          title: error.error.errors[0].defaultMessage,
          text: error.error.message,
        });
      }
    );
  }
}
