// data.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs-compat/operator/map';
import { Post } from './post.model';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  // private apiUrl = 'https://next-home-control.vercel.app/api/temperature'; // Replace with your API endpoint
  private apiUrl = 'https://private-project-jonas-default-rtdb.europe-west1.firebasedatabase.app/data.json'; // Replace with your API endpoint

  constructor(private http: HttpClient) {}

  fetchData() {
    return this.http.get<{ [key: string]: Post }>(this.apiUrl, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
    // .pipe(
    //   map((responseData) => {
    //     const postsArray: Post[] = [];
    //     for (const key in responseData) {
    //       postsArray.push({ ...responseData[key], id: key });
    //     }
    //     return postsArray;
    //   })
    // );
  }

  createAndStoreData(title: string, content: string) {
    const postData: Post = { title, content };
    return this.http.post<{ name: string }>(
      'https://private-project-jonas-default-rtdb.europe-west1.firebasedatabase.app/recipes.json',
      postData
    );
  }
}
