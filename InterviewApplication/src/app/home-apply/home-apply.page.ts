import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController, LoadingController, AlertController, ToastController } from '@ionic/angular';
import { ValidationsService } from '../Shared/validations.service';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { PDFDocument } from 'pdf-lib';



@Component({
  selector: 'app-home-apply',
  templateUrl: './home-apply.page.html',
  styleUrls: ['./home-apply.page.scss'],
})
export class HomeApplyPage implements OnInit {
  currentStep: number = 0;

  AllInOnePdfURL:any;
  cvFile:any;
  counter:any;
  code_job: any;
  title: any;
  codeTitles: any;
  dept: any;
  codeDept: any;
  qualify: any;
  codeQualify: any;

  acardemicRrdUpload: AngularFireUploadTask | undefined;
  CerfUpload: AngularFireUploadTask | undefined;
  idUpload: AngularFireUploadTask | undefined;
  letterUpload: AngularFireUploadTask | undefined;
  cvUpload: AngularFireUploadTask | undefined;

  cvUrl = '';
  objective = '';
  academicRrdFile: any;
  CertificatesFile: any;
  idFile:any;
  letterFile:any;

  academicRecordURl = '';
  certicatesUrl = '';
  idURL = '';
  letterURL = '';



 
  combinedPdf: PDFDocument | null = null;

 

  personalDetails = {
    fullName: '',
    lastName: '',
    gender: '',
    dob: '',
    email: '',
    phone: '',
    status: 'pending'
   
  };

  educations = [
    {
      qualification: '',
      fieldOfStudy: '',
      institution: '',
      graduationYear: '',
      average: ''
    }
  ];

  experiences = [
    {
      company: '',
      jobTitle: '',
      startDate: '',
      endDate: '',
      description: ''
    }
  ];

  skills = [
    {
      skillName: '',
      skillLevel: '',
      description: ''
    }
  ];

  references = [
    {
      name: '',
      relationship: '',
      phone: '',
      email: '',
      company: ''
    }
  ];
  

  constructor(private firestore: AngularFirestore,
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
   
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.counter = params['counter'];
      this.title = params['title'];
      this.dept = params['dept'];
      this.qualify = params['qualify'];
    });
    
    this.writeOn();
  }

  addEducation() {
    this.educations.push({
      qualification: '',
      fieldOfStudy: '',
      institution: '',
      graduationYear: '',
      average: ''
    });
  }

  removeEducation(index: number) {
    this.educations.splice(index, 1);
  }

  addExperience() {
    this.experiences.push({
      company: '',
      jobTitle: '',
      startDate: '',
      endDate: '',
      description: ''
    });
  }

  removeExperience(index: number) {
    this.experiences.splice(index, 1);
  }

  addSkill() {
    this.skills.push({
      skillName: '',
      skillLevel: '',
      description: ''
    });
  }

  removeSkill(index: number) {
    this.skills.splice(index, 1);
  }

  addReference() {
    this.references.push({
      name: '',
      relationship: '',
      phone: '',
      email: '',
      company: ''
    });
  }

  removeReference(index: number) {
    this.references.splice(index, 1);
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

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000, // Duration in milliseconds
      position: 'top' // Toast position: 'top', 'bottom', 'middle'
    });
    toast.present();
  }

  writeOn(){
    const counterValue = this.counter;
    this.code_job = counterValue;

    const counterValueT = this.title;
    this.codeTitles = counterValueT;

    const counterValueD = this.dept;
    this.codeDept = counterValueD;

    const counterValueQ = this.qualify;
    this.codeDept = counterValueQ;
  }

  validatePersonalDetails() {
    return (
      this.personalDetails.fullName.trim() !== '' &&
      this.personalDetails.lastName.trim() !== '' &&
      this.personalDetails.gender !== '' &&
      this.personalDetails.dob !== '' &&
      this.isValidEmail(this.personalDetails.email) &&
      this.isValidPhone(this.personalDetails.phone)
    );
  }
  
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  isValidPhone(phone: string): boolean {
    const phoneRegex = /^\d{10}$/; // Adjust regex based on your phone format
    return phoneRegex.test(phone);
  }

  validateEducations() {
    return this.educations.every(edu => 
      edu.qualification.trim() !== '' &&
      edu.fieldOfStudy.trim() !== '' &&
      edu.institution.trim() !== '' &&
      edu.graduationYear !== '' &&
      edu.average !== ''
    );
  }

  validateExperiences() {
    return this.experiences.every(exp => 
      exp.company.trim() !== '' &&
      exp.jobTitle.trim() !== '' &&
      exp.startDate !== '' &&
      exp.endDate !== '' &&
      exp.description.trim() !== ''
    );
  }

  
  validateSkills() {
    return this.skills.every(skill => 
      skill.skillName.trim() !== '' &&
      skill.skillLevel !== '' &&
      skill.description.trim() !== ''
    );
  }

  
  validateReferences() {
    return this.references.every(ref => 
      ref.name.trim() !== '' &&
      ref.relationship.trim() !== '' &&
      this.isValidPhone(ref.phone) &&
      this.isValidEmail(ref.email) &&
      ref.company.trim() !== ''
    );
  }

  validateForms() {
    return (
      this.validatePersonalDetails() &&
      this.validateEducations() &&
      this.validateExperiences() &&
      this.validateSkills() &&
      this.validateReferences()
    );
  }

  nextToEducation() {
    if (this.validatePersonalDetails()) {
      this.currentStep = 1;
    } else {
      alert('Please fill in all required fields in the Personal Details section.');
    }
  }

  nextToExperience() {
    if (this.validateEducations()) {
      this.currentStep = 2;
    } else {
      alert('Please fill in all required fields in the Education section.');
    }
  }

  nextToSkills() {
    if (this.validateExperiences()) {
      this.currentStep = 3;
    } else {
      alert('Please fill in all required fields in the Experience section.');
    }
  }

  nextToReferences() {
    if (this.validateSkills()) {
      this.currentStep = 4;
    } else {
      alert('Please fill in all required fields in the Skills section.');
    }

    return this.currentStep === this.currentStep;
  }

  backToPersonalDetails() {
    this.currentStep = 0;
  }

  backToEducation() {
    this.currentStep = 1;
  }

  backToExperience() {
    this.currentStep = 2;
  }

  backToSkills() {
    this.currentStep = 3;
  }

  getIonBirthdate($event: any) {
    this.personalDetails.dob = $event.detail.value.split('T')[0];
  }

  getIonEnddate($event: any, index: number) {
    this.experiences[index].endDate = $event.detail.value.split('T')[0];
  }

  getIonStartdate($event: any, index: number) {
    this.experiences[index].startDate = $event.detail.value.split('T')[0];
  }

  getIonGraddate($event: any, index: number) {
    this.educations[index].graduationYear = $event.detail.value.split('T')[0];
  }
  

  // Method to merge selected PDF into combinedPdf
  async mergePdfFiles(file: File) {
    const existingPdfBytes = await file.arrayBuffer();

    // Initialize combinedPdf if not already done
    if (!this.combinedPdf) {
      this.combinedPdf = await PDFDocument.create();
    }

    const pdfToAdd = await PDFDocument.load(existingPdfBytes);
    const copiedPages = await this.combinedPdf.copyPages(pdfToAdd, pdfToAdd.getPageIndices());
    copiedPages.forEach((page) => this.combinedPdf!.addPage(page));
  }

  async saveMerge() {
    const loader = await this.loadingController.create({
      message: 'Submitting...',
      cssClass: 'custom-loader-class',
    });
    await loader.present();

    try {
      const user = await this.auth.currentUser;

      if (user) {
        const bothFilesSelected = this.academicRrdFile && this.idFile;

        if (bothFilesSelected) {
          await this.mergePdfFiles(this.academicRrdFile);
          await this.mergePdfFiles(this.idFile);
          if (this.letterFile) await this.mergePdfFiles(this.letterFile);
          if (this.CertificatesFile) await this.mergePdfFiles(this.CertificatesFile);

          if (this.combinedPdf) {
            const mergedPdfBytes = await this.combinedPdf.save();

            const mergedPath = `MergedDocuments/Combined.pdf`;
            const mergedBlob = new Blob([mergedPdfBytes], { type: 'application/pdf' });

            const uploadTask = this.fStorage.upload(mergedPath, mergedBlob);
            await uploadTask;
            this.AllInOnePdfURL = await uploadTask.task.snapshot.ref.getDownloadURL();
            alert( 'The all is here'+ this.AllInOnePdfURL);
          }

          loader.dismiss();
          alert('Information successfully saved with all documents combined.');

        } else {
          loader.dismiss();
          throw new Error('Please select the required files.');
        }
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

  // Updated method to use the merged file URL
  async submitForm() {
    
    if (this.nextToReferences()) {
        await this.save(); // Wait for the save operation to complete

        if (this.AllInOnePdfURL) {
            const applicationData = {
                education: this.educations,
                experience: this.experiences,
                skills: this.skills,
                references: this.references,
                allDocumentsUrl: this.AllInOnePdfURL,
            };

            const userRef = this.firestore.collection('applicant-application').doc(this.personalDetails.email);
            const userDoc = await userRef.get().toPromise();
            if (!userDoc || !userDoc.exists) {
                await userRef.set({
                    personalDetails: this.personalDetails,
                    applications: [],
                });
            }

            await userRef.update({
                applications: firebase.firestore.FieldValue.arrayUnion(applicationData),
            });

            alert('Form submitted successfully!');
        } else {
            alert('Please fill in all required fields.');
        }
    }
}




  async save() {
    const loader = await this.loadingController.create({
        message: 'Submitting...',
        cssClass: 'custom-loader-class',
    });
    await loader.present();
    
    try {
        const user = await this.auth.currentUser;

        if (user) {
            const bothFilesSelected = this.academicRrdFile && this.idFile;

            if (bothFilesSelected) {
                // Upload files logic...

                // Wait for the merge and URL retrieval
                await this.saveMerge(); // Wait here

                loader.dismiss();
                alert('Information successfully saved');

            } else {
                loader.dismiss();
                throw new Error('Please select the required files.');
            }
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
  
}
