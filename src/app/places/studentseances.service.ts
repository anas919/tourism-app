import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Studentseance } from './studentseance.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class StudentseancesService {
  private studentseances: Studentseance[] = [];
  private studentseancesUpdated = new Subject<{studentseances: Studentseance[], studentseanceCount: number}>();

  constructor(private http: HttpClient, private router: Router) { }

  getStudentseances(studentseancesPerPage: number, currentPage: number, seanceId: string) {
    const queryParams = `?pagesize=${studentseancesPerPage}&page=${currentPage}&seance_id=${seanceId}`;
    this.http
      .get<{message: string, studentseances: any, maxStudentseances: number }>(
        'http://localhost:3000/api/studentseances' + queryParams
      )
      .pipe(map((studentseanceData) => {
        return { studentseances: studentseanceData.studentseances.map(studentseance => {
          return {
            student_id: studentseance.student_id,
            seance_id: studentseance.seance_id,
            is_absent: studentseance.is_absent,
            id: studentseance._id
          };
        }), maxStudentseances: studentseanceData.maxStudentseances};
      }))
      .subscribe((transfomedStudentseanceData) => {
        this.studentseances = transfomedStudentseanceData.studentseances;
        this.studentseancesUpdated.next({
          studentseances: [...this.studentseances],
          studentseanceCount: transfomedStudentseanceData.maxStudentseances
        });
      });
  }

  getStudentseanceUpdateListener() {
    return this.studentseancesUpdated.asObservable();
  }

  getStudentseance(id: string) {
    return this.http.get<{_id: string, student_id: string, seance_id: string, is_absent: any}>('http://localhost:3000/api/studentseances/' + id);
  }

  addStudentseance(student_id: string, seance_id: string, is_absent) {
    let studentseanceData: Studentseance;
    studentseanceData = {
      id: null,
      student_id: student_id,
      seance_id: seance_id,
      is_absent: is_absent
    }
    this.http
      .post<{message: string, post: Studentseance}>('http://localhost:3000/api/studentseances', studentseanceData)
      .subscribe((responseData) => {
        this.router.navigate(['/seances']);
      });
  }

  updateStudentseance(id: string, student_id: string, seance_id: string, is_absent) {
    let studentseanceData: Studentseance;
  	studentseanceData = {
  	  id: id,
  	  student_id: student_id,
  	  seance_id: seance_id,
      is_absent: is_absent
  	};
    console.log(studentseanceData);
    this.http
      .put('http://localhost:3000/api/studentseances/' + id, studentseanceData)
      .subscribe(response => {
        this.router.navigate(['/seances']);
      });
  }

  deleteStudentseance(studentseanceId: string) {
    return this.http.delete('http://localhost:3000/api/studentseances/' + studentseanceId);
  }
}
