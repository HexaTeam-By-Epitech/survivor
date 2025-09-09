<script lang="ts" setup>
type Project = {
    "name": string,
    "date": string,
    "description": string
}

const dummy_projects: Project[] = [
    {"name": "Ecoloop", "date": "2018-10-26", "description": "Marketplace for sustainable home goods."},
    {"name": "HealthBridge", "date": "2022-06-25", "description": "Virtual learning environment with AI tutors."},
    {"name": "UrbanNest", "date": "2023-03-01", "description": "Automated greenhouse system for urban farming."},
]

</script>

<template>
    <div class="container">
        <div v-for="project in dummy_projects" class="pcard">
            <p>{{ project.name }}</p>
        </div>
    </div>
</template>

<style lang="css">

.container {
    display: flex;
    flex-direction: row;
    margin-left: 10vw;
    margin-top: 10vh;
}

.pcard {
    height: 15vh;
    width: 20vw;
    margin: 2vh, 2vw, 2vh, 2vw;
}

</style>