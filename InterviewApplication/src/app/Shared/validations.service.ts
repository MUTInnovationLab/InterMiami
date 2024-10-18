import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireUploadTask } from '@angular/fire/compat/storage';
import { ToastController } from '@ionic/angular';
import * as firebase from 'firebase/compat';

@Injectable({
  providedIn: 'root'
})
export class ValidationsService {
  selectedProvince: any;
  selectedMaspala: any;
 
  fullname = '';
  lastname = '';
  gender = '';
  birthdate = '';
  email = '';
  searchText = '';
  phone = '';
  address = '';
  city = '';
  province: string = '';
  country: string = '';
  provinceError: string | null = null;
  countryError: string | null = null;
  gradeAverage='';
  studentno='';
  certificate='';
  qualification = '';
  graduationYear = '';
  Qdescription='';
  degree= '';
  studyField= '';
  universityOrCollege= ''; 
  workEperience = '';
  workReferance = '';
  TotalExperience = '';
  academicRecordURl = '';
  certicatesUrl = '';
  idURL = '';
  letterURL = '';
  selectedOption = '';
  selectedSubOption: any;
  level = '';
  faculty = '';
  cvUrl = '';
  objective = '';
  academicRrdFile: any;
  CertificatesFile: any;
  idFile:any;
  letterFile:any;
  showSecondDropdownFlag: boolean = false;
  options: any;
  references: any[] = [];
  experiences: any[] = [];
  skills: { skilln: string, skillLevel: string, skillDescription: string }[] = [];
  qualifications: any[] = [];
  languages: any[] = [];
  acardemicRrdUpload: AngularFireUploadTask | undefined;
  CerfUpload: AngularFireUploadTask | undefined;
  idUpload: AngularFireUploadTask | undefined;
  letterUpload: AngularFireUploadTask | undefined;
  cvUpload: AngularFireUploadTask | undefined;
  emailError: any;
  course: any[] = [];
  subCourses: any;
  addressError: any;
  phoneError: any;
  userDocumentt: any;
  cityError: any;
  genderError: any;

  code = '';
  codeError: any;
  fullNameError:any;
  lastNameError:any;
  TotalExperienceError: any;
  coursedata : any[]=[];
  
 bithDateError:any;
 studyFieldError:any;
 gradeaverageError:any;
 degreeError:any;
 fieldError:any;
 universityError:any;
 yearError:any;
AllInOnePdfURL="";
companyName="";
count="";
employmentsError:any;
employmenteError:any;
refError:any;
companyNames : any[]=[];
license="";
recommendDate="";
placedDate="";
data: any;
code_job: any;

counter:any;
tables$:any;
jobfaculty:any;


title: string | null = null;
dept: string | null = null;
qualify: string | null = null;




municipalities:any[]=[];

  emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  phoneNumPattern = /^((?:\+27|27)|0)(\d{2})-?(\d{3})-?(\d{4})$/;

  constructor(private afs : AngularFirestore,
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private toastController: ToastController,
   
    )
     { }

     

  validating(){
    this.provinceError = null;
    this.genderError = null;
    this.fullNameError = null;
    this.emailError = null;
    this.lastNameError = null;
    this.phoneError = null;
    this.addressError = null;
    this.cityError = null;
    this.countryError = null;
    this.codeError = null;
    this.bithDateError=null;
    this.studyFieldError=null;
    this.gradeaverageError=null;
    this.degreeError=null;
    this.fieldError=null;
    this.universityError=null
    this.yearError=null;
    this.refError=null;
    this.TotalExperienceError=null;

   
  


    if (!this.fullname) {
      this.fullNameError = 'Please enter your fullname.';
      alert('Please enter your fullname.');
      return;
    }

    if (!this.lastname) {
      this.lastNameError = 'Please enter your lastname.';
      alert('Please enter your lastname.');
      return;
    }

    if (this.gender === '') {
      this.genderError = 'Please select your gender.';
      alert('Please select your gender.');
      return;
    }

    if (this.birthdate === '') {
      this.bithDateError = 'Please choose your birth date.';
      alert('Please choose your birth date.');
      return;
    }

    if (!this.email) {
      this.emailError = 'Please enter your email.';
      alert('please enter your email.');
      return;
    }

    if (!this.emailRegex.test(this.email)) {
      this.emailError = 'Please enter a valid email Address.';
      alert('please enter a valid Address.');
      return;
    }

    if (!this.phone) {
      this.phoneError = 'Please enter your phone number.';
      alert('Please enter your phone number.');
      return;
    }

    if (!/^[0-9]+$/.test(this.phone)) {
      this.phoneError = 'Please enter a valid phone number.';
      alert(this.phoneError);
      return;

    }

    if (!this.address) {
      this.addressError = 'Please enter your Address.';
      alert('Please enter your Address.');
      return;
    }

    if (!this.city) {
      this.cityError = 'Please enter your City.';
      alert('Please enter your city.');
      return;
    }

    if (this.province === '') {
      this.provinceError = 'Please select your province.';
      alert('Please enter your province.');
      return;
    }

    if (this.country === '') {
      this.countryError = 'Please enter your Country.';
      alert('Please enter your country.');
      return;
    }

    if (!this.code) {
      this.codeError = 'Please enter your Postal Code.';
      alert('Please enter your postal code.');
      return;
    }

   if (this.gradeAverage === "") {
      this.gradeaverageError = 'Please enter your grade average.';
      alert('Please enter your grade average.');
      return;
   }

   if (this.TotalExperience === '') {
    this.TotalExperienceError = 'Please enter your Country.';
    alert('Please enter your country.');
    return;
  }
    
   const gradeAverageRegex = /^\d{1,3}$/; // regular expression for one to three-digit numbers
    
    if (!gradeAverageRegex.test(this.gradeAverage)) {
     this.gradeaverageError = 'Please enter a valid grade average.';
      alert('Please enter a valid grade average.');
      return;
   }
  }

  async save(){
    const currentDate = new Date();
    await this.db.collection('applicant-application').add({
      fullName: this.fullname,
      lastName: this.lastname,
      email: this.email,
      phoneNumber: this.phone,
      gender: this.gender,
      birthdate: this.birthdate,
      address: this.address,
      province: this.province,
      city: this.city,
      country: this.country,
      studentno: this.studentno,
      postalCode: this.code,
      objective: this.objective,
      experience: this.experiences,
      references: this.references,
      qualifications: this.qualifications,
      gradeAverage:this.gradeAverage,
      certificate: this.certificate,
      tTotalExperience: this.TotalExperience,
      skills: this.skills,
      license: this.license,
      languages: this.languages,
      graduationYear: this.graduationYear,
      status: 'pending',
      course: this.selectedOption,
      recommended: '0',
      universityOrCollege: this.universityOrCollege,
      cvUrl: this.cvUrl,
      certicatesUrl: this.certicatesUrl,
      level: this.level,
      faculty: this.faculty,
      code_job: this.code_job,
      title: this.title,
      dept: this.dept,
      qualify: this.qualify,
      companyName: this.companyName,
      companyNames: this.companyNames,
      count: this.count,
      recommendDate: this.recommendDate,
      placedDate: this.placedDate,
      createdAt: currentDate,
      academicRecordURl: this.academicRecordURl,
      AllInOnePdfURL: this.AllInOnePdfURL,
      idURL :this.idURL,
      letterURL :this.letterURL,
      loginCount:0
    });
  }

  async saving(){
    if (this.code_job) {
      const applicantRef = this.db.collection<any>('applicant-application').ref;
      const query = applicantRef.where('code_job', '==', this.code_job);
      
      const matchingApplicants = await query.get();
      
      if (!matchingApplicants.empty) {
        // If matching documents exist
        const applicantDoc = matchingApplicants.docs[0];
        const currentCount = applicantDoc.data().count || 0;
    
        // Extract the numeric part and increment it
        const numericPartMatch = this.code_job.match(/\d+$/);
        if (numericPartMatch) {
          const numericPart = parseInt(numericPartMatch[0], 10) + 1;
    
          // Create a new code_job with the incremented numeric part and pad with leading zeros
          const newCodeJob = this.code_job.replace(/\d+$/, String(numericPart).padStart(numericPartMatch[0].length, '0'));
    
          // Update the document in the collection
          await applicantRef.doc(applicantDoc.id).update({
            code_job: newCodeJob,
            count: currentCount + 1,
          });
    
          // Update the local property
          this.code_job = newCodeJob;
        } else {
          this.showToast('Could not find numeric part in code_job:'+ this.code_job);
        }
      } 
    }
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000, // Duration in milliseconds
      position: 'top' // Toast position: 'top', 'bottom', 'middle'
    });
    toast.present();
  }

  getAllDocuments() {
    this.db
      .collection('Post')
      .valueChanges()
      .subscribe((data) => {
        this.tables$ = data;
      });
  }

  addReference() {
    this.references.push({
      name: '',
      relationship: '',
      phone: '',
      email: '',
    });
  }
  addLanguage() {
    this.languages.push({
      languagen: '',
    });
  }

  addExperience() {
    this.experiences.push({
      company: '',
      employmentPeriod: '',
      jobTitle: '',
      jobDescription: '',
      employmentPeriodend:'' 
    });
   
  }

  onProvinceChange(event: any) {
    const selectedProvince = event.detail.value;
    if (selectedProvince === 'International') {
      this.country = '';
    } else {
      this.country = 'South Africa';
    }
  }

  addQualification() {
    this.qualifications.push({
      certificate: '',
      studyField: '',
      Qdescription: '',
      universityOrCollege: '',
      gradeAverage: '',
      graduationYear: '',
    });
  }

}
