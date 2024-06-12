import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const createUser = functions.https.onCall(async (data, context) => {
  try {
    const userRecord = await admin.auth().createUser({
      email: data.email,
      password: data.password,
      displayName: data.name,
    });

    await admin.firestore().collection('registeredStaff').add({
      Name: data.name,
      email: data.email,
      staffNumber: data.staffNumber,
      position: data.position,
      role: data.role
    });

    return { success: true, userRecord };
  } catch (error) {
    return { success: false};
  }
});
