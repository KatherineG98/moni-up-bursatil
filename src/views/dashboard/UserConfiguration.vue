<script setup>
import ProfileForm from '@/components/profile/ProfileForm.vue'
import PasswordForm from '@/components/profile/PasswordForm.vue'
import DeleteAccountCard from '@/components/profile/DeleteAccountCard.vue'
</script>

<template>
  <div class="space-y-6 max-w-2xl">
    <div>
      <h2 class="text-3xl font-black tracking-tight mb-2">Configuración de Cuenta</h2>
      <p class="text-base-content/60">Administra tu perfil y seguridad</p>
    </div>

    <!-- Perfil -->
    <ProfileForm />

    <!-- Cambiar Contraseña -->
    <PasswordForm />

    <!-- Zona peligrosa: Eliminar Cuenta -->
    <DeleteAccountCard />
  </div>
</template>
