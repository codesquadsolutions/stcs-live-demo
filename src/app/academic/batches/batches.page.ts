import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal, LoadingController } from '@ionic/angular';
import { getDatabase, ref, query, onValue, orderByChild, set, child, push, equalTo, get } from 'firebase/database';
import { Batch } from 'src/app/models/batch.model';
import { format, parseISO } from 'date-fns';
import { OverlayEventDetail } from '@ionic/core/components';
import { Router } from '@angular/router';
import { getAuth } from 'firebase/auth';
import { UserConstant } from 'src/app/appConstants/userConstants';
import { ClassService } from 'src/app/services/class/class.service';
import { type } from 'os';

@Component({
  selector: 'app-batches',
  templateUrl: './batches.page.html',
  styleUrls: ['./batches.page.scss'],
})
export class BatchesPage implements OnInit {

  private loading: any
  sourceBatches: Batch[] = []
  batches: Batch[] = []
  public database = getDatabase();
  year: any
  principal: any
  startDate: any
  endDate: any
  isSearch: boolean = false
  searchString: string = ""
  @ViewChild(IonModal) modal?: IonModal;
  public auth = getAuth();
  public currentUser: any = UserConstant.currentUser

  constructor(private dataService: ClassService, private batchLoadingControl: LoadingController, private router: Router) { }

  ngOnInit() {
    this.checkUserLoggedIn()

  }

  checkUserLoggedIn() {
    const user = this.auth.currentUser;
    if (user !== null) {
      // this.getBatchList()
      this.getBatchList()
    }
    else {
      this.router.navigateByUrl('/splash')
    }
  }



  async getBatchList() {
    const lastQuote = query(ref(this.database, 'batches'), orderByChild('year'));

    await this.pleaseWaitLoader()
    onValue(lastQuote, async (snapshot) => {
      if (snapshot.val() == null)
        await this.dismissLoadingController()
      this.sourceBatches = []
      var totalBatches = snapshot.size
      snapshot.forEach((childSnapshot) => {
        var tempObj: Batch = childSnapshot.val()
        tempObj.key = childSnapshot.key
        this.sourceBatches.push(tempObj)
        if (this.sourceBatches.length == totalBatches) {
          this.sourceBatches.reverse()
          this.batches = this.sourceBatches
          this.dismissLoadingController();
        }
      });

    });
  }

  cancel() {
    this.modal?.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal?.dismiss(null, 'confirm');
    this.addBatch()
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      console.log(`Hello, ${ev.detail.data}!`)
    }
  }

  async pleaseWaitLoader() {
    this.loading = await this.batchLoadingControl.create({
      message: 'Please wait...',
      mode: 'md',
      backdropDismiss: false,
    });
    await this.loading.present();
  }

  addBatch() {
    this.checkForDuplicate().then(value => {
      if (value) {
        var postBatch = {
          year: this.year,
          startDate: this.startDate,
          endDate: this.endDate,
          principal: this.principal
        }
        const newBatchKey = push(child(ref(this.database), 'batches')).key;
        set(ref(this.database, 'batches/' + newBatchKey), postBatch);
      }
      return
    })

  }

  async checkForDuplicate(): Promise<any> {
    const batchPresentRef = query(ref(this.database, 'batches/'), orderByChild('year'), equalTo(this.year))
    const snapshot = await get(batchPresentRef)
    if (snapshot.val())
      return false
    else
      return true
  }

  async dismissLoadingController() {
    await this.loading.dismiss();
  }

  isWeekday = (dateString: string) => {
    const date = new Date(dateString);
    const utcDay = date.getUTCDay();
    /**
     * Date will be enabled if it is not
     * Sunday or Saturday
     */
    return utcDay !== 0 && utcDay !== 6;
  };

  getDateInfo($event: string, field: string) {
    if (field == "year") {
      this.year = format(parseISO($event), 'yyyy')
    }
    else if (field == "start") {
      this.startDate = format(parseISO($event), 'dd-mm-yyyy')
    }
    else if (field == "end") {
      this.endDate = format(parseISO($event), 'dd-mm-yyyy')
    }
  }

  makeIsSearchable() {
    this.searchString = ""
    this.isSearch = !this.isSearch
    if (!this.isSearch) {
      this.batches = this.sourceBatches
    }
  }

  handleChange(event: { target: { value: string; }; }) {
    const searchQuery = event.target.value.toLowerCase();
    if (searchQuery.length == 0) {
      this.batches = this.sourceBatches
    }
    else {
      this.batches = this.sourceBatches.filter(element => element.year.toString().toLowerCase().includes(searchQuery)
        || element.principal.toLowerCase().includes(searchQuery)
      )
    }
  }

  //get all batches
  // async getAllBatches() {
  //   await this.pleaseWaitLoader()
  //   this.dataService.getBatches().then((data) => {

  //     console.log(data);
  //     console.log(typeof(data))
  //     // var totalBatches = data.size
  //     // console.log(totalBatches)
  //     // data.forEach((childSnapshot: any) => {
  //     //   var tempObj: Batch = childSnapshot.val()
  //     //   tempObj.key = childSnapshot.key
  //     //   this.sourceBatches.push(tempObj)
  //     //   if (this.sourceBatches.length == totalBatches) {
  //     //     this.sourceBatches.reverse()
  //     //     this.batches = this.sourceBatches
  //     //     this.dismissLoadingController();
  //     //   }
  //     // });
  //   }).catch((error) => {
  //     console.log(error);
  //   });
  // }

}
