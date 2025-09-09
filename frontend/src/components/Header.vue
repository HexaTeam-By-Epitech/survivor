<script lang="ts" setup>
import { RouterLink } from 'vue-router'

const dummy_cats = [
    {"name": "Catalog", "route": '/catalog'},
    {"name": "News", "route": '/news'}
]

</script>

<template>
    <nav class="wrapper">
        <RouterLink class="rlink" to="/">Home</RouterLink>
        <RouterLink class="rlink" to="/about">About</RouterLink>
        <RouterLink v-for="cats in dummy_cats" :key="cats.name" class="rlink" :to="cats.route">{{ cats.name }}</RouterLink>
    </nav>
    <div class="header-size" />
</template>

<style lang="css" scoped>

.wrapper {
    background-color: var(--color-theme9);
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: var(--header-height);
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 2vw;
}

.rlink {
    background-color: var(--color-theme5);
    text-decoration: none;
    font-size: 1.2rem;
    border-radius: 3px;
    padding: 0.5rem;
    transition: color 0.2s ease-in-out;
    color: var(--color-theme7);
}

.rlink:hover {
    color: var(--color-theme9);
}

</style>

