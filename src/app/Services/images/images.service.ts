import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs'
import { switchMap, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ImagesService {
  constructor(
    private httpClient: HttpClient,
    private cookieService: CookieService
  ) {}

  private API = 'http://localhost:8080/ede-file';
  // upload image
  private httpOptionsFile = {
    headers: new HttpHeaders({
      Authorization: this.cookieService.get('auth'),
    }),
  };
  public createMultiImageProductOption(files: any) {
    return this.httpClient.post<any>(
      this.API + '/create-multi/binary',
      files,
      this.httpOptionsFile
    );
  }

  public createMultiImageEvaluate(files: any) {
    return this.httpClient.post<any>(
      this.API + '/create-multi/binary',
      files,
      this.httpOptionsFile
    );
  }

  public createImage_Sub_Shop(file: any) {
    return this.httpClient.post<any>(
      this.API + '/create/binary',
      file,
      this.httpOptionsFile
    );
  }

  getData(name: string): Observable<string> {
    return this.httpClient
      .get(this.API + '/get/image/' + name, { responseType: 'blob' })
      .pipe(switchMap((response: Blob) => this.readFile(response)));
  }
  blobToFile(name: string) {
    return this.httpClient.get(this.API + '/get/image/' + name, {
      responseType: 'blob',
    });
  }

  private readFile(blob: Blob): Observable<string> {
    return Observable.create(
      (obs: {
        error: (arg0: ProgressEvent<FileReader>) => any;
        next: (arg0: string | ArrayBuffer | null) => any;
        complete: () => any;
      }) => {
        const reader = new FileReader();

        reader.onerror = (err) => obs.error(err);
        reader.onabort = (err) => obs.error(err);
        reader.onload = () => obs.next(reader.result);
        reader.onloadend = () => obs.complete();

        return reader.readAsDataURL(blob);
      }
    );
  }
  public readrFileMultiImageProductOption(name: string) {
    return this.httpClient.get(this.API + '/get/image/' + name, {
      observe: 'response',
      responseType: 'blob',
    });
  }
  public updateMultiImageProductOption(files: any) {
    return this.httpClient.post<any>(
      this.API + '/update-multi/binary',
      files,
      this.httpOptionsFile
    );
  }
  public deleteMultiImageProductOption(files: any) {
    return this.httpClient.post<any>(
      this.API + '/delete-multi',
      files,
      this.httpOptionsFile
    );
  }
}
