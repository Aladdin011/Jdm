import { useAppStore } from "@/stores/appStore";

// Accessibility Configuration
export interface AccessibilityConfig {
  reduceMotion: boolean;
  highContrast: boolean;
  largeText: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  colorBlindness: "none" | "protanopia" | "deuteranopia" | "tritanopia";
  focusVisible: boolean;
}

// Voice Commands Interface
export interface VoiceCommand {
  phrases: string[];
  action: () => void;
  description: string;
  category: "navigation" | "interaction" | "content";
}

// Advanced Accessibility Engine
export class AccessibilityEngine {
  private config: AccessibilityConfig;
  private voiceCommands: Map<string, VoiceCommand> = new Map();
  private recognition?: SpeechRecognition;
  private synthesis: SpeechSynthesis;
  private focusTracker: Element | null = null;

  constructor() {
    this.config = this.detectAccessibilityNeeds();
    this.synthesis = window.speechSynthesis;
    this.initializeVoiceCommands();
    this.setupKeyboardNavigation();
    this.setupFocusManagement();
    this.applyAccessibilityEnhancements();
  }

  // Detect user accessibility needs
  private detectAccessibilityNeeds(): AccessibilityConfig {
    const preferredColorScheme = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const highContrast = window.matchMedia("(prefers-contrast: high)").matches;

    // Check for assistive technology
    const hasScreenReader = this.detectScreenReader();

    return {
      reduceMotion: reducedMotion,
      highContrast: highContrast,
      largeText: false, // User preference
      screenReader: hasScreenReader,
      keyboardNavigation: true,
      colorBlindness: "none", // Would be detected via user testing or preferences
      focusVisible: true,
    };
  }

  private detectScreenReader(): boolean {
    // Detect common screen readers
    const userAgent = navigator.userAgent.toLowerCase();
    const screenReaders = ["nvda", "jaws", "voiceover", "talkback", "dragon"];
    return screenReaders.some((sr) => userAgent.includes(sr));
  }

  // AI-powered alt text generation
  async generateAltText(imageUrl: string, context?: string): Promise<string> {
    try {
      // In a real implementation, this would call an AI vision service
      // For demo purposes, we'll return contextual descriptions

      if (context?.includes("portfolio") || context?.includes("project")) {
        return await this.generateProjectAltText(imageUrl, context);
      } else if (context?.includes("team") || context?.includes("about")) {
        return await this.generateTeamAltText(imageUrl, context);
      } else if (context?.includes("service")) {
        return await this.generateServiceAltText(imageUrl, context);
      }

      // Fallback to basic description
      return this.generateBasicAltText(imageUrl);
    } catch (error) {
      console.warn("Failed to generate alt text:", error);
      return "Image content could not be described";
    }
  }

  private async generateProjectAltText(
    imageUrl: string,
    context: string,
  ): Promise<string> {
    // Simulate AI analysis
    const projectTypes = [
      "residential building",
      "commercial complex",
      "infrastructure project",
      "urban development",
    ];
    const randomType =
      projectTypes[Math.floor(Math.random() * projectTypes.length)];

    const features = [
      "modern architecture",
      "sustainable design",
      "innovative construction",
      "community-focused",
    ];
    const randomFeature = features[Math.floor(Math.random() * features.length)];

    return `${randomType} featuring ${randomFeature}, part of JD Marc Limited's portfolio showcasing African urban development`;
  }

  private async generateTeamAltText(
    imageUrl: string,
    context: string,
  ): Promise<string> {
    return "Professional headshot of JD Marc Limited team member, contributing to African infrastructure development";
  }

  private async generateServiceAltText(
    imageUrl: string,
    context: string,
  ): Promise<string> {
    const services = [
      "construction equipment",
      "architectural planning",
      "infrastructure development",
      "project management",
    ];
    const randomService = services[Math.floor(Math.random() * services.length)];

    return `Visual representation of ${randomService} services offered by JD Marc Limited for African development projects`;
  }

  private generateBasicAltText(imageUrl: string): string {
    // Extract meaningful information from URL if possible
    const filename = imageUrl.split("/").pop()?.split(".")[0] || "";
    const cleanName = filename.replace(/[-_]/g, " ").toLowerCase();

    if (cleanName) {
      return `Image depicting ${cleanName} related to JD Marc Limited's construction and development services`;
    }

    return "Relevant image content supporting the page information";
  }

  // Voice Commands System
  private initializeVoiceCommands(): void {
    // Navigation commands
    this.voiceCommands.set("go to portfolio", {
      phrases: [
        "go to portfolio",
        "show portfolio",
        "view projects",
        "see our work",
      ],
      action: () => this.navigateToSection("portfolio"),
      description: "Navigate to the portfolio section",
      category: "navigation",
    });

    this.voiceCommands.set("go to contact", {
      phrases: [
        "go to contact",
        "contact us",
        "get in touch",
        "book consultation",
      ],
      action: () => this.navigateToSection("contact"),
      description: "Navigate to the contact section",
      category: "navigation",
    });

    this.voiceCommands.set("go to services", {
      phrases: [
        "go to services",
        "show services",
        "what do you do",
        "our services",
      ],
      action: () => this.navigateToSection("services"),
      description: "Navigate to the services section",
      category: "navigation",
    });

    // Accessibility commands
    this.voiceCommands.set("increase text size", {
      phrases: [
        "increase text size",
        "make text larger",
        "bigger text",
        "zoom in",
      ],
      action: () => this.adjustTextSize("increase"),
      description: "Increase the text size for better readability",
      category: "interaction",
    });

    this.voiceCommands.set("decrease text size", {
      phrases: [
        "decrease text size",
        "make text smaller",
        "smaller text",
        "zoom out",
      ],
      action: () => this.adjustTextSize("decrease"),
      description: "Decrease the text size",
      category: "interaction",
    });

    this.voiceCommands.set("high contrast", {
      phrases: [
        "high contrast",
        "increase contrast",
        "better contrast",
        "dark mode",
      ],
      action: () => this.toggleHighContrast(),
      description: "Toggle high contrast mode for better visibility",
      category: "interaction",
    });

    this.voiceCommands.set("read page", {
      phrases: ["read page", "read this", "speak content", "voice over"],
      action: () => this.readPageContent(),
      description: "Read the current page content aloud",
      category: "content",
    });

    // Set up voice recognition
    this.setupVoiceRecognition();
  }

  private setupVoiceRecognition(): void {
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();

      this.recognition.continuous = true;
      this.recognition.interimResults = false;
      this.recognition.lang = "en-US";

      this.recognition.onresult = (event) => {
        const lastResult = event.results[event.results.length - 1];
        if (lastResult.isFinal) {
          const command = lastResult[0].transcript.toLowerCase().trim();
          this.processVoiceCommand(command);
        }
      };

      this.recognition.onerror = (event) => {
        console.warn("Voice recognition error:", event.error);
      };
    }
  }

  private processVoiceCommand(command: string): void {
    for (const [key, voiceCommand] of this.voiceCommands) {
      if (voiceCommand.phrases.some((phrase) => command.includes(phrase))) {
        this.speak(`Executing: ${voiceCommand.description}`);
        voiceCommand.action();
        return;
      }
    }

    // If no exact match, try fuzzy matching
    const bestMatch = this.findBestCommandMatch(command);
    if (bestMatch) {
      this.speak(`Did you mean: ${bestMatch.description}? Say yes to confirm.`);
      // Implementation for confirmation would go here
    } else {
      this.speak(
        'Command not recognized. Say "help" to hear available commands.',
      );
    }
  }

  private findBestCommandMatch(command: string): VoiceCommand | null {
    let bestScore = 0;
    let bestCommand: VoiceCommand | null = null;

    for (const voiceCommand of this.voiceCommands.values()) {
      for (const phrase of voiceCommand.phrases) {
        const score = this.calculateSimilarity(command, phrase);
        if (score > bestScore && score > 0.6) {
          bestScore = score;
          bestCommand = voiceCommand;
        }
      }
    }

    return bestCommand;
  }

  private calculateSimilarity(str1: string, str2: string): number {
    const words1 = str1.split(" ");
    const words2 = str2.split(" ");
    const commonWords = words1.filter((word) => words2.includes(word));
    return commonWords.length / Math.max(words1.length, words2.length);
  }

  // Navigation helpers
  private navigateToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      element.focus();

      // Update app store
      const { setCurrentSection } = useAppStore.getState();
      setCurrentSection(sectionId);
    }
  }

  // Text-to-speech functionality
  speak(
    text: string,
    options?: { rate?: number; pitch?: number; volume?: number },
  ): void {
    if (this.synthesis && text) {
      // Cancel any ongoing speech
      this.synthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = options?.rate || 0.8;
      utterance.pitch = options?.pitch || 1;
      utterance.volume = options?.volume || 0.8;

      // Use a more natural voice if available
      const voices = this.synthesis.getVoices();
      const preferredVoice =
        voices.find(
          (voice) =>
            voice.lang.startsWith("en") && voice.name.includes("Natural"),
        ) || voices.find((voice) => voice.lang.startsWith("en"));

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      this.synthesis.speak(utterance);
    }
  }

  // Read page content
  private readPageContent(): void {
    const mainContent = document.querySelector("main") || document.body;
    const headings = mainContent.querySelectorAll("h1, h2, h3");
    const paragraphs = mainContent.querySelectorAll("p");

    let content = "";

    // Add page title
    content += `Page: ${document.title}. `;

    // Add main headings
    headings.forEach((heading, index) => {
      if (index < 3) {
        // Limit to first 3 headings
        content += `${heading.textContent}. `;
      }
    });

    // Add first few paragraphs
    paragraphs.forEach((paragraph, index) => {
      if (
        index < 2 &&
        paragraph.textContent &&
        paragraph.textContent.length > 20
      ) {
        content += `${paragraph.textContent}. `;
      }
    });

    this.speak(content);
  }

  // Text size adjustment
  private adjustTextSize(direction: "increase" | "decrease"): void {
    const html = document.documentElement;
    const currentSize = parseFloat(getComputedStyle(html).fontSize);
    const increment = direction === "increase" ? 2 : -2;
    const newSize = Math.max(12, Math.min(24, currentSize + increment));

    html.style.fontSize = `${newSize}px`;

    // Update app store
    const { setFontSize } = useAppStore.getState();
    if (newSize > 18) setFontSize("large");
    else if (newSize < 14) setFontSize("small");
    else setFontSize("medium");

    this.speak(
      `Text size ${direction === "increase" ? "increased" : "decreased"}`,
    );
  }

  // High contrast toggle
  private toggleHighContrast(): void {
    const body = document.body;
    const isHighContrast = body.classList.contains("high-contrast");

    if (isHighContrast) {
      body.classList.remove("high-contrast");
      this.speak("High contrast disabled");
    } else {
      body.classList.add("high-contrast");
      this.speak("High contrast enabled");
    }

    this.config.highContrast = !isHighContrast;
  }

  // Keyboard navigation setup
  private setupKeyboardNavigation(): void {
    document.addEventListener("keydown", (event) => {
      // Skip navigation
      if (event.key === "Tab" && event.shiftKey) {
        // Handle reverse tab navigation
        this.handleTabNavigation("backward");
      } else if (event.key === "Tab") {
        // Handle forward tab navigation
        this.handleTabNavigation("forward");
      }

      // Quick navigation shortcuts
      if (event.altKey) {
        switch (event.key) {
          case "1":
            event.preventDefault();
            this.navigateToSection("hero");
            break;
          case "2":
            event.preventDefault();
            this.navigateToSection("about");
            break;
          case "3":
            event.preventDefault();
            this.navigateToSection("services");
            break;
          case "4":
            event.preventDefault();
            this.navigateToSection("portfolio");
            break;
          case "5":
            event.preventDefault();
            this.navigateToSection("contact");
            break;
        }
      }
    });
  }

  private handleTabNavigation(direction: "forward" | "backward"): void {
    // Implement smart tab navigation that skips decorative elements
    const focusableElements = this.getFocusableElements();
    const currentIndex = focusableElements.indexOf(
      document.activeElement as HTMLElement,
    );

    let nextIndex;
    if (direction === "forward") {
      nextIndex = currentIndex + 1;
      if (nextIndex >= focusableElements.length) nextIndex = 0;
    } else {
      nextIndex = currentIndex - 1;
      if (nextIndex < 0) nextIndex = focusableElements.length - 1;
    }

    focusableElements[nextIndex]?.focus();
  }

  private getFocusableElements(): HTMLElement[] {
    const selector =
      'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])';
    return Array.from(document.querySelectorAll(selector)) as HTMLElement[];
  }

  // Focus management
  private setupFocusManagement(): void {
    document.addEventListener("focusin", (event) => {
      this.focusTracker = event.target as Element;
      this.handleFocusChange(event.target as HTMLElement);
    });

    document.addEventListener("focusout", (event) => {
      this.handleFocusLoss(event.target as HTMLElement);
    });
  }

  private handleFocusChange(element: HTMLElement): void {
    // Add focus indicators
    if (this.config.focusVisible) {
      element.classList.add("focus-visible");
    }

    // Announce focused element for screen readers
    if (this.config.screenReader) {
      const announcement = this.createFocusAnnouncement(element);
      if (announcement) {
        this.speak(announcement, { rate: 1.2 }); // Faster rate for navigation
      }
    }
  }

  private handleFocusLoss(element: HTMLElement): void {
    element.classList.remove("focus-visible");
  }

  private createFocusAnnouncement(element: HTMLElement): string {
    const tagName = element.tagName.toLowerCase();
    const text = element.textContent?.trim() || "";
    const ariaLabel = element.getAttribute("aria-label");
    const title = element.getAttribute("title");

    const label = ariaLabel || title || text;

    switch (tagName) {
      case "button":
        return `Button: ${label}`;
      case "a":
        return `Link: ${label}`;
      case "input":
        const inputType = element.getAttribute("type") || "text";
        return `${inputType} input: ${label}`;
      case "h1":
      case "h2":
      case "h3":
      case "h4":
      case "h5":
      case "h6":
        return `Heading level ${tagName.charAt(1)}: ${label}`;
      default:
        return label.length > 50 ? "" : label; // Don't announce long content
    }
  }

  // Apply accessibility enhancements
  private applyAccessibilityEnhancements(): void {
    // Apply CSS for high contrast
    if (this.config.highContrast) {
      document.body.classList.add("high-contrast");
    }

    // Apply reduced motion
    if (this.config.reduceMotion) {
      document.documentElement.style.setProperty("--motion-duration", "0ms");
    }

    // Apply large text
    if (this.config.largeText) {
      document.documentElement.style.fontSize = "18px";
    }

    // Add ARIA landmarks if missing
    this.addMissingAriaLandmarks();

    // Improve image accessibility
    this.improveImageAccessibility();
  }

  private addMissingAriaLandmarks(): void {
    // Add main landmark
    const main = document.querySelector("main");
    if (main && !main.getAttribute("role")) {
      main.setAttribute("role", "main");
    }

    // Add navigation landmarks
    const navs = document.querySelectorAll("nav");
    navs.forEach((nav, index) => {
      if (!nav.getAttribute("aria-label")) {
        nav.setAttribute("aria-label", `Navigation ${index + 1}`);
      }
    });

    // Add banner landmark
    const header = document.querySelector("header");
    if (header && !header.getAttribute("role")) {
      header.setAttribute("role", "banner");
    }

    // Add contentinfo landmark
    const footer = document.querySelector("footer");
    if (footer && !footer.getAttribute("role")) {
      footer.setAttribute("role", "contentinfo");
    }
  }

  private async improveImageAccessibility(): void {
    const images = document.querySelectorAll("img:not([alt])");

    for (const img of images) {
      const htmlImg = img as HTMLImageElement;
      const context = this.getImageContext(htmlImg);

      try {
        const altText = await this.generateAltText(htmlImg.src, context);
        htmlImg.setAttribute("alt", altText);
      } catch (error) {
        htmlImg.setAttribute("alt", "Image content");
      }
    }
  }

  private getImageContext(img: HTMLImageElement): string {
    // Get context from surrounding elements
    const parent = img.closest(
      'section, article, div[class*="portfolio"], div[class*="team"], div[class*="service"]',
    );
    if (parent) {
      const className = parent.className.toLowerCase();
      if (className.includes("portfolio") || className.includes("project"))
        return "portfolio";
      if (className.includes("team") || className.includes("about"))
        return "team";
      if (className.includes("service")) return "service";
    }

    return "";
  }

  // Public API methods
  startVoiceCommands(): void {
    if (this.recognition) {
      this.recognition.start();
      this.speak(
        'Voice commands activated. Say "help" for available commands.',
      );
    }
  }

  stopVoiceCommands(): void {
    if (this.recognition) {
      this.recognition.stop();
      this.speak("Voice commands deactivated.");
    }
  }

  listAvailableCommands(): void {
    const commands = Array.from(this.voiceCommands.values())
      .map((cmd) => cmd.description)
      .join(". ");

    this.speak(`Available commands: ${commands}`);
  }

  updateConfig(newConfig: Partial<AccessibilityConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.applyAccessibilityEnhancements();
  }

  getConfig(): AccessibilityConfig {
    return { ...this.config };
  }
}

// Singleton instance
export const accessibilityEngine = new AccessibilityEngine();

// React hook for easy usage
export const useAccessibility = () => {
  return {
    startVoiceCommands:
      accessibilityEngine.startVoiceCommands.bind(accessibilityEngine),
    stopVoiceCommands:
      accessibilityEngine.stopVoiceCommands.bind(accessibilityEngine),
    listCommands:
      accessibilityEngine.listAvailableCommands.bind(accessibilityEngine),
    speak: accessibilityEngine.speak.bind(accessibilityEngine),
    generateAltText:
      accessibilityEngine.generateAltText.bind(accessibilityEngine),
    updateConfig: accessibilityEngine.updateConfig.bind(accessibilityEngine),
    getConfig: accessibilityEngine.getConfig.bind(accessibilityEngine),
  };
};

// CSS styles for accessibility enhancements
export const accessibilityStyles = `
  .high-contrast {
    filter: contrast(1.5) !important;
  }
  
  .high-contrast * {
    border-color: #000 !important;
    color: #000 !important;
    background-color: #fff !important;
  }
  
  .high-contrast a,
  .high-contrast button {
    color: #0000ff !important;
    text-decoration: underline !important;
  }
  
  .focus-visible {
    outline: 3px solid #005fcc !important;
    outline-offset: 2px !important;
  }
  
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
  
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
`;

// Inject accessibility styles
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = accessibilityStyles;
  document.head.appendChild(style);
}
