# 🎮 Minecraft Server Stress Tester GUI

**Direct Connection / No Proxy**

Zaawansowana aplikacja desktopowa stworzona przy użyciu **Electron** oraz **Mineflayer**, przeznaczona do kontrolowanych testów wydajności, obciążenia (**stress-test**) i stabilności serwerów Minecraft.

Aplikacja umożliwia zarządzanie wieloma botami jednocześnie, konfigurację parametrów połączenia z poziomu interfejsu graficznego oraz monitorowanie zdarzeń w czasie rzeczywistym.

> ⚠️ **Projekt przeznaczony jest do testowania własnych serwerów lub środowisk, na których użytkownik posiada odpowiednie uprawnienia.**

![Electron](https://img.shields.io/badge/Electron-30.x-4B8BF5?style=flat&logo=electron)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=flat&logo=node.js)
![Mineflayer](https://img.shields.io/badge/Mineflayer-4.20.0-green)
![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20Linux-blue)

---

## 🖥️ Interfejs GUI

Aplikacja posiada nowoczesny interfejs w ciemnym motywie, dzięki któremu większość ustawień można zmieniać bez konieczności edytowania plików źródłowych.

### Najważniejsze możliwości

- 🌑 **Nowoczesny Dark Theme** — przejrzysty panel sterowania.
- ⚙️ **Konfiguracja w czasie rzeczywistym** — możliwość zmiany:
  - adresu IP serwera,
  - portu,
  - wersji Minecraft,
  - liczby botów,
  - haseł,
  - opóźnień między połączeniami.
- 📋 **Kolorowana konsola logów** — wydarzenia są prezentowane w czasie rzeczywistym z wykorzystaniem czytelnych oznaczeń:
  - 🟢 `[+]` — pomyślne zalogowanie,
  - 🔵 `[i]` — działania autoryzacyjne, np. rejestracja/logowanie,
  - 🟡 `[!]` — wyrzucenie z serwera, np. Kick/AntiBot,
  - 🟠 `[-]` — rozłączenie i oczekiwanie na ponowne połączenie,
  - 🔴 `[X]` — błąd połączenia.
- 💬 **Customowe wiadomości i komendy** — możliwość definiowania wiadomości oraz komend wysyłanych przez boty.

---

## 🤖 Funkcje botów — Mineflayer

Projekt wykorzystuje bibliotekę **Mineflayer** do obsługi botów Minecraft.

### Masowe testowanie

Aplikacja umożliwia uruchomienie wielu botów jednocześnie oraz kontrolowanie sposobu ich dołączania do serwera.

Dostępne jest m.in. stopniowe dołączanie botów z wykorzystaniem parametru:

```text
spawnDelayMs
```

Pozwala to na kontrolowanie tempa nawiązywania kolejnych połączeń podczas testu.

### 🎮 Emulacja zachowania gracza

Boty mogą wykonywać podstawowe czynności imitujące zachowanie gracza, między innymi:

- chodzenie,
- kucanie,
- skakanie,
- sprint,
- machanie ręką,
- losowe rozglądanie się w przestrzeni 3D,
- opóźnienia przed wykonywaniem określonych czynności.

Dostępny jest również parametr:

```text
humanTypingDelay
```

odpowiadający za opóźnienie podczas symulowania wpisywania tekstu.

### 🔐 Automatyczna autoryzacja

Boty mogą reagować na komunikaty serwera związane z rejestracją i logowaniem.

Aplikacja rozpoznaje między innymi komunikaty zawierające:

```text
/register
/login
```

i może automatycznie wykonać odpowiednią akcję z wykorzystaniem skonfigurowanego hasła.

### 🔄 Smart Auto-Reconnect

W przypadku rozłączenia bot może automatycznie próbować ponownie nawiązać połączenie.

Mechanizm reconnectu uwzględnia również sytuacje, w których serwer stosuje ograniczenia dotyczące częstotliwości połączeń, dzięki czemu czas oczekiwania może zostać odpowiednio wydłużony.

---

## ⚠️ Direct Connection — brak proxy

### Ważne informacje dotyczące adresu IP

Aplikacja nawiązuje połączenia **bezpośrednio z użyciem adresu IP użytkownika**. Projekt nie wykorzystuje wbudowanej obsługi proxy do rozdzielania ruchu pomiędzy różne adresy IP.

W praktyce oznacza to, że wszystkie uruchomione boty mogą być widziane przez serwer jako połączenia pochodzące z tego samego adresu IP.

### Limity połączeń

Serwery Minecraft mogą posiadać różnego rodzaju zabezpieczenia i ograniczenia, takie jak:

- AntiBot,
- limity połączeń z jednego adresu IP,
- Velocity/BungeeCord rate-limit,
- ograniczenia częstotliwości logowania,
- inne mechanizmy ochrony przed nadmierną liczbą połączeń.

Próba uruchomienia zbyt dużej liczby botów lub ustawienie zbyt małego opóźnienia pomiędzy kolejnymi połączeniami może spowodować odrzucanie połączeń, czasowe ograniczenie dostępu lub blokadę adresu IP.

### Zalecane zastosowanie

Projekt najlepiej wykorzystywać do testowania:

- własnych serwerów Minecraft,
- środowisk developerskich,
- serwerów uruchomionych lokalnie, np. `localhost`,
- środowisk testowych z odpowiednio skonfigurowanymi limitami.

> **Nie używaj programu do obciążania serwerów, których nie jesteś właścicielem lub do których testowania nie masz wyraźnej zgody.**

---

## 📥 Pobieranie

Gotowe wersje aplikacji są dostępne w zakładce **Releases**.

➡️ [**Pobierz najnowszą wersję**](../../releases)

W przypadku systemu Windows dostępny jest gotowy plik `.exe`, dzięki czemu nie ma potrzeby instalowania Node.js w celu uruchomienia przygotowanej wersji aplikacji.

---

## 🛠️ Instrukcja dla deweloperów

### Wymagania

Do uruchomienia projektu ze źródeł wymagany jest:

- [Node.js](https://nodejs.org/) **18 lub nowszy**.

### 1. Klonowanie repozytorium

```bash
git clone https://github.com/TWOJ_NICK/NAZWA_REPOZYTORIUM.git
cd NAZWA_REPOZYTORIUM
```

### 2. Instalacja zależności

```bash
npm install
```

### 3. Uruchomienie aplikacji

```bash
npm start
```

---

## 📦 Budowanie aplikacji

Gotowe pliki wykonywalne można wygenerować w folderze:

```text
dist/
```

### Windows — `.exe`

Aby zbudować wersję dla systemu Windows:

```bash
npm run dist:win
```

### Linux — `.AppImage`

Aby zbudować wersję dla systemu Linux:

```bash
npm run dist:linux
```

---

## 🧩 Technologie

Projekt został zbudowany z wykorzystaniem:

- **Electron** — aplikacja desktopowa i interfejs GUI,
- **Node.js** — środowisko uruchomieniowe,
- **Mineflayer** — obsługa botów Minecraft,
- **JavaScript** — logika aplikacji.

---

## ⚖️ Licencja i zastrzeżenie

Projekt został stworzony **wyłącznie w celach edukacyjnych oraz do autoryzowanych testów wydajnościowych i stabilności własnych serwerów Minecraft**.

Użytkownik jest odpowiedzialny za sposób wykorzystania programu oraz za posiadanie odpowiednich uprawnień do przeprowadzania testów.

**Nie należy używać projektu do celowego zakłócania działania serwerów osób trzecich ani do obchodzenia ich zabezpieczeń.**

Autor nie ponosi odpowiedzialności za niewłaściwe wykorzystanie programu.