

// React y hook para ejecutar lógica al montar el componente
import React, { useEffect } from 'react';

// Componentes visuales de React Native
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,
  SafeAreaView,
} from 'react-native';

// Hooks de Redux para acceder y modificar el estado global
import { useSelector, useDispatch } from 'react-redux';

// Acciones definidas en el slice del carrito (Redux Toolkit)
import {
  removeFromCart,     // Elimina un producto del carrito
  clearCart,          // Vacía completamente el carrito
  loadCart,           // Carga productos guardados
  increaseQuantity,   // Aumenta la cantidad de un producto
  decreaseQuantity,   // Disminuye la cantidad de un producto
} from '../redux/slices/cartSlice';

// Módulo para almacenamiento persistente en el dispositivo
import AsyncStorage from '@react-native-async-storage/async-storage';

// Clave utilizada para guardar y recuperar el carrito en memoria local
const CART_STORAGE_KEY = '@fakeStore:cartItems';

export default function Cart() {

  // Permite enviar acciones al store global
  const dispatch = useDispatch();

  // Obtiene los productos y total desde el estado global (Redux)
  const items = useSelector(state => state.cart.items);
  const total = useSelector(state => state.cart.total);

  // =============================
  // useEffect: Se ejecuta al montar el componente
  // Carga el carrito guardado en AsyncStorage
  // =============================
  useEffect(() => {
    const loadSavedCart = async () => {
      const savedCart = await AsyncStorage.getItem(CART_STORAGE_KEY);

      // Si existen datos guardados, se cargan en Redux
      if (savedCart) {
        dispatch(loadCart(JSON.parse(savedCart)));
      }
    };

    loadSavedCart();
  }, []);

  // =============================
  // Simula proceso de pago
  // =============================
  const handlePay = () => {
    Alert.alert('✅ Compra Exitosa', 'Gracias por su compra');
    dispatch(clearCart()); // Limpia el carrito después del pago
  };

  // =============================
  // Simula cancelación de compra
  // =============================
  const handleCancel = () => {
    Alert.alert('❌ Compra Cancelada');
    dispatch(clearCart()); // Vacía el carrito
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* Título principal de la pantalla */}
      <Text style={styles.headerTitle}>🛒 Tu Carrito</Text>

      {/* Validación: si el carrito está vacío */}
      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Tu carrito está vacío
          </Text>
        </View>
      ) : (
        <>
          {/* FlatList permite renderizar listas de forma eficiente */}
          <FlatList
            data={items}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingBottom: 200 }}

            renderItem={({ item }) => {

              // Cálculo dinámico del subtotal por producto
              const subtotal = item.price * item.quantity;

              return (
                <View style={styles.card}>

                  {/* Imagen del producto */}
                  <Image
                    source={{ uri: item.image }}
                    style={styles.image}
                    resizeMode="contain"
                  />

                  <View style={styles.infoContainer}>

                    {/* Nombre del producto */}
                    <Text numberOfLines={2} style={styles.title}>
                      {item.title}
                    </Text>

                    {/* Precio unitario */}
                    <Text style={styles.price}>
                      ${item.price.toFixed(2)}
                    </Text>

                    {/* =============================
                        Control de Cantidad
                        Permite aumentar o disminuir unidades
                    ============================= */}
                    <View style={styles.qtyRow}>

                      <TouchableOpacity
                        onPress={() => dispatch(decreaseQuantity(item.id))}
                        style={styles.qtyBtn}
                      >
                        <Text style={styles.qtyText}>−</Text>
                      </TouchableOpacity>

                      {/* Cantidad actual */}
                      <Text style={styles.qtyNumber}>
                        {item.quantity}
                      </Text>

                      <TouchableOpacity
                        onPress={() => dispatch(increaseQuantity(item.id))}
                        style={styles.qtyBtn}
                      >
                        <Text style={styles.qtyText}>+</Text>
                      </TouchableOpacity>
                    </View>

                    {/* Subtotal individual */}
                    <Text style={styles.subtotal}>
                      Subtotal: ${subtotal.toFixed(2)}
                    </Text>

                    {/* Botón para eliminar producto del carrito */}
                    <TouchableOpacity
                      onPress={() => dispatch(removeFromCart(item.id))}
                      style={styles.removeBtn}
                    >
                      <Text style={styles.removeText}>
                        Eliminar
                      </Text>
                    </TouchableOpacity>

                  </View>
                </View>
              );
            }}
          />

          {/* =============================
              Resumen fijo en la parte inferior
          ============================= */}
          <View style={styles.summaryContainer}>

            {/* Muestra total general calculado en Redux */}
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total:</Text>
              <Text style={styles.summaryTotal}>
                ${total.toFixed(2)}
              </Text>
            </View>

            {/* Botón para finalizar compra */}
            <TouchableOpacity
              onPress={handlePay}
              style={styles.payButton}
            >
              <Text style={styles.payText}>
                Finalizar Compra
              </Text>
            </TouchableOpacity>

            {/* Botón para cancelar */}
            <TouchableOpacity
              onPress={handleCancel}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelText}>
                Cancelar
              </Text>
            </TouchableOpacity>

          </View>
        </>
      )}

    </SafeAreaView>
  );
}

// =============================
// ESTILOS (Separación de lógica y presentación)
// =============================
const styles = StyleSheet.create({

  // Contenedor principal
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },

  // Título superior
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#F8FAFC',
    paddingHorizontal: 25,
    paddingTop: 30,
    paddingBottom: 15,
    letterSpacing: 1,
  },

  // Contenedor cuando el carrito está vacío
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyText: {
    color: '#94A3B8',
    fontSize: 18,
    fontWeight: '600',
  },

  // Tarjeta de producto
  card: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 25,
    padding: 18,
    elevation: 8,
  },

  image: {
    width: 95,
    height: 95,
    borderRadius: 20,
  },

  infoContainer: {
    flex: 1,
    marginLeft: 18,
  },

  title: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },

  price: {
    color: '#38BDF8',
    marginTop: 6,
    fontWeight: '600',
  },

  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },

  qtyBtn: {
    backgroundColor: '#334155',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
  },

  qtyText: {
    color: '#F1F5F9',
    fontSize: 18,
    fontWeight: 'bold',
  },

  qtyNumber: {
    marginHorizontal: 18,
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },

  subtotal: {
    marginTop: 12,
    color: '#22C55E',
    fontWeight: '800',
    fontSize: 14,
  },

  removeBtn: {
    marginTop: 12,
  },

  removeText: {
    color: '#F97316',
    fontWeight: '700',
    fontSize: 13,
  },

  // Contenedor inferior fijo
  summaryContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#111827',
    padding: 25,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    elevation: 20,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },

  summaryLabel: {
    color: '#CBD5E1',
    fontSize: 16,
    fontWeight: '600',
  },

  summaryTotal: {
    color: '#22C55E',
    fontSize: 22,
    fontWeight: '900',
  },

  payButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 12,
  },

  payText: {
    fontWeight: '800',
    color: '#FFFFFF',
    fontSize: 16,
  },

  cancelButton: {
    backgroundColor: '#1F2937',
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: 'center',
  },

  cancelText: {
    color: '#F87171',
    fontWeight: '700',
    fontSize: 14,
  },

});