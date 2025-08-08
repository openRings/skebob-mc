plugins {
    kotlin("jvm") version "2.2.0"
    id("com.gradleup.shadow") version "8.3.0"
    id("xyz.jpenilla.run-paper") version "2.3.1"
}

group = "org.magwoo"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
    maven("https://repo.papermc.io/repository/maven-public/")
}

dependencies {
    compileOnly("io.papermc.paper:paper-api:1.21.4-R0.1-SNAPSHOT")
}

kotlin {
    jvmToolchain(21)
    sourceSets.main {
        kotlin.srcDir("src/kotlin/")
        resources.srcDir("src/resources/")
    }
}

tasks {
    shadowJar {
        archiveBaseName.set("villager-nerf")
        archiveClassifier.set("")
        archiveVersion.set("")
        archiveExtension.set("jar")
    }

    runServer {
        minecraftVersion("1.21.4")
    }

    build {
        dependsOn(shadowJar)
    }
}