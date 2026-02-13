// Arquivo para diagnosticar problemas
console.log('=== DIAGNÓSTICO DO PROJETO ===');

// 1. Verificar se os módulos estão instalados
try {
  const firebase = require('firebase/app');
  console.log('✅ Firebase app instalado');
} catch (e) {
  console.log('❌ Firebase app não instalado:', e.message);
}

try {
  const auth = require('firebase/auth');
  console.log('✅ Firebase auth instalado');
} catch (e) {
  console.log('❌ Firebase auth não instalado:', e.message);
}

try {
  const firestore = require('firebase/firestore');
  console.log('✅ Firebase firestore instalado');
} catch (e) {
  console.log('❌ Firebase firestore não instalado:', e.message);
}

// 2. Verificar AsyncStorage
try {
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;
  console.log('✅ AsyncStorage instalado');
} catch (e) {
  console.log('❌ AsyncStorage não instalado:', e.message);
}

// 3. Verificar React Navigation - forma mais segura
try {
  // Tenta verificar o package.json
  const packageJson = require('./package.json');
  const hasReactNav = packageJson.dependencies && (
    packageJson.dependencies['@react-navigation/native'] || 
    packageJson.dependencies['@react-navigation/native-stack']
  );
  
  if (hasReactNav) {
    console.log('✅ React Navigation instalado');
  } else {
    console.log('❌ React Navigation não encontrado no package.json');
  }
} catch (e) {
  console.log('❌ Erro ao verificar React Navigation:', e.message);
}

console.log('=== FIM DO DIAGNÓSTICO ===');
