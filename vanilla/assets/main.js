class TerminalLogin {
    constructor() {
        this.terminalBody = document.getElementById('terminal-body');
        this.currentStep = 'init';
        this.username = '';
        this.password = '';
        this.commandHistory = [];
        this.isProcessing = false;
        this.currentInput = null;
        this.currentInputLine = null;
        this.keyPressListener = null;
        this.inputListener = null;
        this.mainKeyPressListener = null;
        
        this.init();
    }
    
    async init() {
        await this.showWelcome();
        await this.delay(800);
        await this.showSystemInfo();
        await this.delay(500);
        await this.startLoginProcess();
    }
    
    async showWelcome() {
        const asciiArt = `    ███████╗███████╗██╗  ██╗    ████████╗███████╗██████╗ ███╗   ███╗██╗███╗   ██╗ █████╗ ██╗     
╚══███╔╝██╔════╝██║  ██║    ╚══██╔══╝██╔════╝██╔══██╗████╗ ████║██║████╗  ██║██╔══██╗██║     
███╔╝ ███████╗███████║       ██║   █████╗  ██████╔╝██╔████╔██║██║██╔██╗ ██║███████║██║     
███╔╝  ╚════██║██╔══██║       ██║   ██╔══╝  ██╔══██╗██║╚██╔╝██║██║██║╚██╗██║██╔══██║██║     
███████╗███████║██║  ██║       ██║   ███████╗██║  ██║██║ ╚═╝ ██║██║██║ ╚████║██║  ██║███████╗
╚══════╝╚══════╝╚═╝  ╚═╝       ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝`;
        
        this.addLine(`<div class="ascii-art">${asciiArt}</div>`);
        await this.delay(500);
        this.addLine('<span class="success">Welcome to SecureShell Terminal v2.1.0</span>');
        await this.delay(300);
        this.addLine('<span class="output">Initializing secure connection...</span>');
        
        // Barre de progression
        const progressLine = document.createElement('div');
        progressLine.className = 'line';
        progressLine.innerHTML = '<div class="progress-bar"><div class="progress-fill" id="progress"></div></div>';
        this.terminalBody.appendChild(progressLine);
        
        const progress = document.getElementById('progress');
        for (let i = 0; i <= 100; i += 10) {
            progress.style.width = i + '%';
            await this.delay(50);
        }
        
        await this.delay(200);
        this.addLine('<span class="success">✓ Connection secured</span>');
    }
    
    async showSystemInfo() {
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
        this.addLine(systemInfo);
    }
    
    async startLoginProcess() {
        await this.delay(500);
        this.addLine('<span class="warning">Authentication required for secure access</span>');
        await this.delay(300);
        this.requestUsername();
    }
    
    requestUsername() {
        this.currentStep = 'username';
        this.cleanupCurrentInput();
        const inputLine = this.createInputLine('login:', 'Entrez votre nom d\'utilisateur');
        this.terminalBody.appendChild(inputLine);
        this.currentInputLine = inputLine;
        this.focusInput();
    }
    
    requestPassword() {
        this.currentStep = 'password';
        this.cleanupCurrentInput();
        const inputLine = this.createInputLine('password:', '', true);
        this.terminalBody.appendChild(inputLine);
        this.currentInputLine = inputLine;
        this.focusInput();
    }
    
    createInputLine(prompt, placeholder, isPassword = false) {
        const line = document.createElement('div');
        line.className = 'input-line';
        line.innerHTML = `
            <span class="prompt">${prompt}</span>
            <input type="${isPassword ? 'password' : 'text'}" 
                   class="input-field" 
                   placeholder="${placeholder}"
                   autocomplete="${isPassword ? 'current-password' : 'username'}"
                   aria-label="${prompt}">
            <span class="cursor"></span>
        `;
        
        const input = line.querySelector('.input-field');
        this.currentInput = input;
        
        // Bind listeners
        this.keyPressListener = this.handleKeyPress.bind(this);
        this.inputListener = this.handleInput.bind(this);
        input.addEventListener('keypress', this.keyPressListener);
        input.addEventListener('input', this.inputListener);
        
        return line;
    }
    
    cleanupCurrentInput() {
        if (this.currentInput) {
            if (this.keyPressListener) {
                this.currentInput.removeEventListener('keypress', this.keyPressListener);
            }
            if (this.inputListener) {
                this.currentInput.removeEventListener('input', this.inputListener);
            }
            if (this.mainKeyPressListener) {
                this.currentInput.removeEventListener('keypress', this.mainKeyPressListener);
            }
            this.currentInput = null;
            this.keyPressListener = null;
            this.inputListener = null;
            this.mainKeyPressListener = null;
        }
    }
    
    handleKeyPress(e) {
        if (e.key === 'Enter' && !this.isProcessing) {
            this.processInput(e.target.value);
        }
    }
    
    handleInput(e) {
        // Masquer le curseur pendant la saisie
        const cursor = e.target.parentElement?.querySelector('.cursor');
        if (cursor) {
            cursor.style.display = e.target.value ? 'none' : 'inline-block';
        }
    }
    
    async processInput(value) {
        if (this.isProcessing) return;
        this.isProcessing = true;
        
        // Masquer l'input actuel et curseur, ajouter la commande
        if (this.currentInputLine) {
            const input = this.currentInputLine.querySelector('.input-field');
            const cursor = this.currentInputLine.querySelector('.cursor');
            if (input) input.style.display = 'none';
            if (cursor) cursor.style.display = 'none';
            
            // Afficher la valeur saisie (masquée pour le mot de passe)
            if (this.currentStep === 'password') {
                this.currentInputLine.innerHTML += '<span class="command">' + '*'.repeat(value.length) + '</span>';
            } else {
                this.currentInputLine.innerHTML += '<span class="command">' + this.escapeHtml(value) + '</span>';
            }
        }
        
        if (this.currentStep === 'username') {
            if (!value.trim()) {
                this.addLine('<span class="error">Username cannot be empty</span>');
                this.isProcessing = false;
                await this.delay(500);
                this.requestUsername();
                return;
            }
            
            this.username = value.trim();
            await this.delay(200);
            this.addLine(`<span class="output">Hello <span class="highlight">${this.escapeHtml(this.username)}</span></span>`);
            await this.delay(300);
            this.requestPassword();
            
        } else if (this.currentStep === 'password') {
            if (!value.trim()) {
                this.addLine('<span class="error">Password cannot be empty</span>');
                this.isProcessing = false;
                await this.delay(500);
                this.requestPassword();
                return;
            }
            
            this.password = value;
            await this.authenticateUser();
        }
        
        this.isProcessing = false;
    }
    
    async authenticateUser() {
        this.addLine('<span class="output">Authenticating<span class="loading-dots"></span></span>');
        
        // Simulation de l'authentification
        await this.delay(2000);
        
        // 90% de chance de succès pour la démo
        const success = Math.random() > 0.1;
        
        if (success) {
            await this.showSuccessLogin();
        } else {
            await this.showFailedLogin();
        }
    }
    
    async showSuccessLogin() {
        this.addLine('<span class="success">✓ Authentication successful</span>');
        await this.delay(500);
        this.addLine('<span class="success">✓ Generating secure session</span>');
        await this.delay(300);
        this.addLine('<span class="success">✓ Loading user environment</span>');
        await this.delay(500);
        
        const welcomeBanner = `
            <div class="welcome-banner">
                <h3 style="color: var(--accent); margin-bottom: 12px;">🎉 Welcome ${this.escapeHtml(this.username)}!</h3>
                <p style="color: var(--text-secondary); margin-bottom: 8px;">You have successfully logged into the secure system</p>
                <p style="color: var(--text-muted); font-size: 12px;">Session ID: ${this.generateSessionId()}</p>
                <p style="color: var(--text-muted); font-size: 12px;">Login time: ${new Date().toLocaleString()}</p>
            </div>
        `;
        
        this.addLine(welcomeBanner);
        await this.delay(800);
        
        // Afficher le prompt final
        this.showMainPrompt();
    }
    
    async showFailedLogin() {
        this.addLine('<span class="error">✗ Authentication failed</span>');
        await this.delay(300);
        this.addLine('<span class="error">Invalid username or password</span>');
        await this.delay(500);
        this.addLine('<span class="warning">Please try again...</span>');
        await this.delay(1000);
        
        // Réinitialiser pour un nouvel essai
        this.username = '';
        this.password = '';
        this.requestUsername();
    }
    
    showMainPrompt() {
        this.cleanupCurrentInput();
        const promptLine = document.createElement('div');
        promptLine.className = 'input-line';
        promptLine.innerHTML = `
            <span class="prompt user">${this.escapeHtml(this.username)}@secure-server:~$</span>
            <input type="text" class="input-field" placeholder="Tapez 'help' pour voir les commandes disponibles" aria-label="Command input">
            <span class="cursor"></span>
        `;
        
        const input = promptLine.querySelector('.input-field');
        this.currentInput = input;
        this.currentInputLine = promptLine;
        
        // Bind listener for main
        this.mainKeyPressListener = this.handleMainCommand.bind(this);
        this.inputListener = this.handleInput.bind(this);
        input.addEventListener('keypress', this.mainKeyPressListener);
        input.addEventListener('input', this.inputListener);
        
        this.terminalBody.appendChild(promptLine);
        this.focusInput();
    }
    
    handleMainCommand(e) {
        if (e.key === 'Enter') {
            const command = e.target.value.trim();
            if (command) {
                // Convertir l'input-line actuel en ligne statique
                const input = this.currentInputLine.querySelector('.input-field');
                const cursor = this.currentInputLine.querySelector('.cursor');
                if (input) input.style.display = 'none';
                if (cursor) cursor.style.display = 'none';
                
                this.currentInputLine.innerHTML += '<span class="command">' + this.escapeHtml(command) + '</span>';
                
                // Exécuter la commande
                this.executeCommand(command);
            }
        }
    }
    
    executeCommand(command) {
        // Plus besoin d'ajouter la ligne de commande, car déjà fait
        
        // Traiter la commande
        const cmd = command.toLowerCase();
        let showNewPrompt = true;
        
        switch (cmd) {
            case 'help':
                this.showHelp();
                break;
            case 'whoami':
                this.addLine(`<span class="output">${this.escapeHtml(this.username)}</span>`);
                break;
            case 'date':
                this.addLine(`<span class="output">${new Date().toString()}</span>`);
                break;
            case 'pwd':
                this.addLine(`<span class="output">/home/${this.escapeHtml(this.username)}</span>`);
                break;
            case 'logout':
            case 'exit':
                this.logout();
                showNewPrompt = false;
                return; // Ne pas afficher de nouveau prompt
            case 'clear':
                this.clearTerminal();
                showNewPrompt = false;
                return; // clearTerminal affiche déjà un nouveau prompt
            default:
                this.addLine(`<span class="error">Command not found: ${this.escapeHtml(command)}</span>`);
                this.addLine(`<span class="output">Type 'help' to see available commands</span>`);
        }
        
        // Afficher un nouveau prompt après l'exécution de la commande si nécessaire
        if (showNewPrompt) {
            this.showMainPrompt();
        }
    }
    
    showHelp() {
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
        this.addLine(helpText);
    }
    
    logout() {
        this.cleanupCurrentInput();
        this.addLine('<span class="warning">Logging out...</span>');
        setTimeout(() => {
            this.addLine('<span class="success">Session terminated. Goodbye!</span>');
            setTimeout(() => {
                location.reload();
            }, 2000);
        }, 1000);
    }
    
    clearTerminal() {
        this.cleanupCurrentInput();
        this.terminalBody.innerHTML = '';
        this.showMainPrompt();
    }
    
    generateSessionId() {
        return Math.random().toString(36).substr(2, 9).toUpperCase();
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    addLine(content, className = '') {
        const line = document.createElement('div');
        line.className = 'line';
        if (className) line.classList.add(className);
        line.innerHTML = content;
        this.terminalBody.appendChild(line);
        this.scrollToBottom();
    }
    
    focusInput() {
        setTimeout(() => {
            const input = this.terminalBody.querySelector('.input-field:last-of-type');
            if (input && input.style.display !== 'none') {
                input.focus();
            }
        }, 100);
    }
    
    scrollToBottom() {
        this.terminalBody.scrollTop = this.terminalBody.scrollHeight;
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialiser le terminal au chargement
let terminalInstance = null;
window.addEventListener('load', () => {
    terminalInstance = new TerminalLogin();
});

// Cleanup au besoin
window.addEventListener('beforeunload', () => {
    if (terminalInstance) {
        terminalInstance.cleanupCurrentInput();
    }
});