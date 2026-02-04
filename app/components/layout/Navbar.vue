<script setup lang="ts">
const userStore = useUserStore();
const { alert } = useToastStore();
const isMenuOpen = ref(false);
const isUserDropdownOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
  isUserDropdownOpen.value = false;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

const toggleUserDropdown = () => {
  isUserDropdownOpen.value = !isUserDropdownOpen.value;
};

const closeUserDropdown = () => {
  isUserDropdownOpen.value = false;
};

const handleLogout = () => {
  closeUserDropdown();
  userStore.clearUser();
  alert("Úspěšně odhlášeno.", "info");
  navigateTo("/prihlaseni");
};
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
    <div class="container">
      <!-- Logo -->
      <NuxtLink class="navbar-brand fw-bold" @click="closeMenu">
        Personal Events
      </NuxtLink>

      <!-- Pravá část - vždy viditelná (user + hamburger) -->
      <div class="d-flex align-items-center gap-3 order-lg-last">
        <!-- User dropdown -->
        <div class="position-relative">
          <button
            class="btn btn-link d-flex align-items-center gap-2 text-decoration-none text-dark p-0"
            type="button"
            aria-label="User menu"
            :aria-expanded="isUserDropdownOpen"
            @click="toggleUserDropdown"
          >
            <Icon name="mdi:person" size="32" />
            <span class="d-none d-sm-inline">{{ userStore.user?.email }}</span>
            <Icon
              name="mdi:chevron-down"
              size="20"
              class="transition-transform"
              :class="{ 'rotate-180': isUserDropdownOpen }"
            />
          </button>

          <!-- Dropdown menu -->
          <Transition name="dropdown">
            <div
              v-if="isUserDropdownOpen"
              class="user-dropdown position-absolute end-0 mt-2 bg-white rounded shadow"
            >
              <ul class="list-unstyled m-0 py-2">
                <li>
                  <NuxtLink
                    to="/nastaveni-uctu"
                    class="dropdown-item d-flex align-items-center gap-2 px-3 py-2"
                    @click="closeUserDropdown"
                  >
                    <Icon name="mdi:account-circle" size="20" />
                    Nastavení účtu
                  </NuxtLink>
                </li>
                <li>
                  <hr class="dropdown-divider my-1" />
                </li>
                <li>
                  <button
                    class="dropdown-item d-flex align-items-center gap-2 px-3 py-2 w-100 text-danger"
                    @click="handleLogout"
                  >
                    <Icon name="mdi:logout" size="20" />
                    Odhlásit se
                  </button>
                </li>
              </ul>
            </div>
          </Transition>
        </div>

        <!-- Hamburger tlačítko pro mobil -->
        <button
          class="navbar-toggler border-0 d-lg-none"
          type="button"
          aria-label="Toggle navigation"
          :aria-expanded="isMenuOpen"
          @click="toggleMenu"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
      </div>

      <!-- Menu - pouze navigace -->
      <div
        class="navbar-collapse"
        :class="{ show: isMenuOpen, collapse: !isMenuOpen }"
      >
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <NuxtLink to="/prehled" class="nav-link" @click="closeMenu">
              Přehled
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>

  <!-- Overlay pro zavření dropdownu při kliknutí mimo -->
  <div
    v-if="isUserDropdownOpen"
    class="position-fixed top-0 start-0 w-100 h-100"
    style="z-index: 1000"
    @click="closeUserDropdown"
  />
</template>

<style scoped>
.navbar-collapse {
  transition: height 0.3s ease;
}

@media (max-width: 991.98px) {
  .navbar-collapse {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    padding: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 1000;
  }

  .navbar-collapse:not(.show) {
    display: none;
  }
}

.nav-link {
  position: relative;
  transition: color 0.2s ease;
}

.nav-link:hover {
  color: var(--bs-primary) !important;
}

.nav-link.router-link-active {
  color: var(--bs-primary) !important;
  font-weight: 500;
}

/* User dropdown */
.user-dropdown {
  min-width: 180px;
  z-index: 1001;
}

.dropdown-item {
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
}

.transition-transform {
  transition: transform 0.2s ease;
}

.rotate-180 {
  transform: rotate(180deg);
}

/* Dropdown animace */
.dropdown-enter-active,
.dropdown-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
