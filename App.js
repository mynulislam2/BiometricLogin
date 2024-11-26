import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BiometricAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Check if Biometric is available
  useEffect(() => {
    const checkBiometrics = async () => {
      const rnBiometrics = new ReactNativeBiometrics();
      const {available, biometryType} = await rnBiometrics.isSensorAvailable();

      if (!available) {
        Alert.alert(
          'Biometrics unavailable',
          'Please enable biometric authentication in your device settings.',
        );
      } else {
        Alert.alert(
          'Biometrics available',
          biometryType === ReactNativeBiometrics.FaceID
            ? 'Face ID is available.'
            : 'Touch ID is available.',
        );
      }
    };
    checkBiometrics();
  }, []);

  // Register user with Biometrics
  const registerBiometric = async () => {
    const rnBiometrics = new ReactNativeBiometrics();
    const {available} = await rnBiometrics.isSensorAvailable();
    if (available) {
      const {publicKey} = await rnBiometrics.createKeys();
      if (publicKey) {
        try {
          await AsyncStorage.setItem('biometricKey', publicKey);
          Alert.alert('Success', 'Biometric registered!');
        } catch (error) {
          Alert.alert('Error', 'Failed to register biometrics.');
        }
      }
    } else {
      Alert.alert(
        'Biometric unavailable',
        'Biometric authentication is not available on this device.',
      );
    }
  };

  // Log in with Biometrics
  const loginWithBiometric = async () => {
    const rnBiometrics = new ReactNativeBiometrics();
    const {available} = await rnBiometrics.isSensorAvailable();

    if (available) {
      const {success} = await rnBiometrics.simplePrompt({
        promptMessage: 'Authenticate with Face ID or Touch ID',
      });

      if (success) {
        const storedPublicKey = await AsyncStorage.getItem('biometricKey');
        if (storedPublicKey) {
          Alert.alert('Logged in with Biometrics!');
        } else {
          Alert.alert('Error', 'Biometric verification failed.');
        }
      } else {
        Alert.alert('Authentication failed', 'Please try again.');
      }
    } else {
      Alert.alert('Biometric unavailable', 'No biometric sensor detected.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email address"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity
        style={styles.signInButton}
        onPress={() => Alert.alert('Sign In', 'Implement your logic')}>
        <Text style={styles.signInButtonText}>Sign in</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.biometricButton}
        onPress={registerBiometric}>
        <Text style={styles.biometricButtonText}>Register Biometrics</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.biometricButton}
        onPress={loginWithBiometric}>
        <Text style={styles.biometricButtonText}>Login with Biometrics</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F5',
    padding: 20,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#CCC',
  },
  signInButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#000',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  signInButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  biometricButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#F0F0F5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  biometricButtonText: {
    color: '#000',
    fontSize: 16,
  },
});

export default BiometricAuth;
