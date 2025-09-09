/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from "react";
import "./assets/style.css";

const App = () => {
    const [lines, setLines] = useState([]);
    const [currentStep, setCurrentStep] = useState("init");
    const [username, setUsername] = useState("");
    const [_password, setPassword] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [currentCommand, setCurrentCommand] = useState("");
    const terminalBodyRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        init();
    }, []);

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

        addLine(<div className="ascii-art">{asciiArt}</div>);
        await delay(500);
        addLine(
            <span className="success">Welcome to SecureShell Terminal v2.1.0</span>
        );
        await delay(300);
        addLine(<span className="output">Initializing secure connection...</span>);

        // Progress bar simulation
        addLine(
            <div className="progress-bar">
                <div
                    className="progress-fill"
                    style={{ width: "0%" }}
                    id="progress"
                ></div>
            </div>
        );
        const progress = document.getElementById("progress");
        if (progress) {
            for (let i = 0; i <= 100; i += 10) {
                progress.style.width = i + "%";
                await delay(50);
            }
        }

        await delay(200);
        addLine(<span className="success">✓ Connection secured</span>);
    };

    const showSystemInfo = async () => {
        const now = new Date();
        addLine(
            <div className="system-info">
                <strong>System Information</strong>
                <br />
                Hostname: <span className="highlight">secure-server.dev</span>
                <br />
                IP: <span className="highlight">192.168.1.100</span>
                <br />
                Last login: {now.toLocaleDateString()} {now.toLocaleTimeString()}
                <br />
                Shell: <span className="highlight">zsh 5.9</span>
            </div>
        );
    };

    const startLoginProcess = async () => {
        await delay(500);
        addLine(
            <span className="warning">Authentication required for secure access</span>
        );
        await delay(300);
        setCurrentStep("username");
    };

    const addLine = (content) => {
        setLines((prev) => [
            ...prev,
            { key: Date.now() + Math.random(), content, type: "line" },
        ]);
        scrollToBottom();
    };

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const scrollToBottom = () => {
        if (terminalBodyRef.current) {
            terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
        }
    };

    const handleInput = (e) => {
        setCurrentCommand(e.target.value);
    };

    const handleKeyPress = async (e) => {
        if (e.key === "Enter" && !isProcessing) {
            setIsProcessing(true);
            if (currentStep === "username") {
                if (!currentCommand.trim()) {
                    addLine(<span className="error">Username cannot be empty</span>);
                    setIsProcessing(false);
                    return;
                }
                setUsername(currentCommand.trim());
                addLine(
                    <span className="output">
                        Hello <span className="highlight">{currentCommand.trim()}</span>
                    </span>
                );
                await delay(300);
                setCurrentStep("password");
                setCurrentCommand("");
            } else if (currentStep === "password") {
                if (!currentCommand.trim()) {
                    addLine(<span className="error">Password cannot be empty</span>);
                    setIsProcessing(false);
                    return;
                }
                setPassword(currentCommand);
                await authenticateUser();
            } else if (currentStep === "main") {
                await executeCommand(currentCommand.trim());
            }
            setIsProcessing(false);
        }
    };

    const authenticateUser = async () => {
        addLine(<span className="output">Authenticating...</span>);
        await delay(2000);
        const success = Math.random() > 0.1;
        if (success) {
            await showSuccessLogin();
        } else {
            await showFailedLogin();
        }
    };

    const showSuccessLogin = async () => {
        addLine(<span className="success">✓ Authentication successful</span>);
        await delay(500);
        addLine(<span className="success">✓ Generating secure session</span>);
        await delay(300);
        addLine(<span className="success">✓ Loading user environment</span>);
        await delay(500);

        const welcomeBanner = (
            <div className="welcome-banner">
                <h3 style={{ color: "var(--accent)", marginBottom: "12px" }}>
                    🎉 Welcome {username}!
                </h3>
                <p style={{ color: "var(--text-secondary)", marginBottom: "8px" }}>
                    You have successfully logged into the secure system
                </p>
                <p style={{ color: "var(--text-muted)", fontSize: "12px" }}>
                    Session ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
                </p>
                <p style={{ color: "var(--text-muted)", fontSize: "12px" }}>
                    Login time: {new Date().toLocaleString()}
                </p>
            </div>
        );
        addLine(welcomeBanner);
        await delay(800);
        setCurrentStep("main");
    };

    const showFailedLogin = async () => {
        addLine(<span className="error">✗ Authentication failed</span>);
        await delay(300);
        addLine(<span className="error">Invalid username or password</span>);
        await delay(500);
        addLine(<span className="warning">Please try again...</span>);
        await delay(1000);
        setUsername("");
        setPassword("");
        setCurrentStep("username");
    };

    const executeCommand = async (command) => {
        const cmd = command.toLowerCase();
        switch (cmd) {
            case "help":
                { const helpText = (
                    <div style={{ margin: "12px 0", color: "var(--text-secondary)" }}>
                        <strong style={{ color: "var(--accent)" }}>
                            Available Commands:
                        </strong>
                        <br />
                        <span className="highlight">help</span> - Show this help message
                        <br />
                        <span className="highlight">whoami</span> - Display current user
                        <br />
                        <span className="highlight">date</span> - Show current date and time
                        <br />
                        <span className="highlight">pwd</span> - Show current directory
                        <br />
                        <span className="highlight">clear</span> - Clear terminal screen
                        <br />
                        <span className="highlight">logout</span> or{" "}
                        <span className="highlight">exit</span> - End session
                    </div>
                );
                addLine(helpText);
                break; }
            case "whoami":
                addLine(<span className="output">{username}</span>);
                break;
            case "date":
                addLine(<span className="output">{new Date().toString()}</span>);
                break;
            case "pwd":
                addLine(<span className="output">/home/{username}</span>);
                break;
            case "logout":
            case "exit":
                addLine(<span className="warning">Logging out...</span>);
                await delay(1000);
                addLine(<span className="success">Session terminated. Goodbye!</span>);
                await delay(2000);
                // Simuler reload
                window.location.reload();
                return;
            case "clear":
                setLines([]);
                return;
            default:
                addLine(<span className="error">Command not found: {command}</span>);
                addLine(
                    <span className="output">Type 'help' to see available commands</span>
                );
        }
        setCurrentCommand("");
    };

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [currentStep, lines]);

    const renderInput = () => {
        if (currentStep === "username") {
            return (
                <div className="input-line">
                    <span className="prompt">login:</span>
                    <input
                        ref={inputRef}
                        type="text"
                        className="input-field"
                        value={currentCommand}
                        onChange={handleInput}
                        onKeyPress={handleKeyPress}
                        placeholder="Entrez votre nom d'utilisateur"
                    />
                    <span
                        className="cursor"
                        style={{ display: currentCommand ? "none" : "inline-block" }}
                    ></span>
                </div>
            );
        } else if (currentStep === "password") {
            return (
                <div className="input-line">
                    <span className="prompt">password:</span>
                    <input
                        ref={inputRef}
                        type="password"
                        className="input-field"
                        value={currentCommand}
                        onChange={handleInput}
                        onKeyPress={handleKeyPress}
                        placeholder=""
                    />
                    <span
                        className="cursor"
                        style={{ display: currentCommand ? "none" : "inline-block" }}
                    ></span>
                </div>
            );
        } else if (currentStep === "main") {
            return (
                <div className="input-line">
                    <span className="prompt user">{username}@secure-server:~$</span>
                    <input
                        ref={inputRef}
                        type="text"
                        className="input-field"
                        value={currentCommand}
                        onChange={handleInput}
                        onKeyPress={handleKeyPress}
                        placeholder="Tapez 'help' pour voir les commandes disponibles"
                    />
                    <span
                        className="cursor"
                        style={{ display: currentCommand ? "none" : "inline-block" }}
                    ></span>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="terminal">
            <div className="terminal-header">
                <div className="terminal-buttons">
                    <div className="btn close"></div>
                    <div className="btn minimize"></div>
                    <div className="btn maximize"></div>
                </div>
                <div className="terminal-title">
                    <span className="status-indicator"></span>
                    zsh 5.9 - secure session
                </div>
            </div>
            <div className="terminal-body" ref={terminalBodyRef}>
                {lines.map((line) => (
                    <div key={line.key} className="line">
                        {line.content}
                    </div>
                ))}
                {renderInput()}
            </div>
        </div>
    );
};

export default App;
