import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const setAdminClaim = functions.https.onCall(async (data, context) => {
  if (context.auth?.token.email !== process.env.ADMIN_EMAIL) {
    throw new functions.https.HttpsError('permission-denied', 'Not authorized');
  }
  const { uid } = data;
  await admin.auth().setCustomUserClaims(uid, { isAdmin: true });
  return { message:  };
});
