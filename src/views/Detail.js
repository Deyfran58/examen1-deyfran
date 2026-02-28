
import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';

import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';

export default function Detail({ route, navigation }) {

  // Se recibe el producto desde la navegación (parámetros enviados desde la lista)
  const { product } = route.params;

  // Hook para enviar acciones al estado global (Redux)
  const dispatch = useDispatch();

  // =============================
  // handleAdd:
  // Agrega el producto al carrito y muestra una alerta
  // con opción de navegar al carrito
  // =============================
  const handleAdd = () => {

    // Se envía la acción al slice del carrito
    dispatch(addToCart(product));

    // Alerta de confirmación
    Alert.alert(
      "🛍️ Producto agregado",
      "Se agregó correctamente al carrito",
      [
        {
          text: "Ir al Carrito",
          onPress: () => navigation.navigate("Cart") // Navega a pantalla Cart
        },
        {
          text: "Seguir comprando",
          style: "cancel"
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ScrollView permite que el contenido sea desplazable */}
      <ScrollView contentContainerStyle={styles.content}>

        {/* Imagen principal del producto */}
        <Image
          source={{ uri: product.image }}
          style={styles.image}
          resizeMode="contain"
        />

        {/* Tarjeta que contiene la información del producto */}
        <View style={styles.card}>
          <Text style={styles.title}>{product.title}</Text>

          <Text style={styles.category}>
            {product.category.toUpperCase()}
          </Text>

          {/* Validación opcional: solo se muestra si el producto tiene rating */}
          {product.rating && (
            <Text style={styles.rating}>
              ⭐ {product.rating.rate} ({product.rating.count} reviews)
            </Text>
          )}

          <Text style={styles.description}>
            {product.description}
          </Text>

          {/* Precio formateado a 2 decimales */}
          <Text style={styles.price}>
            ${product.price.toFixed(2)}
          </Text>
        </View>

      </ScrollView>

      {/* =============================
          Botón flotante fijo en la parte inferior
          Permite agregar el producto al carrito
      ============================= */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleAdd}
          style={styles.button}
        >
          <Text style={styles.buttonText}>
            Agregar al Carrito 🛒
          </Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

// =============================
// Estilos visuales separados de la lógica
// =============================
const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#0B0F1A',
  },

  content: {
    paddingHorizontal: 25,
    paddingTop: 40,
    paddingBottom: 150, // Espacio extra para no tapar el botón flotante
  },

  image: {
    width: 250,
    height: 250,
    alignSelf: 'center',
    marginBottom: 30,
    borderRadius: 30,
  },

  card: {
    backgroundColor: '#141B2D',
    borderRadius: 30,
    paddingVertical: 25,
    paddingHorizontal: 22,
    elevation: 12,
  },

  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#F1F5F9',
  },

  category: {
    marginTop: 8,
    fontSize: 13,
    color: '#8B5CF6',
    fontWeight: '700',
    textTransform: 'uppercase',
  },

  rating: {
    marginTop: 10,
    color: '#FACC15',
    fontWeight: '700',
    fontSize: 14,
  },

  description: {
    marginTop: 18,
    color: '#94A3B8',
    lineHeight: 22,
    fontSize: 14,
  },

  price: {
    marginTop: 25,
    fontSize: 26,
    fontWeight: '900',
    color: '#22C55E',
  },

  bottomContainer: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    paddingHorizontal: 25,
  },

  button: {
    backgroundColor: '#6366F1',
    paddingVertical: 20,
    borderRadius: 25,
    alignItems: 'center',
    elevation: 15,
  },

  buttonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 17,
  },
});