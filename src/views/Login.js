import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setUser } from '../redux/slices/authSlice';

export default function Login({ navigation }) {
  const dispatch = useDispatch();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const savedUser = await AsyncStorage.getItem('username');

      if (token && savedUser) {
        dispatch(setUser({ user: savedUser, token }));
        navigation.replace('Home');
      }
    } catch (error) {
      console.log('Error verificando sesión:', error);
    }
  };

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Atención', 'Debes completar todos los campos');
      return;
    }

    setLoading(true);

    try {
      // Login simulado
      if (username === 'deyfran' && password === '12345q') {
        const fakeToken = 'token-demo-123456';

        dispatch(setUser({ user: username, token: fakeToken }));

        await AsyncStorage.setItem('userToken', fakeToken);
        await AsyncStorage.setItem('username', username);

        navigation.replace('Home');
      } else {
        Alert.alert('Error', 'Credenciales incorrectas');
      }
    } catch (error) {
      console.log('Error en login:', error);
      Alert.alert('Error', 'Ocurrió un problema al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.logo}>🛍️</Text>
        <Text style={styles.title}>Fake Store</Text>
        <Text style={styles.subtitle}>Inicia sesión para continuar</Text>

        <TextInput
          placeholder="Usuario"
          placeholderTextColor="#888"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Contraseña"
          placeholderTextColor="#888"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />

        <TouchableOpacity
          onPress={handleLogin}
          style={styles.button}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#121212" />
          ) : (
            <Text style={styles.buttonText}>Iniciar Sesión</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.hint}>Usuario: deyfran</Text>
        <Text style={styles.hint}>Contraseña: 12345q</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  card: {
    width: '100%',
    backgroundColor: '#1E293B',
    paddingVertical: 35,
    paddingHorizontal: 25,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },

  logo: {
    fontSize: 55,
    textAlign: 'center',
    marginBottom: 10,
  },

  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#F8FAFC',
    textAlign: 'center',
    letterSpacing: 1,
  },

  subtitle: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 30,
  },

  input: {
    backgroundColor: '#334155',
    paddingVertical: 18,
    paddingHorizontal: 15,
    borderRadius: 18,
    color: '#FFFFFF',
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#475569',
  },

  button: {
    backgroundColor: '#6366F1',
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 10,
  },

  buttonText: {
    fontWeight: '700',
    color: '#FFFFFF',
    fontSize: 15,
    letterSpacing: 1,
  },

  hint: {
    color: '#94A3B8',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 18,
  },
});