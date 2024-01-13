@@ -0,0 +1,66 @@
<template>
  <div class="flex-grid justify-center">
    <div class="col-2">
      <VeeForm @submit="register" class="card card-form">
        <h1 class="text-center">Register</h1>

        <AppFormField v-model="form.name" name="name" label="Full Name" rules="required" />
        <AppFormField
          v-model="form.username"
          name="username"
          label="Username"
          rules="required|unique:users,username"
        />
        <AppFormField
          v-model="form.email"
          name="email"
          label="Email"
          rules="required|email|unique:users,email"
          type="email"
        />
        <AppFormField
          v-model="form.password"
          name="password"
          label="Password"
          rules="required|min:8"
          type="password"
        />

        <div class="form-group">
          <AppAvatarImgEditor
            :src="avatarPreview"
            :processing="uploadingImage"
            withRandom
            alt="new user avatar preview"
            @change="handleAvatarChange"
          />
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-blue btn-block">Register</button>
        </div>
      </VeeForm>
      <div class="text-center push-top">
        <button @click="registerWithGoogle" class="btn-red btn-xsmall">
          <i class="fa fa-google fa-btn"></i>Sign up with Google
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { webresourceToBlobAsync } from '@/helpers';
export default {
  data() {
    return {
      uploadedFile: null,
      avatarPreview: '',
      uploadingImage: false,
      form: {
        name: '',
        username: '',
        email: '',
        password: '',
        avatar: '',
      },
    };
  },
  methods: {
    handleAvatarChange(e) {
      this.uploadedFile = e.file;
      this.avatarPreview = e.dataUrl || e.url;
    },
    async getAvatarData() {
      const randomAvatarGenerated = this.avatarPreview.includes('pixabay.com');
      this.uploadingImage = randomAvatarGenerated || this.uploadedFile != null;
      let avatar = null;
      if (this.uploadedFile != null) {
        avatar = this.uploadedFile;
      } else if (randomAvatarGenerated) {
        avatar = await webresourceToBlobAsync(this.avatarPreview);
      }
      this.form.avatar = avatar || this.form.avatar;
    },

    async register() {
      await this.getAvatarData();
      await this.$store.dispatch('auth/registerUserWithEmailAndPassword', {
        ...this.form,
        systemId: this.$route.query.systemId,
      });
      this.uploadingImage = false;
      this.successRedirect();
    },
    async registerWithGoogle() {
      await this.getAvatarData();
      await this.$store.dispatch('auth/signInWithGoogle', {
        ...this.form,
        systemId: this.$route.query.systemId,
      });
      this.uploadingImage = false;
      this.successRedirect();
    },
    successRedirect() {
      const redirectTo = this.$route.query.redirectTo || { name: 'Home' };
      this.$router.push(redirectTo);
    },
  },
  created() {
    this.$emit('ready');
  },
};
</script>
