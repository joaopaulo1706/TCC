import 'dotenv/config';

export default {
  expo: {
    name: "meu-app",
    slug: "meu-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true,
      package: "com.anonymous.meuapp" // 👈 já está configurado
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.EXPO_PUBLIC_SUPABASE_KEY,
      eas: {
        projectId: "4c561c64-cb76-4a90-9c11-9ddeb4373430" // 👈 adicionado
      }
    }
  }
};
