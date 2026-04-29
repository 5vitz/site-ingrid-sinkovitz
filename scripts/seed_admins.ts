import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

const admins = [
  { email: 'sinkando@gmail.com', role: 'super' },
  { email: 'ingridsinkovitz@gmail.com', role: 'super' }
];

async function seed() {
  console.log('Autorizando administradores...');
  try {
    for (const admin of admins) {
      await setDoc(doc(db, 'users_roles', admin.email), {
        email: admin.email,
        role: admin.role,
        assignedBy: 'system_init'
      });
      console.log(`Usuário ${admin.email} autorizado como ${admin.role}.`);
    }
    process.exit(0);
  } catch (error) {
    console.error('Erro ao autorizar:', error);
    process.exit(1);
  }
}

seed();
