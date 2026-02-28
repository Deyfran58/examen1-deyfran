// ======================================================
// Pantalla Home
// Muestra listado de productos, categorías y acceso al carrito
// Gestiona datos desde Redux y API externa
// ======================================================

import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

import { useDispatch, useSelector } from 'react-redux';

// Acciones del slice de productos
import {
  setProducts,
  setCategories,
  setLoading,
} from '../redux/slices/productSlice';

// Acción para cerrar sesión
import { logout } from '../redux/slices/authSlice';

import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api'; // Configuración personalizada de Axios

export default function Home({ navigation }) {

  // Hook para enviar acciones a Redux
  const dispatch = useDispatch();

  // Se obtiene estado global de productos
  const { products, categories, loading } = useSelector(
    state => state.products
  );

  // Se obtiene cantidad de productos en carrito
  const cartItems = useSelector(state => state.cart.items);

  // ======================================================
  // useEffect:
  // Se ejecuta al cargar la pantalla.
  // Llama a la API para obtener productos y categorías.
  // ======================================================
  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  // ======================================================
  // loadProducts:
  // Obtiene todos los productos desde la API
  // y los guarda en el estado global
  // ======================================================
  const loadProducts = async () => {
    dispatch(setLoading(true));
    const response = await api.get('/products');
    dispatch(setProducts(response.data));
  };

  // Obtiene las categorías disponibles desde la API
  const loadCategories = async () => {
    const response = await api.get('/products/categories');
    dispatch(setCategories(response.data));
  };

  // ======================================================
  // filterByCategory:
  // Filtra productos según la categoría seleccionada
  // ======================================================
  const filterByCategory = async category => {
    dispatch(setLoading(true));
    const response = await api.get(`/products/category/${category}`);
    dispatch(setProducts(response.data));
  };

  // ======================================================
  // handleLogout:
  // Elimina datos de sesión almacenados y redirige a Login
  // ======================================================
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('username');
      dispatch(logout());
      navigation.replace('Login');
    } catch (error) {
      console.log(error);
    }
  };

  // Loader mientras se obtienen datos
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00E5FF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>

      {/* ================= HEADER ================= */}
      <View style={styles.header}>

        {/* Botón del carrito con contador dinámico */}
        <TouchableOpacity
          style={styles.cartHeader}
          onPress={() => navigation.navigate('Cart')}
        >
          <Text style={styles.cartHeaderText}>🛒</Text>

          {/* Se muestra solo si hay productos en el carrito */}
          {cartItems.length > 0 && (
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>
                {cartItems.length}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <Text style={styles.title}>🛍️ Fake Store</Text>

        {/* Botón para cerrar sesión */}
        <TouchableOpacity
          onPress={handleLogout}
          style={styles.logoutButton}
        >
          <Text style={styles.logoutText}>SALIR</Text>
        </TouchableOpacity>

      </View>

      {/* ================= LISTA DE PRODUCTOS ================= */}
      <FlatList
        data={products}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        contentContainerStyle={{ padding: 15, paddingBottom: 140 }}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Detail', { product: item })
            }
            style={styles.card}
          >
            <Image
              source={{ uri: item.image }}
              style={styles.image}
              resizeMode="contain"
            />

            <Text numberOfLines={2} style={styles.productTitle}>
              {item.title}
            </Text>

            {/* Precio formateado */}
            <Text style={styles.price}>
              ${item.price.toFixed(2)}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* ================= CATEGORÍAS FIJAS INFERIORES ================= */}
      <View style={styles.categoryFloating}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={['all', ...categories]}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                item === 'all'
                  ? loadProducts()
                  : filterByCategory(item)
              }
              style={styles.categoryButton}
            >
              <Text style={styles.categoryText}>
                {item.toUpperCase()}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

    </SafeAreaView>
  );
}

// ======================================================
// Estilos visuales (separados de la lógica)
// ======================================================
const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F172A',
  },

  header: {
    backgroundColor: '#111827',
    paddingTop: 35,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#73a7db',
  },

  logoutButton: {
    borderWidth: 1,
    borderColor: '#EF4444',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
  },

  logoutText: {
    color: '#EF4444',
    fontWeight: '600',
    fontSize: 12,
  },

  cartHeader: {
    position: 'relative',
  },

  cartHeaderText: {
    fontSize: 22,
    color: '#759ec7',
  },

  headerBadge: {
    position: 'absolute',
    right: -6,
    top: -6,
    backgroundColor: '#F97316',
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },

  categoryFloating: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#111827',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderColor: '#1F2937',
  },

  categoryButton: {
    borderWidth: 1,
    borderColor: '#334155',
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 10,
  },

  categoryText: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '500',
  },

  card: {
    backgroundColor: '#1E293B',
    width: '48%',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },

  image: {
    width: '100%',
    height: 90,
    marginBottom: 8,
  },

  productTitle: {
    color: '#E2E8F0',
    fontSize: 13,
  },

  price: {
    color: '#F97316',
    fontSize: 15,
    fontWeight: '700',
  },
});