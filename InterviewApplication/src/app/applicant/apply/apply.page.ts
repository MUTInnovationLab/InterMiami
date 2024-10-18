import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { AngularFireStorage, AngularFireUploadTask} from '@angular/fire/compat/storage';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import firebase from 'firebase/compat/app';
import 'firebase/firestore';
import { finalize } from 'rxjs';
import { DatePipe } from '@angular/common';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ValidationsService } from 'src/app/Shared/validations.service';
const pdfMake = require('pdfmake/build/pdfmake.js');


@Component({
  selector: 'app-apply',
  templateUrl: './apply.page.html',
  styleUrls: ['./apply.page.scss'],
})
export class ApplyPage implements OnInit {

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



title: any;
dept: any;
qualify: any;





municipalities:any[]=[];

  emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  phoneNumPattern = /^((?:\+27|27)|0)(\d{2})-?(\d{3})-?(\d{4})$/;

  constructor(
    private navCtrl: NavController,
    private loadingController: LoadingController,
    private auth: AngularFireAuth,
    private fStorage: AngularFireStorage,
    private db: AngularFirestore,
    private alertController: AlertController,
    private toastController: ToastController,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private valid: ValidationsService
   
  ) {
    this.getUserToUpdate();
    
  }

    ngOnInit() {
      this.route.queryParams.subscribe(params => {
        this.counter = params['counter'];
        this.title = params['title'];
        this.dept = params['dept'];
        this.qualify = params['qualify'];
      });
    this.getAllDocuments();

    this.writeOn();
  }

  getAllDocuments() {
    this.valid.getAllDocuments();
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
  addSkill() {
    this.skills.push({ skilln: '', skillLevel: '', skillDescription: '' });
  }


  async Validation() {
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

    //if (.degree === '') {
      //this.degreeError = 'Please enter your Degree.';
      //alert('Please enter your Degree.');
     // return;
   // }


    //if (this.universityOrCollege === '') {
     //this.universityError = 'Please enter your university.';
     // alert('Please enter your university.');
      //return;
   // }

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
 this.submitOrUpdate()
 
  }

  removeReference(reference: any) {
    const index = this.references.indexOf(reference);
    if (index > -1) {
      this.references.splice(index, 1);
    }
  }

  removeQualification(qualification: any) {
    const index = this.qualifications.indexOf(qualification);
    if (index > -1) {
      this.qualifications.splice(index, 1);
    }
  }

  removeSkill(skill: any) {
    const index = this.skills.indexOf(skill);
    if (index > -1) {
      this.skills.splice(index, 1);
    }
  }

  

  removeLanguage(language: any) {
    const index = this.languages.indexOf(language);
    if (index > -1) {
      this.languages.splice(index, 1);
    }
  }

  showSecondDropdown(subOption: string) {
    if (subOption === 'A') {
      this.showSecondDropdownFlag = true;
    } else {
      this.showSecondDropdownFlag = false;
    }
  }

  removeExperience(experience: any) {
    const index = this.experiences.indexOf(experience);
    if (index !== -1) {
      this.experiences.splice(index, 1);
    }
  }

  getIonBirthdate($event: any) {
    this.birthdate = $event.detail.value.split('T')[0];
  }
  getIonGreduationYear($event: any) {
    this.graduationYear = $event.detail.value.split('-')[0];
  }
  //>>>>>>>>>>>><<<<<<<<<<<<<<<<<??//

  //>>>>>>>>>>>><<<<<<<<<<<<<<<<<??// 
  writeOn(){
    const counterValue = this.counter;

// Write the value of the counter to the input field
    this.code_job = counterValue;
  }

 

  async save() {
    const loader = await this.loadingController.create({
      message: 'submitting...',
      cssClass: 'custom-loader-class',
    });
    await loader.present();
  
    try {
      const user = this.auth.currentUser;
  
      if (await user) {
        const bothFilesSelected =
          this.academicRrdFile &&
          this.idFile &&
          (this.level !== 'WIL' || this.letterFile);
  
        if (bothFilesSelected) {
          let file = null,
            fileId = null,
            fileLetter = null;
          if (
            this.academicRrdFile instanceof FileList &&
            this.idFile instanceof FileList &&
            this.letterFile instanceof FileList
          ) {
            file = this.academicRrdFile.item(0);
            fileId = this.idFile.item(0);
            fileLetter = this.letterFile.item(0);
          } else {
            file = this.academicRrdFile;
            fileId = this.idFile;
            fileLetter = this.letterFile;
          }
  
          // Upload academic record file
          const path = `AcademicRecords/${this.academicRrdFile.name}`;
          const fileRef = this.fStorage.ref(path);
          this.acardemicRrdUpload = this.fStorage.upload(path, file);
          await this.acardemicRrdUpload;
          const pdfFile = await this.acardemicRrdUpload.task.snapshot.ref.getDownloadURL();
          this.academicRecordURl = pdfFile;

      
          // Upload ID file
          const idpath = `ID/${this.idFile.name}`;
          const fileRefId = this.fStorage.ref(idpath);
          this.idUpload = this.fStorage.upload(idpath, fileId);
          await this.idUpload;
          const pdfFile3 = await this.idUpload.task.snapshot.ref.getDownloadURL();
          this.idURL = pdfFile3;
  
          if (this.level === 'WIL') {
            // Upload letter file
            const pathLetter = `Letters/${this.letterFile.name}`;
            const fileRefLetter = this.fStorage.ref(pathLetter);
            this.letterUpload = this.fStorage.upload(pathLetter, fileLetter);
            await this.letterUpload;
            const pdfFile4 = await this.letterUpload.task.snapshot.ref.getDownloadURL();
            this.letterURL = pdfFile4;
          }

          let fileCerf =null;

          if (this.CertificatesFile instanceof FileList) {
        
            fileCerf = this.CertificatesFile.item(0);
   
          } else {
           
            fileCerf = this.CertificatesFile;
  
          }





          if (this.CertificatesFile) {

      
           const pathCerf = `Certificates/${this.CertificatesFile.name}`;
           const fileRefCerf = this.fStorage.ref(pathCerf);
           this.CerfUpload = this.fStorage.upload(pathCerf, fileCerf);
           await this.CerfUpload;
 
           const pdfFile2 =
             await this.CerfUpload.task.snapshot.ref.getDownloadURL();
           this.certicatesUrl = pdfFile2;

          }


        } else {
          loader.dismiss();
          if (!this.academicRrdFile) {
            alert('Academic record is required');
          } else if (this.level === 'WIL' && !this.letterFile) {
            alert('Eligibility Letter is required');
          } else if (!this.idFile) {
            alert('ID file is required');
          }
          return;
        }

      

        const currentDate = firebase.firestore.Timestamp.now();

        await this.generatePDF();
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
          companyName: this.companyName,
          companyNames: this.companyNames,
          count: this.count,
          recommendDate: this.recommendDate,
          placedDate: this.placedDate,
          createdAt: currentDate.toDate(),
          academicRecordURl: this.academicRecordURl,
          AllInOnePdfURL: this.AllInOnePdfURL,
          idURL :this.idURL,
          letterURL :this.letterURL,
          loginCount:0
        });

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
        


        

        loader.dismiss();
        alert('Information successfully saved');
        this.navCtrl.navigateForward('/views');
      } else {
        loader.dismiss();
        throw new Error('User not found');
      }
    } catch (error: any) {
      loader.dismiss();
      this.showToast(error)
  
      const errorMessage = error.message || 'An error occurred';
      alert(errorMessage);
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
  

  async uploadFileAndGetURL(file: File, path: string): Promise<string> {
    const fileRef = this.fStorage.ref(path);
    const uploadTask = this.fStorage.upload(path, file);
    await uploadTask;
    return await uploadTask.task.snapshot.ref.getDownloadURL();
  }

  async  deleteFileIfExists(url: string): Promise<void> {
    if (url) {
      try {
        const fileRef = this.fStorage.storage.refFromURL(url);
        await fileRef.delete();
      } catch (error) {
       this.showToast('Error deleting file:'+ error);
      }
    }
  }

  async update() {
    const loader = await this.loadingController.create({
      message: 'Updating...',
      cssClass: 'custom-loader-class',
    });
    await loader.present();

    try {
      const user = await this.auth.currentUser;

      if (user) {
        const bothfilesSelected = this.academicRrdFile && this.CertificatesFile && this.idFile && this.letterFile ;
        
        if (this.academicRrdFile) {
          const academicRecordPath = `AcademicRecords/${this.academicRrdFile.name}`;
          this.academicRecordURl = await this.uploadFileAndGetURL(this.academicRrdFile, academicRecordPath);
          await this.deleteFileIfExists.call(this, this.userDocumentt.academicRecordURl);
        }else{
          this.academicRecordURl =this.userDocumentt.academicRecordURl
        }

        if (this.CertificatesFile) {
          const certificatesPath = `Certificates/${this.CertificatesFile.name}`;
          this.certicatesUrl = await this.uploadFileAndGetURL(this.CertificatesFile, certificatesPath);
          await this.deleteFileIfExists.call(this, this.userDocumentt. certicatesUrl);
        }else{
          this.certicatesUrl = this.userDocumentt.certicatesUrl;
        }

        if (this.letterFile) {
          const letterPath = `letters/${this.letterFile.name}`;
          this.letterURL = await this.uploadFileAndGetURL(this.letterFile, letterPath);
          await this.deleteFileIfExists.call(this, this.userDocumentt.letterURL);
        }else{
          this.letterURL= this.userDocumentt.letterURL;
        }

        if (this.idFile) {
          const idPath = `ID/${this.idFile.name}`;
          this.idURL = await this.uploadFileAndGetURL(this.idFile, idPath);
          await this.deleteFileIfExists.call(this, this.userDocumentt.idURL);
        }else{
          this.idURL=this.userDocumentt.idURL;
        }


      // Call the optimized function to upload the files and delete the merged file.
    //  await uploadFiles.call(this);

      try {
        const fileRefAll = this.fStorage.storage.refFromURL(this.userDocumentt.AllInOnePdfURL);
        await fileRefAll.delete();
      } catch (error) {
        this.showToast('Error deleting merged file:'+ error);
      }

        await this.generatePDF();

        try {
          const fileRefA = this.fStorage.storage.refFromURL(
            this.userDocumentt.cvUrl
          ); // Delete the file
          await fileRefA.delete();
        } catch (error) {
          this.showToast('Error deleting cv file:'+ error);
        }
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   

        this.db
          .collection('applicant-application')
          .ref.where('email', '==', user.email)
          .get()
          .then((querySnapshot) => {
            const typedSnapshot =
              querySnapshot as firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>;

            if (typedSnapshot.empty) {
              alert('User not found');
              return;
            }

            const documentId = typedSnapshot.docs[0].id;

            this.db
              .collection('applicant-application')
              .doc(documentId)
              .update({
                fullName: this.fullname,
                lastName: this.lastname,
                email: this.email,
                phoneNumber: this.phone,
                gender: this.gender,
                birthdate: this.birthdate,
                address: this.address,
                city: this.city,
                country: this.country,
                studentno: this.studentno,
                postalCode: this.code,
                experience: this.experiences,
                references: this.references,
                qualifications:this.qualifications,
                gradeAverage:this.gradeAverage,
                certificate: this.certificate,
                skills: this.skills,
                TotalExperience: this.TotalExperience,
                languages: this.languages,
                graduationYear: this.graduationYear,
                status: 'pending',
                course: this.selectedOption,
                recommended: '0',
                cvUrl: this.cvUrl,
                certicatesUrl: this.certicatesUrl,
                level: this.level,
                faculty: this.faculty,
                academicRecordURl: this.academicRecordURl,
                AllInOnePdfURL: this.AllInOnePdfURL,
                idURL :this.idURL,
                letterURL :this.letterURL,
          
              })
              .then(async () => {
                await this.getUserToUpdate();
                alert('User updated successfully');
              })
              .catch((error: any) => {
                const errorMessage = error.message;
                alert(errorMessage);
              });
          })
          .catch((error: any) => {
            const errorMessage = error.message;
            alert(errorMessage);
          });

        loader.dismiss();
        alert('Information successfully saved');
        //this.navCtrl.navigateForward('/home');
        this.navCtrl.navigateForward('/views', {
        queryParams: { reference: this.fullname, data: this.data, source: 'buttons' },
        });
      } else {
        loader.dismiss();
        throw new Error('User not found');
      }
    } catch (error: any) {
      loader.dismiss();
      this.showToast(error);

      const errorMessage = error.message || 'An error occurred';
      alert(errorMessage);
    }
  }

  goToHomePage(): void {
    this.navCtrl.navigateBack('/posts');
  }

  uploadAcademicRrd(event: any) {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.academicRrdFile = files[0];
      this.showToast('File 1: ' + this.academicRrdFile.name);
    }
  }

  uploadCertificates(event: any) {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.CertificatesFile = files[0];
      this.showToast('File 2: ' + this.CertificatesFile.name);
    }
  }
  uploadID(event: any) {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.idFile = files[0];
      this.showToast('File 3: ' + this.idFile.name);
    }
  }
  
  uploadLetter(event: any) {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.letterFile = files[0];
      this.showToast('File 4: ' + this.letterFile.name);
    }
  }

  // Did this just to test

  async generatePDF() {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    try {
      // Define the content and styling of the PDF document
      let docDefinition = {
        pageBackground: '#F5F5F5', // Light gray background color for the entire page
        content: [
          {
            layout: {
              fillColor: '#C89015', // Green background color for the header bar
            },
            table: {
              widths: ['*'],
              body: [
                [
                  {
                    text: [
                      { text: this.fullname, style: 'header' },
                      { text: '\n' }, // Add line spacing
                      {
                        text: `${this.address}\n${this.email}\n${this.phone}\n${this.gender}`,
                        style: 'headerDetails',
                      },
                    ],
                    alignment: 'center',
                    fontSize: 24,
                    margin: [0, 10, 0, 20],
                  },
                ],
              ],
            },
          },
          { text: '', margin: [0, 5, 0, 10] }, // Add line spacing

          {
            layout: {
              fillColor: '#006281', // Dark gray background color for the title bar
            },
            table: {
              widths: ['*'],
              body: [
                [
                  {
                    text: 'Personal Summary',
                    style: 'titleBar',
                    margin: [0, 10, 0, 10],
                  },
                ],
              ],
            },
          },
          { text: '', margin: [0, 5, 0, 10] },
          { text: this.objective, style: 'content' },
          {
            layout: {
              fillColor: '#006281', // Dark gray background color for the title bar
            },
            table: {
              widths: ['*'],
              body: [
                [
                  {
                    text: 'CONTACT INFORMATION',
                    style: 'titleBar',
                    margin: [0, 10, 0, 10],
                  },
                ],
              ],
            },
          },
          { text: '', margin: [0, 5, 0, 10] }, // Add line spacing
          { text: 'Address:', style: 'sectionTitle' },
          { text: this.address, style: 'content' },
          { text: 'Email:', style: 'sectionTitle' },
          { text: this.email, style: 'content' },
          { text: 'Phone Number:', style: 'sectionTitle' },
          { text: this.phone, style: 'content' },
          { text: 'City:', style: 'sectionTitle' },
          { text: this.city, style: 'content' },
          { text: '', margin: [0, 10, 0, 10] }, // Add line spacing
          
             // Education section
    ...(this.qualifications.length > 0
      ? [
          {
            layout: {
              fillColor: '#006281', // Dark gray background color for the title bar
            },
            table: {
              widths: ['*'],
              body: [
                [
                  {
                    text: 'EDUCATION',
                    style: 'titleBar',
                    margin: [0, 10, 0, 10],
                  },
                ],
              ],
            },
          },
          { text: '', margin: [0, 5, 0, 10] }, // Add line spacing
          ...this.qualifications.map((qualification) => [
            { text: `Degree: ${qualification.degree}`, style: 'content' },
            { text: `Study Field: ${qualification.studyField}`, style: 'content' },
            { text: `Course Description: ${qualification.Qdescription}`, style: 'content' },
            { text: `University/College: ${qualification.universityOrCollege}`, style: 'content' },
            { text: 'Grade Average', style: 'content' },
            { text: this.gradeAverage, style: 'content' },
            { text: `Graduation year: ${qualification.graduationYear}`, style: 'content' },
          ]),
        ]
      : []),
      { text: '', margin: [0, 5, 0, 10] }, // Add line spacing

           // Languages section
    ...(this.languages.length > 0
      ? [
          {
            layout: {
              fillColor: '#006281', // Dark gray background color for the title bar
            },
            table: {
              widths: ['*'],
              body: [
                [
                  {
                    text: 'LANGUAGES',
                    style: 'titleBar',
                    margin: [0, 10, 0, 10],
                  },
                ],
              ],
            },
          },
          { text: '', margin: [0, 5, 0, 10] }, // Add line spacing
          ...this.languages.map((language) => [
            { text: `LANGUAGE: ${language.languagen}`, style: 'subheader' },
          ]),
        ]
      : []),
          // Skills section
          ...(this.skills.length > 0
            ? [
                {
                  layout: {
                    fillColor: '#006281', // Dark gray background color for the title bar
                  },
                  table: {
                    widths: ['*'],
                    body: [
                      [
                        {
                          text: 'SKILLS',
                          style: 'titleBar',
                          margin: [0, 10, 0, 10],
                        },
                      ],
                    ],
                  },
                },
                { text: '', margin: [0, 5, 0, 10] }, // Add line spacing
      
                ...this.skills.map((skill) => [
                  { text: `Skill: ${skill.skilln}`, style: 'content' },
                ]),
              ]
            : []),
      
            { text: '', margin: [0, 5, 0, 10] }, // Add line spacing

         // License section
    ...(this.license !== ''
    ? [
        {
          layout: {
            fillColor: '#006281', // Dark gray background color for the title bar
          },
          table: {
            widths: ['*'],
            body: [
              [
                {
                  text: 'LICENSE',
                  style: 'titleBar',
                  margin: [0, 10, 0, 10],
                },
              ],
            ],
          },
        },
        { text: '', margin: [0, 5, 0, 10] }, // Add line spacing

        [{ text: `License: ${this.license}`, style: 'content' }],
      ]
    : []),
  

          // Experience section
    ...(this.experiences.length > 0
      ? [
          {
            layout: {
              fillColor: '#006281', // Dark gray background color for the title bar
            },
            table: {
              widths: ['*'],
              body: [
                [
                  {
                    text: 'EXPERIENCE',
                    style: 'titleBar',
                    margin: [0, 10, 0, 10],
                  },
                ],
              ],
            },
          },
          { text: '', margin: [0, 5, 0, 10] }, // Add line spacing

          ...this.experiences.map((experience) => [
            { text: `Company: ${experience.company}`, style: 'subheader' },
            {
              text: `Job Title: ${experience.jobTitle}`,
              style: 'content',
            },
            {
              text: `Employment Period: ${experience.employmentPeriod} - ${experience.employmentPeriodend}`,
              style: 'content',
            },
            {
              text: `Job Description: ${experience.jobDescription}`,
              style: 'content',
            },
            { text: '', margin: [0, 10, 0, 10] }, // Add line spacing
          ]),
        ]
      : []),
      
          // References section
    ...(this.references.length > 0
      ? [
          {
            layout: {
              fillColor: '#006281', // Dark gray background color for the title bar
            },
            table: {
              widths: ['*'],
              body: [
                [
                  {
                    text: 'REFERENCES',
                    style: 'titleBar',
                    margin: [0, 10, 0, 10],
                  },
                ],
              ],
            },
          },
          { text: '', margin: [0, 5, 0, 10] }, // Add line spacing

          ...this.references.map((reference) => [
            { text: `Name: ${reference.name}`, style: 'subheader' },
            { text: `Relationship: ${reference.relationship}`, style: 'content' },
            { text: `Phone Number: ${reference.phone}`, style: 'content' },
            { text: `Email: ${reference.email}`, style: 'content' },
            { text: '', margin: [0, 10, 0, 10] }, // Add line spacing
          ]),
        ]
      : []),
        ],
        styles: {
          header: {
            color: '#006281', // Dark gray color
            fontSize: 24,
            bold: true,
            margin: [0, 0, 0, 5],
          },
          headerDetails: {
            fontSize: 12,
            color: '#fff', // Gray color
            margin: [0, 0, 0, 5],
          },
          titleBar: {
            color: '#FFFFFF', // White color
            fillColor: '#006281', // Dark gray background color for the title bar
            fontSize: 16,
            bold: true,
            alignment: 'center',
            margin: [0, 10, 0, 10],
            padding: [0, 5, 0, 5],
          },
          sectionTitle: {
            color: '#006281', // Dark gray color
            fontSize: 14,
            bold: true,
            margin: [0, 5, 0, 2],
          },
          content: {
            color: '#000000', // Black color
            fontSize: 12,
            margin: [0, 2, 0, 2],
          },
          subheader: {
            fontSize: 14,
            bold: true,
            margin: [0, 5, 0, 5],
          },
        },
      };

      const pdfDocGenerator = await pdfMake.createPdf(docDefinition);

      const blob = await new Promise<Blob>((resolve) => {
        pdfDocGenerator.getBlob(resolve);
      });

//////


try {
  // Load the CV PDF
  const cvPdf = await PDFDocument.load(await blob.arrayBuffer());

  // Merge academic record pages
  if (this.academicRrdFile) {
    const academicRecordPdf = await PDFDocument.load(await this.academicRrdFile.arrayBuffer());
    const maxAcademicRecordPages = Math.min(academicRecordPdf.getPageCount(), 4);

    for (let pageNumber = 0; pageNumber < maxAcademicRecordPages; pageNumber++) {
      const page = await cvPdf.copyPages(academicRecordPdf, [pageNumber]);
      cvPdf.addPage(page[0]);
    }
  }

  // Merge certificate pages
  if (this.CertificatesFile) {
    const certificatePdf = await PDFDocument.load(await this.CertificatesFile.arrayBuffer());
    const maxCertificatePages = Math.min(certificatePdf.getPageCount(), 4);




////////////
for (let pageNumber = 0; pageNumber < maxCertificatePages; pageNumber++) {
  const page = await cvPdf.copyPages(certificatePdf, [pageNumber]);
  cvPdf.addPage(page[0]);
}
}
 // Merge ID pages
 if (this.idFile) {
  const idPdf = await PDFDocument.load(await this.idFile.arrayBuffer());
  const maxIDPages = Math.min(idPdf.getPageCount(), 4)


//
for (let pageNumber = 0; pageNumber < maxIDPages; pageNumber++) {
  const page = await cvPdf.copyPages(idPdf, [pageNumber]);
  cvPdf.addPage(page[0]);
}
}
           // Merge letter pages
  if (this.letterFile) {
    const letterPdf = await PDFDocument.load(await this.letterFile.arrayBuffer());
    const maxLetterPages = Math.min(letterPdf.getPageCount(), 4);

    for (let pageNumber = 0; pageNumber < maxLetterPages; pageNumber++) {
      const page = await cvPdf.copyPages(letterPdf, [pageNumber]);
      cvPdf.addPage(page[0]);
    }
  }


          // Save the merged PDF
          const mergedPdfBytes = await cvPdf.save();

  // Upload the merged PDF file to Firebase Storage
  const fileName = `${this.fullname}_${Date.now()}.pdf`;
  const filePath = `AllInOne/${fileName}`;
  const storageRef = this.fStorage.ref(filePath);
  const snapshotMerged = await storageRef.put(mergedPdfBytes);

  this.AllInOnePdfURL = await snapshotMerged.ref.getDownloadURL();
  this.showToast('Combined PDF file uploaded. Download URL:'+ this.AllInOnePdfURL);

} catch (error:any) {
  this.showToast('Error occurred while merging PDFs:'+ error);
  
}
      // Continue with the rest of the code for updating the CV URL as before.
const filename = `${this.fullname}__${Date.now()}_CV.pdf`;
const path = `cv/${filename}`;
const fileRef = this.fStorage.ref(path);

const snapshot = await fileRef.put(blob);
const downloadURL = await snapshot.ref.getDownloadURL();

this.cvUrl = downloadURL;




  }catch (error:any) {
    this.showToast('Error occurred while merging PDFs:'+ error);
    
  }
}
  async getCourse(event: any) {
    const user = this.auth.currentUser;

    if (await user) {
      this.db
        .collection(event.detail.value, (ref) => ref.where('course', '>', ''))
        .valueChanges()
        .subscribe((data) => {
          this.course = data;
        });
    } else {
      throw new Error('User not found');
    }
  }

  isArray(obj: any) {
    return Array.isArray(obj);
  }

  async presentConfirmationAlert() {
    const alert = await this.alertController.create({
      header: 'Confirmation',
      message: 'Are you sure you want to SIGN OUT?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'my-custom-alert',
          handler: () => {
            this.showToast('Confirmation canceled');
          },
        },
        {
          text: 'Confirm',
          handler: () => {
            this.auth
              .signOut()
              .then(() => {
                localStorage.removeItem("currentUser");
                this.navCtrl.navigateForward('/sign-in');

                this.presentToast();
              })
              .catch((error) => {});
          },
        },
      ],
    });
    await alert.present();
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'SIGNED OUT!',
      duration: 1500,
      position: 'top',
    });

    await toast.present();
  }

  goToView() {
    this.navCtrl.navigateForward('/views');
  }

  arrayOn = false;
  async getUserToUpdate() {
    const userFirebase = await this.auth.currentUser;
    let user;
    
    if (userFirebase) {
      user = userFirebase;
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    }
    
    


    if (user) {
      const email = user.email;
      this.email = user?.email ?? '';
      this.db
        .collection('applicant-application', (ref) => ref.where('email', '==', email))
        .valueChanges()
        .subscribe((data: any[]) => {
          if (data.length > 0) {
            const userDocument = data[0];
            this.userDocumentt = data[0];

            this.arrayOn = true;
            this.showToast('allToUpdate ' + this.userDocumentt);
            this.fullname = userDocument.fullName;
            this.lastname = userDocument.lastName;
            this.gender = userDocument.gender;
            this.gradeAverage = userDocument.gradeAverage;
            this.city = userDocument.city;
            this.birthdate = userDocument.birthdate;
            this.email = userDocument.email;
            this.phone = userDocument.phoneNumber;
            this.address = userDocument.address;
            this.code = userDocument.postalCode;
            this.country = userDocument.country;
            this.studentno = userDocument.studentno;
            this.license = userDocument.license;
            this.province = userDocument.province;
            this.qualifications = userDocument.studyField;
            this.graduationYear = userDocument.graduationYear;
            this.faculty = userDocument.faculty;
            this.TotalExperience = userDocument.tTotalExperience;
            this.level = userDocument.level;
            this.selectedOption = userDocument.course;
            this.certificate = userDocument.certificate;
        
            this.experiences = userDocument.experience;
            this.references = userDocument.references;
            this.skills = userDocument.skills;
            this.languages = userDocument.languages;
            this.objective=userDocument.objective;
            this.AllInOnePdfURL = userDocument.AllInOnePdfURL;
            this.selectedMaspala=userDocument.municipality;
            this.idURL = userDocument.idURL,
            this.letterURL =userDocument.letterURL

            if (userDocument.qualifications && Array.isArray(userDocument.qualifications)) {
              this.qualifications = userDocument.qualifications.map((qualification: { Qdescription: any; degree: any; studyField: any; universityOrCollege: any; gradeAverage: any; graduationYear: any; }) => ({
                Qdescription: qualification.Qdescription || '',
                degree: qualification.degree || '',
                studyField: qualification.studyField || '',
                universityOrCollege: qualification.universityOrCollege || '',
                gradeAverage: qualification.gradeAverage || '',
                graduationYear: qualification.graduationYear || '' 
              }));
            }
           

            this.db
              .collection(this.faculty, (ref) => ref.where('course', '>', ''))
              .valueChanges()
              .subscribe((data) => {
                this.course = data;
              });

            this.birthdate = userDocument.birthdate;
          }
        });
    }else{
      localStorage.removeItem("currentUser");
    }
  }

  async submitOrUpdate() {
    if (this.arrayOn) {
      await this.update();
    } else {
      await this.save();
    }
  }


}

