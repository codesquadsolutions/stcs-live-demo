import { Injectable } from '@angular/core';
import { getDatabase, ref, onValue } from "firebase/database";

@Injectable({
  providedIn: 'root'
})
export class ClassService {

  constructor() { }

  //getting all batches
  getBatches() {
    return new Promise((resolve, reject) => {
      const db = getDatabase();
      const starCountRef = ref(db, 'batches/');
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        console.log(data)
        resolve(data);
      }, (error) => {
        reject(error);
      });
    });

  }

}
