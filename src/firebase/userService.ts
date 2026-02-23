// userService.ts

import { firestore } from './firebase';

// Save user data
export const saveUserData = async (userId, data) => {
    try {
        await firestore.collection('users').doc(userId).set(data);
        console.log('User data saved successfully!');
    } catch (error) {
        console.error('Error saving user data: ', error);
    }
};

// Get user data
export const getUserData = async (userId) => {
    try {
        const doc = await firestore.collection('users').doc(userId).get();
        if (doc.exists) {
            return doc.data();
        } else {
            console.log('No such user!');
            return null;
        }
    } catch (error) {
        console.error('Error getting user data: ', error);
    }
};

// Update user data
export const updateUserData = async (userId, data) => {
    try {
        await firestore.collection('users').doc(userId).update(data);
        console.log('User data updated successfully!');
    } catch (error) {
        console.error('Error updating user data: ', error);
    }
};

// Delete user data
export const deleteUserData = async (userId) => {
    try {
        await firestore.collection('users').doc(userId).delete();
        console.log('User data deleted successfully!');
    } catch (error) {
        console.error('Error deleting user data: ', error);
    }
};