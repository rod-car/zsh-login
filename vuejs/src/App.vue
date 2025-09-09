<template>
  <div class="terminal">
    <div class="terminal-header">
      <div class="terminal-buttons">
        <div class="btn close"></div>
        <div class="btn minimize"></div>
        <div class="btn maximize"></div>
      </div>
      <div class="terminal-title">
        <span class="status-indicator"></span>
        zsh 5.9 - secure session
      </div>
    </div>
    <div class="terminal-body" ref="terminalBody">
      <div v-for="(line, index) in lines" :key="index" class="line" v-html="line.content"></div>
      <div v-if="currentStep === 'username'" class="input-line">
        <span class="prompt">login:</span>
        <input
          ref="inputRef"
          type="text"
          class="input-field"
          v-model="currentCommand"
          @keypress="handleKeyPress"
          placeholder="Entrez votre nom d'utilisateur"
        />
        <span class="cursor" :style="{ display: currentCommand ? 'none' : 'inline-block' }"></span>
      </div>
      <div v-else-if="currentStep === 'password'" class="input-line">
        <span class="prompt">password:</span>
        <input
          ref="inputRef"
          type="password"
          class="input-field"
          v-model="currentCommand"
          @keypress="handleKeyPress"
          placeholder=""
        />
        <span class="cursor" :style="{ display: currentCommand ? 'none' : 'inline-block' }"></span>
      </div>
      <div v-else-if="currentStep === 'main'" class="input-line">
        <span class="prompt user">{{ username }}@secure-server:~$</span>
        <input
          ref="inputRef"
          type="text"
          class="input-field"
          v-model="currentCommand"
          @keypress="handleKeyPress"
          placeholder="Tapez 'help' pour voir les commandes disponibles"
        />
        <span class="cursor" :style="{ display: currentCommand ? 'none' : 'inline-block' }"></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';

const lines = ref([]);
const currentStep = ref('init');
const username = ref('');
const password = ref('');
const isProcessing = ref(false);
const currentCommand = ref('');
const terminalBody = ref(null);
const inputRef = ref(null);

onMounted(async () => {
  await init();
});

const init = async () => {
  await showWelcome();
  await delay(800);
  await showSystemInfo();
  await delay(500);
  await startLoginProcess();
};

const showWelcome = async () => {
  const asciiArt = `    ███████╗███████╗██╗  ██╗    ████████╗███████╗██████╗ ███╗   ███╗██╗███╗   ██╗ █████╗ ██╗     
    ╚══███╔╝██╔════╝██║  ██║    ╚══██╔══╝██╔════╝██╔══██╗████╗ ████║██║████╗  ██║██╔══██╗██║     
      ███╔╝ ███████╗███████║       ██║   █████╗  ██████╔╝██╔████╔██║██║██╔██╗ ██║███████║██║     
     ███╔╝  ╚════██║██╔══██║       ██║   ██╔══╝  ██╔══██╗██║╚██╔╝██║██║██║╚██╗██║██╔══██║██║     
    ███████╗███████║██║  ██║       ██║   ███████╗██║  ██║██║ ╚═╝ ██║██║██║ ╚████║██║  ██║███████╗
    ╚══════╝╚══════╝╚═╝  ╚═╝       ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝`;

  addLine(`<div class="ascii-art">${asciiArt}</div>`);
  await delay(500);
  addLine('<span class="success">Welcome to SecureShell Terminal v2.1.0</span>');
  await delay(300);
  addLine('<span class="output">Initializing secure connection...</span>');

  addLine('<div class="progress-bar"><div class="progress-fill" style="width: 0%;" id="progress"></div></div>');
  await nextTick();
  const progress = document.getElementById('progress');
  if (progress) {
    for (let i = 0; i <= 100; i += 10) {
      progress.style.width = i + '%';
      await delay(50);
    }
  }

  await delay(200);
  addLine('<span class="success">✓ Connection secured</span>');
};

const showSystemInfo = async () => {
  const now = new Date();
  const systemInfo = `
    <div class="system-info">
      <strong>System Information</strong><br>
      Hostname: <span class="highlight">secure-server.dev</span><br>
      IP: <span class="highlight">192.168.1.100</span><br>
      Last login: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}<br>
      Shell: <span class="highlight">zsh 5.9</span>
    </div>
  `;
  addLine(systemInfo);
};

const startLoginProcess = async () => {
  await delay(500);
  addLine('<span class="warning">Authentication required for secure access</span>');
  await delay(300);
  currentStep.value = 'username';
  await nextTick(() => focusInput());
};

const addLine = (content) => {
  lines.value.push({ content });
  scrollToBottom();
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const scrollToBottom = async () => {
  await nextTick();
  if (terminalBody.value) {
    terminalBody.value.scrollTop = terminalBody.value.scrollHeight;
  }
};

const handleKeyPress = async (e) => {
  if (e.key === 'Enter' && !isProcessing.value) {
    isProcessing.value = true;
    const value = currentCommand.value.trim();
    if (currentStep.value === 'username') {
      addLine(`<span class="prompt">login:</span> <span class="command">${escapeHtml(value)}</span>`);
      if (!value) {
        addLine('<span class="error">Username cannot be empty</span>');
        isProcessing.value = false;
        currentCommand.value = '';
        await nextTick(() => focusInput());
        return;
      }
      username.value = value;
      addLine(`<span class="output">Hello <span class="highlight">${escapeHtml(username.value)}</span></span>`);
      await delay(300);
      currentStep.value = 'password';
      currentCommand.value = '';
    } else if (currentStep.value === 'password') {
      addLine(`<span class="prompt">password:</span> <span class="command">${'*'.repeat(currentCommand.value.length)}</span>`);
      if (!value) {
        addLine('<span class="error">Password cannot be empty</span>');
        isProcessing.value = false;
        currentCommand.value = '';
        await nextTick(() => focusInput());
        return;
      }
      password.value = value;
      await authenticateUser();
      currentCommand.value = '';
    } else if (currentStep.value === 'main') {
      addLine(`<span class="prompt user">${escapeHtml(username.value)}@secure-server:~$</span> <span class="command">${escapeHtml(value)}</span>`);
      if (value) {
        await executeCommand(value);
      }
      currentCommand.value = '';
    }
    isProcessing.value = false;
    await nextTick(() => focusInput());
  }
};

const authenticateUser = async () => {
  addLine('<span class="output">Authenticating<span class="loading-dots"></span></span>');
  await delay(2000);
  const success = Math.random() > 0.1;
  if (success) {
    await showSuccessLogin();
  } else {
    await showFailedLogin();
  }
};

const showSuccessLogin = async () => {
  addLine('<span class="success">✓ Authentication successful</span>');
  await delay(500);
  addLine('<span class="success">✓ Generating secure session</span>');
  await delay(300);
  addLine('<span class="success">✓ Loading user environment</span>');
  await delay(500);

  const welcomeBanner = `
    <div class="welcome-banner">
      <h3 style="color: var(--accent); margin-bottom: 12px;">🎉 Welcome ${escapeHtml(username.value)}!</h3>
      <p style="color: var(--text-secondary); margin-bottom: 8px;">You have successfully logged into the secure system</p>
      <p style="color: var(--text-muted); font-size: 12px;">Session ID: ${Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
      <p style="color: var(--text-muted); font-size: 12px;">Login time: ${new Date().toLocaleString()}</p>
    </div>
  `;
  addLine(welcomeBanner);
  await delay(800);
  currentStep.value = 'main';
  await nextTick(() => focusInput());
};

const showFailedLogin = async () => {
  addLine('<span class="error">✗ Authentication failed</span>');
  await delay(300);
  addLine('<span class="error">Invalid username or password</span>');
  await delay(500);
  addLine('<span class="warning">Please try again...</span>');
  await delay(1000);
  username.value = '';
  password.value = '';
  currentStep.value = 'username';
  await nextTick(() => focusInput());
};

const executeCommand = async (command) => {
  const cmd = command.toLowerCase();
  switch (cmd) {
    case 'help':
      const helpText = `
        <div style="margin: 12px 0; color: var(--text-secondary);">
          <strong style="color: var(--accent);">Available Commands:</strong><br>
          <span class="highlight">help</span> - Show this help message<br>
          <span class="highlight">whoami</span> - Display current user<br>
          <span class="highlight">date</span> - Show current date and time<br>
          <span class="highlight">pwd</span> - Show current directory<br>
          <span class="highlight">clear</span> - Clear terminal screen<br>
          <span class="highlight">logout</span> or <span class="highlight">exit</span> - End session
        </div>
      `;
      addLine(helpText);
      break;
    case 'whoami':
      addLine(`<span class="output">${escapeHtml(username.value)}</span>`);
      break;
    case 'date':
      addLine(`<span class="output">${new Date().toString()}</span>`);
      break;
    case 'pwd':
      addLine(`<span class="output">/home/${escapeHtml(username.value)}</span>`);
      break;
    case 'logout':
    case 'exit':
      addLine('<span class="warning">Logging out...</span>');
      await delay(1000);
      addLine('<span class="success">Session terminated. Goodbye!</span>');
      await delay(2000);
      // Simuler reload
      location.reload();
      return;
    case 'clear':
      lines.value = [];
      return;
    default:
      addLine(`<span class="error">Command not found: ${escapeHtml(command)}</span>`);
      addLine(`<span class="output">Type 'help' to see available commands</span>`);
  }
};

const focusInput = () => {
  if (inputRef.value) {
    inputRef.value.focus();
  }
};

const escapeHtml = (text) => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};
</script>