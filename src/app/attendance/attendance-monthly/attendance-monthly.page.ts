import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, query, orderByValue, onValue, get, orderByChild, equalTo, startAt, endAt, child } from 'firebase/database';
import { ViewAttendanceModel } from 'src/app/models/viewAttendance.model';

@Component({
  selector: 'app-attendance-monthly',
  templateUrl: './attendance-monthly.page.html',
  styleUrls: ['./attendance-monthly.page.scss'],
})
export class AttendanceMonthlyPage implements OnInit {

  private loading: any
  public classId: any
  public batchKey: any
  public monthYear: any
  public className: any
  public month: any
  public year: any
  attendanceData: any
  public attendanceList: ViewAttendanceModel[] = []
  sourceAttendanceList: ViewAttendanceModel[] = []
  public totalClassesTaken: number = 0
  public database = getDatabase();
  public auth = getAuth();
  constructor(private viewAttendanceLoadingControl: LoadingController, private activatedRouter: ActivatedRoute, private router: Router, private alertController: AlertController) { }

  ngOnInit() {
    this.checkUserLoggedIn()
  }

  checkUserLoggedIn() {
    const user = this.auth.currentUser;
    if (user !== null) {
      this.activatedRouter.paramMap.subscribe(params => {
        this.batchKey = params.get('batchKey')
        this.classId = params.get('id')
        this.monthYear = params.get('monthYear')
        var res = this.monthYear.split("-");
        this.year = res[1]
        this.month = res[0]
        this.findMonthName(this.month)
        this.getClassInfo()
      })
      this.getAttendanceList()
    }
    else {
      this.router.navigateByUrl('/splash')
    }
  }

  getClassInfo() {
    const classesRef = ref(this.database, `classes/${this.batchKey}/${this.classId}`);
    const classQuery = query(classesRef, orderByValue());

    onValue(classQuery, (snapshot) => {
      this.className = snapshot.val().className + snapshot.val().section
    }
    )
  }

  getAttendanceList() {
    const studentsRef = ref(this.database, `attdce/${this.classId}`);
    const studentsQuery = query(studentsRef);

    onValue(studentsQuery, async (snapshot) => {
      this.sourceAttendanceList = []
      this.attendanceList = []
      this.attendanceData = []
      await this.pleaseWaitLoader()
      if (snapshot.val() == null) {
        await this.dismissLoadingController()
        return
      }
      this.attendanceData = snapshot.val()
      var totalStudents = snapshot.size
      snapshot.forEach(element => {
        var studentKey: any = element.key
        this.getStudent(studentKey).then(studentObj => {
          this.getAttendanceStatus(studentKey).then(async childsnapshot => {
            var tempObj: ViewAttendanceModel = { studentKey: "", name: "", profilePic: "", attendanceKey: "", attendanceCount: 0 }
            tempObj.studentKey = element.key
            tempObj.name = studentObj.firstName + " " + studentObj.lastName
            tempObj.profilePic = studentObj.profilePic
            tempObj.attendanceCount = childsnapshot
            this.sourceAttendanceList.push(tempObj)
            if (this.sourceAttendanceList.length == totalStudents) {
              this.attendanceList = this.sourceAttendanceList
              await this.dismissLoadingController()
            }
          })
        })
      })
    })
  }

  async getStudent(studentId: string): Promise<any> {
    const db = getDatabase();
    var student: any;
    const snapshot = await get(ref(db, `users/${studentId}`))
    student = snapshot.val();
    return student;
  }

  async getAttendanceStatus(studentId: string): Promise<any> {
    const db = getDatabase();
    console.log(this.monthYear)
    const attdceData = await get(ref(db, `attdce/${this.classId}/${studentId}`))
    if (attdceData.exists()) {
      let pAtt = 0
      let tAtt = 0
      attdceData.forEach((element: any) => {
        if (element.val().date.includes(this.monthYear)) {
          tAtt++
          if (element.val().morning == true) {
            pAtt++
          }
        }
        this.totalClassesTaken = tAtt
      });
      return pAtt
    } else {
      return 0
    }
  }

  async pleaseWaitLoader() {
    this.loading = await this.viewAttendanceLoadingControl.create({
      message: 'Please wait...',
      mode: 'md',
      backdropDismiss: false,
    });
    await this.loading.present();
  }

  async dismissLoadingController() {
    await this.loading.dismiss();
  }

  findMonthName(month: any) {
    switch (month) {
      case "1": {
        this.month = `Jan ${this.year}`
        break;
      }
      case "2": {
        this.month = `Feb ${this.year}`
        break;
      }
      case "3": {
        this.month = `Mar ${this.year}`
        break;
      }
      case "4": {
        this.month = `Apr ${this.year}`
        break;
      }
      case "5": {
        this.month = `May ${this.year}`
        break;
      }
      case "6": {
        this.month = `June ${this.year}`
        break;
      }
      case "7": {
        this.month = `July ${this.year}`
        break;
      }
      case "8": {
        this.month = `Aug ${this.year}`
        break;
      }
      case "9": {
        this.month = `Sep ${this.year}`
        break;
      }
      case "10": {
        this.month = `Oct ${this.year}`
        break;
      }
      case "11": {
        this.month = `Nov ${this.year}`
        break;
      }
      case "12": {
        this.month = `Dec ${this.year}`
        break;
      }
      default: {
        this.month = `No Data`
        break;
      }
    }
  }
}