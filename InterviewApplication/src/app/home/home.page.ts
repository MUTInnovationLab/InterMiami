import { Component } from '@angular/core';
import { SafeStyle, DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  // fullname!: string;
  // email!: string;
  // subject!: string;
  // message!: string;


  backgroundImage: SafeStyle;

  constructor(private sanitizer: DomSanitizer) {
    const imagePath = '../assets/background.jpeg'; 
    this.backgroundImage = this.sanitizer.bypassSecurityTrustStyle(`url(${imagePath})`);
   }



  
 
  //  submitForm() {
  //    // You can perform any necessary validation or form processing here
  //    // For simplicity, we'll just log the form data in this example
  //    console.log('Fullname:', this.fullname);
  //    console.log('Email:', this.email);
  //    console.log('Subject:', this.subject);
  //    console.log('Message:', this.message);
 
  //    // You can perform additional actions like sending the form data to a server, etc.
  //    // For this example, we'll just reset the form fields after submission
  //    this.fullname = '';
  //    this.email = '';
  //    this.subject = '';
  //    this.message = '';
  //  }

  //  emailjs.send("service_hqx55ua","template_l6eqodi",{
  //   from_name: "Celimpilo",
  //   to_name: "Wandile",
  //   from_email: "generalwandile41@gmail.com",
  //   subject: "Test",
  //   message: "Hi im testing my email service",
  //   });
  }
