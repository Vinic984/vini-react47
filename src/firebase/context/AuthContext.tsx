import React, { createContext, useContext, useEffect, useState ,useContext } from 'react';
import { onAuthStateChanged,} from 'firebase/auth';
import { auth } from './config/firebaseConfig';